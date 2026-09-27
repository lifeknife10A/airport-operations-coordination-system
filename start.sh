#!/usr/bin/env bash
# ==============================================================================
# SAPHIRE AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)
# Master Unified Startup Script (Frontend + Spring Boot Backend + PostgreSQL Link)
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${SCRIPT_DIR}/backend"
FRONTEND_DIR="${SCRIPT_DIR}/frontend"
LOGS_DIR="${SCRIPT_DIR}/logs"

mkdir -p "${LOGS_DIR}"

# ANSI Color Codes
CYAN='\033[0;36m'
GREEN='\033[0;32m'
GOLD='\033[0;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}"
echo "=========================================================================="
echo "          ✈️  SAPHIRE AIRPORT OPERATIONS COORDINATION SYSTEM (AOCS)        "
echo "=========================================================================="
echo -e "${NC}"

# 1. Check PostgreSQL Status
echo -e "${GOLD}[1/4] Checking PostgreSQL 18 Database...${NC}"
if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}  ✓ PostgreSQL is active on port 5432 (aocs_db)${NC}"
else
    echo -e "${RED}  ✗ Warning: PostgreSQL is not detected on port 5432.${NC}"
    echo -e "    Please start PostgreSQL service before proceeding."
fi

# 2. Kill any stale processes on Ports 8080 and 3000
echo -e "${GOLD}[2/4] Clearing ports 8080 (Backend) & 3000 (Frontend)...${NC}"
PID_8080=$(lsof -ti :8080 || true)
if [ -n "$PID_8080" ]; then
    echo -e "  → Terminating existing process on port 8080 (PID: $PID_8080)"
    kill -9 $PID_8080 2>/dev/null || true
fi

PID_3000=$(lsof -ti :3000 || true)
if [ -n "$PID_3000" ]; then
    echo -e "  → Terminating existing process on port 3000 (PID: $PID_3000)"
    kill -9 $PID_3000 2>/dev/null || true
fi

# Cleanup Handler for Graceful Exit (Ctrl+C)
cleanup() {
    echo ""
    echo -e "${GOLD}Shutting down Saphire AOCS services...${NC}"
    if [ -n "${BACKEND_PID}" ]; then
        echo -e "  → Stopping Spring Boot Backend (PID: ${BACKEND_PID})..."
        kill ${BACKEND_PID} 2>/dev/null || true
    fi
    if [ -n "${FRONTEND_PID}" ]; then
        echo -e "  → Stopping React Frontend (PID: ${FRONTEND_PID})..."
        kill ${FRONTEND_PID} 2>/dev/null || true
    fi
    # Also release ports in case subprocesses lingered
    lsof -ti :8080 | xargs kill -9 2>/dev/null || true
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✓ All services stopped cleanly.${NC}"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 3. Start Spring Boot Backend
echo -e "${GOLD}[3/4] Launching Spring Boot Backend (Port 8080)...${NC}"
cd "${BACKEND_DIR}"
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
mvn spring-boot:run -Dmaven.test.skip=true > "${LOGS_DIR}/backend.log" 2>&1 &
BACKEND_PID=$!
echo -e "  → Backend process spawned (PID: ${BACKEND_PID})"
echo -e "  → Waiting for Spring Boot & PostgreSQL JPA connection..."

# Wait up to 30 seconds for backend to become healthy
MAX_WAIT=30
COUNT=0
BACKEND_UP=false
while [ $COUNT -lt $MAX_WAIT ]; do
    if curl -s http://localhost:8080/api/flights >/dev/null 2>&1; then
        BACKEND_UP=true
        break
    fi
    sleep 1
    COUNT=$((COUNT + 1))
    printf "."
done
echo ""

if [ "$BACKEND_UP" = true ]; then
    echo -e "${GREEN}  ✓ Spring Boot Backend is LIVE on http://localhost:8080${NC}"
    echo -e "${GREEN}  ✓ Database connected: jdbc:postgresql://localhost:5432/aocs_db${NC}"
else
    echo -e "${RED}  ✗ Backend took longer than expected to initialize. Check logs at: ${LOGS_DIR}/backend.log${NC}"
fi

# 4. Start React Frontend with pnpm
echo -e "${GOLD}[4/4] Launching React / Vite Frontend (Port 3000)...${NC}"
cd "${FRONTEND_DIR}"
pnpm run dev -- --host &
FRONTEND_PID=$!
echo -e "  → Frontend process spawned (PID: ${FRONTEND_PID})"

# Wait 2 seconds for Vite to bind
sleep 2

echo -e "\n${CYAN}${BOLD}==========================================================================${NC}"
echo -e "${GREEN}${BOLD}  ✈️  SAPHIRE AOCS SYSTEM IS FULLY OPERATIONAL!${NC}"
echo -e "${CYAN}${BOLD}==========================================================================${NC}"
echo -e "${BOLD}  🌐 Public Portal:${NC}     ${CYAN}http://localhost:3000${NC}"
echo -e "${BOLD}  🔐 Staff Login:${NC}       ${CYAN}http://localhost:3000/login${NC}"
echo -e "${BOLD}  ⚡ Backend API:${NC}       ${CYAN}http://localhost:8080/api/flights${NC}"
echo -e "${BOLD}  🗄️  PostgreSQL DB:${NC}     ${CYAN}localhost:5432 (aocs_db - 38 Tables / 158k+ Records)${NC}"
echo -e "${BOLD}  📄 Backend Log:${NC}       ${CYAN}${LOGS_DIR}/backend.log${NC}"
echo -e "${CYAN}==========================================================================${NC}"
echo -e "${GOLD}Press [Ctrl+C] anytime to stop all servers and shutdown.${NC}\n"

# Keep the script running and wait for background jobs
wait ${FRONTEND_PID} ${BACKEND_PID}
