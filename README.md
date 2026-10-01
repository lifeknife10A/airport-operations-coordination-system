# Saphire AOCS — Airport Operations Coordination System

A full-stack airport operations platform: a public passenger portal (flight tracker, baggage
tracker, lost & found) plus a role-based staff dashboard (flight ops, gates/stands, turnaround
tasks, baggage handling, border control, billing, security audit, and more).

- **Backend**: Spring Boot 3.2.5 / Java 17, PostgreSQL, Flyway migrations, JWT auth with
  server-side session revocation, Spring Security RBAC.
- **Frontend**: React 19 + TypeScript + Vite + MUI.

This README covers everything needed to clone the repo and run the full stack locally, exactly
as it runs in development.

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| **Java** | **17** (exactly) | The backend is pinned to Java 17. If your default `java`/`JAVA_HOME` points at a newer JDK (common with Homebrew), you must point it at a JDK 17 install for every Maven command — see [Troubleshooting](#troubleshooting). |
| **Node.js** | 20+ | Tested with Node 25. |
| **PostgreSQL** | 16+ | Tested with Postgres 18 (Postgres.app on macOS). The schema and data are plain SQL with no version-specific features. |
| **Maven** | Not required | The repo includes the Maven wrapper (`backend/mvnw`) — use that if you don't have Maven installed system-wide. |

No separate seed/import step is needed: the database schema **and** a ~158,000-row demo dataset
(5,000 flights, 500 staff users, passengers, tasks, baggage events, audit logs, etc.) are built
entirely from Flyway migrations in `backend/src/main/resources/db/migration/`. The backend creates
and populates the database itself on first boot.

---

## Quick start (local, no Docker)

```bash
# 1. Clone and enter the repo
git clone <this-repo-url>
cd "Mini Project"

# 2. Start PostgreSQL and create an empty database
#    (adjust for your own Postgres install/credentials)
createdb aocs_db

# 3. Copy the env template (optional for local dev — see Environment variables below)
cp .env.example .env

# 4. Run everything with one script
./start.sh
```

`start.sh` starts the Spring Boot backend (port 8080) and the Vite frontend dev server (port
3000), and waits for the backend to come up before starting the frontend. On first run, the
backend applies all Flyway migrations automatically — this takes a minute or two the first time
(it's loading ~158k rows), then seconds on every subsequent start.

Once it's up:
- **Public portal**: http://localhost:3000
- **Staff login**: http://localhost:3000/login
- **Backend API**: http://localhost:8080/api/flights
- **API docs (Swagger UI)**: http://localhost:8080/swagger-ui.html

Press `Ctrl+C` to stop both servers cleanly.

### Running the pieces manually

If you'd rather not use `start.sh`:

```bash
# Backend (from backend/)
JAVA_HOME=<path to a JDK 17 install> ./mvnw spring-boot:run

# Frontend (from frontend/, in a separate terminal)
npm install
npm run dev
```

---

## Default login credentials

The seed data creates ~500 staff users across every role (Airport Operations Manager, Ground
Handling Supervisor, Ramp Agent, Baggage Handler, Gate Agent, Check-in Agent, Security Officer,
Immigration Officer, Airline Billing Clerk, System Administrator). Every seeded user shares the
same demo password:

- **Username**: any seeded username, e.g. `david.rodriguez1` (format is generally
  `first.lastN@saphire.in` or `first.lastN` as a bare username — the login form accepts either)
- **Password**: `password123`

To find a user for a specific role, query the database directly, e.g.:

```sql
SELECT u.username, u.email, r.role_name
FROM users u JOIN roles r ON u.role_id = r.role_id
WHERE r.role_name = 'SYSTEM_ADMINISTRATOR'
LIMIT 5;
```

---

## Running with Docker Compose

A `docker-compose.yml` is provided that builds and runs the full stack — Postgres, backend, and
the frontend served by nginx — with no local Java/Node install required at all:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

This is a local/dev compose file (it runs the backend's dev-friendly default profile, not
`--prod`). See the comments in `docker-compose.yml` and `backend/src/main/resources/
application-prod.properties` for what a real deployment needs beyond this (`DB_URL`,
`DB_USERNAME`, `DB_PASSWORD`, `AOCS_JWT_SECRET`, `CORS_ALLOWED_ORIGINS`, and
`SPRING_PROFILES_ACTIVE=prod`, all with no defaults).

---

## Environment variables

See `.env.example`. For local (non-Docker) dev, the backend's `application.properties` has sane
fallback defaults for everything (DB credentials, JWT secret), so a `.env` file isn't strictly
required to get running. Before deploying anywhere real, override at minimum:

- `DB_PASSWORD` — the committed fallback is a known local-dev value, not a secret.
- `AOCS_JWT_SECRET` — same; any previously-committed value must be treated as compromised.

---

## Running tests

```bash
cd backend
./mvnw test
```

80 backend tests cover auth/session handling, RBAC, gate-assignment race conditions, login
lockout, turnaround task state transitions, and more.

```bash
cd frontend
npx tsc --noEmit -p tsconfig.app.json   # typecheck
```

---

## Troubleshooting

**`mvn`/`./mvnw` fails to compile with a cryptic Lombok/`javac` error (`NoSuchFieldException:
TypeTag :: UNKNOWN`)**: your default Java is newer than 17 (common on a Mac with Homebrew's latest
`openjdk` installed as the default). Point `JAVA_HOME` at a JDK 17 install for the command:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v17)   # macOS
./mvnw spring-boot:run
```

**Backend logs `"status":"DOWN"` at `/actuator/health`, or won't start at all**: PostgreSQL isn't
running or isn't reachable at `localhost:5432`. If you're using Postgres.app on macOS, note that
opening the app does **not** automatically start the server — you still need to click Start (or
have it configured to start automatically).

**`Unable to find a single main class` from a stale build**: delete `backend/target/` and rebuild
(`rm -rf backend/target && ./mvnw spring-boot:run`). This happens if a previous build's compiled
classes linger after switching Java versions or branches.

**Port 8080 or 3000 already in use**: another backend/frontend instance (yours or a previous
session's) is still running. `lsof -ti :8080 | xargs kill -9` (same for `:3000`).

---

## Project structure

```
Mini Project/
├── backend/                  Spring Boot API (Java 17, Maven)
│   └── src/main/resources/db/migration/   Flyway migrations — schema + full seed dataset
├── frontend/                 React + TypeScript + Vite
├── docker-compose.yml        Full-stack local Docker setup
├── start.sh                  One-command local dev startup (backend + frontend)
└── .env.example               Template for local secret overrides
```
