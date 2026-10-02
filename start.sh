#!/usr/bin/env bash
# ==============================================================================
# Saphire AOCS - one-command local startup (Spring Boot backend + Vite frontend)
#
# Prerequisites: JDK 17, Node 20+, pnpm (or `corepack enable`), and a running PostgreSQL with an
# empty database named aocs_db (`createdb aocs_db`). The backend's Flyway migrations build the
# schema and load the demo dataset on first boot, so no other setup is needed.
#
# Usage: ./start.sh        Ctrl+C stops both servers.
# ==============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT/backend"
FRONTEND_DIR="$ROOT/frontend"
LOGS_DIR="$ROOT/logs"
BACKEND_WAIT_SECONDS="${BACKEND_WAIT_SECONDS:-180}"   # first boot loads ~158k rows
mkdir -p "$LOGS_DIR"

say()  { printf '%s\n' "$*"; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

# --- Java 17 -------------------------------------------------------------------
# The backend is built for Java 17; a newer default JDK (common with Homebrew) breaks the Lombok
# compile step. Prefer an explicit JDK 17 when JAVA_HOME isn't already pointing at one.
java_major() { "$1" -version 2>&1 | sed -n 's/.*version "\([0-9]*\).*/\1/p' | head -1; }
pick_java17() {
  # `java_home -v 17` means "17 or newer" on macOS (it happily returns JDK 25), so check the real
  # major version of each candidate instead of trusting it.
  local c
  for c in "${JAVA_HOME:-}" \
           "$(/usr/libexec/java_home -v 17 2>/dev/null)" \
           /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home \
           /usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home \
           /Library/Java/JavaVirtualMachines/*17*/Contents/Home \
           /usr/lib/jvm/java-17-openjdk-* /usr/lib/jvm/temurin-17-*; do
    [ -n "$c" ] && [ -x "$c/bin/java" ] && [ "$(java_major "$c/bin/java")" = "17" ] && { printf '%s' "$c"; return 0; }
  done
  return 1
}
if J17="$(pick_java17)"; then export JAVA_HOME="$J17"; fi
command -v java >/dev/null 2>&1 || [ -x "${JAVA_HOME:-/nonexistent}/bin/java" ] || fail "Java not found. Install JDK 17 and/or set JAVA_HOME."
JAVA_BIN="${JAVA_HOME:+$JAVA_HOME/bin/}java"
[ "$(java_major "$JAVA_BIN")" = "17" ] || say "WARNING: Java $(java_major "$JAVA_BIN") detected; the backend expects Java 17 (set JAVA_HOME to a JDK 17)."

# --- Tooling -------------------------------------------------------------------
command -v node >/dev/null 2>&1 || fail "Node.js not found (need 20+)."
if ! command -v pnpm >/dev/null 2>&1; then
  command -v corepack >/dev/null 2>&1 && corepack enable >/dev/null 2>&1
  command -v pnpm >/dev/null 2>&1 || fail "pnpm not found. Install it (npm i -g pnpm) or run 'corepack enable'."
fi

# --- PostgreSQL ----------------------------------------------------------------
if command -v pg_isready >/dev/null 2>&1; then
  pg_isready -h localhost -p 5432 >/dev/null 2>&1 || fail "PostgreSQL is not accepting connections on localhost:5432. Start it first (Postgres.app needs its server started, not just the app opened)."
elif ! (exec 3<>/dev/tcp/127.0.0.1/5432) 2>/dev/null; then
  fail "Nothing is listening on localhost:5432. Start PostgreSQL first."
fi

# --- Ports ---------------------------------------------------------------------
for port in 8080 3000; do
  if lsof -ti ":$port" >/dev/null 2>&1; then
    fail "Port $port is already in use (an earlier run, or another program). Stop it first, e.g.:  lsof -ti :$port | xargs kill"
  fi
done

BACKEND_PID=""; FRONTEND_PID=""
cleanup() {
  trap - EXIT INT TERM
  say ""; say "Stopping Saphire AOCS..."
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
  [ -n "$BACKEND_PID" ]  && kill "$BACKEND_PID"  2>/dev/null
  # mvn spawns the actual app as a child process; make sure nothing keeps the ports.
  lsof -ti :8080 2>/dev/null | xargs kill 2>/dev/null
  lsof -ti :3000 2>/dev/null | xargs kill 2>/dev/null
  say "Stopped."
}
trap cleanup EXIT INT TERM

# --- Backend -------------------------------------------------------------------
say "[1/2] Starting backend on :8080 (log: logs/backend.log)"
say "      First boot applies the database migrations and loads the demo data; this can take a couple of minutes."
( cd "$BACKEND_DIR" && chmod +x mvnw && ./mvnw -q clean spring-boot:run -Dmaven.test.skip=true >"$LOGS_DIR/backend.log" 2>&1 ) &
BACKEND_PID=$!

waited=0
until curl -fsS http://localhost:8080/actuator/health 2>/dev/null | grep -q '"status":"UP"'; do
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    say ""; tail -n 40 "$LOGS_DIR/backend.log"
    fail "Backend exited during startup. See the log excerpt above (full log: logs/backend.log)."
  fi
  if [ "$waited" -ge "$BACKEND_WAIT_SECONDS" ]; then
    tail -n 40 "$LOGS_DIR/backend.log"
    fail "Backend not healthy after ${BACKEND_WAIT_SECONDS}s. See logs/backend.log (raise BACKEND_WAIT_SECONDS if it's still migrating)."
  fi
  sleep 2; waited=$((waited + 2)); printf '.'
done
say ""; say "      Backend is UP."

# --- Frontend ------------------------------------------------------------------
say "[2/2] Starting frontend on :3000"
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  say "      Installing frontend dependencies (first run)..."
  ( cd "$FRONTEND_DIR" && pnpm install --frozen-lockfile ) || fail "pnpm install failed."
fi
( cd "$FRONTEND_DIR" && pnpm run dev -- --host >"$LOGS_DIR/frontend.log" 2>&1 ) &
FRONTEND_PID=$!

waited=0
until curl -fsS -o /dev/null http://localhost:3000/ 2>/dev/null; do
  if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    tail -n 30 "$LOGS_DIR/frontend.log"; fail "Frontend exited during startup (log: logs/frontend.log)."
  fi
  [ "$waited" -ge 60 ] && { tail -n 30 "$LOGS_DIR/frontend.log"; fail "Frontend not responding after 60s."; }
  sleep 1; waited=$((waited + 1))
done

say ""
say "=============================================================="
say " Saphire AOCS is running"
say "   Public portal : http://localhost:3000"
say "   Staff login   : http://localhost:3000/login"
say "   API           : http://localhost:8080/api/flights"
say "   API docs      : http://localhost:8080/swagger-ui.html"
say " Press Ctrl+C to stop."
say "=============================================================="
wait "$FRONTEND_PID" "$BACKEND_PID"
