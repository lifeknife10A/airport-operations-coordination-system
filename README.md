# Saphire AOCS — Airport Operations Coordination System

A full-stack airport operations platform: a public passenger portal (flight tracker, baggage
tracker, lost & found) plus a role-based staff dashboard (flight ops, gates/stands, turnaround
tasks, baggage handling, border control, billing, security audit, and more).

- **Backend**: Spring Boot 3.2.5 / Java 17, PostgreSQL, Flyway migrations, JWT auth with
  server-side session revocation, Spring Security RBAC.
- **Frontend**: React 19 + TypeScript + Vite + MUI (pnpm).

This README covers everything needed to clone the repo and run the full stack locally, exactly
as it runs in development.

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| **Java** | **17** (exactly) | The backend is pinned to Java 17. If your default `java`/`JAVA_HOME` points at a newer JDK (common with Homebrew), you must point it at a JDK 17 install for every Maven command — see [Troubleshooting](#troubleshooting). |
| **Node.js** | 20+ | Tested with Node 25. |
| **pnpm** | 9+ | The frontend's only package manager (`corepack enable` or `npm i -g pnpm`). `start.sh` installs dependencies for you on first run. |
| **PostgreSQL** | 16+ | Verified on 16 (the Docker image) and 18 (Postgres.app). The migrations disable triggers while loading data, so the database user must be a superuser (the default `postgres` user is). |
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

# 3. Run everything with one script (installs frontend deps on first run)
./start.sh
```

`start.sh` finds a JDK 17, starts the Spring Boot backend (port 8080), waits for it to report
healthy, then starts the Vite frontend dev server (port 3000). It stops with a clear error (and
the log tail) instead of reporting success if something fails, and refuses to start if ports
8080/3000 are already in use. On first run, the
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
pnpm install --frozen-lockfile
pnpm run dev
```

---

## Default login credentials

The seed data creates ~500 staff users across every role (Airport Operations Manager, Ground
Handling Supervisor, Ramp Agent, Baggage Handler, Gate Agent, Check-in Agent, Security Officer,
Immigration Officer, Airline Billing Clerk, System Administrator). Every seeded user shares the
same demo password (**demo data only: change or remove these accounts before any real deployment**):

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

Verified end to end against the `postgres:16-alpine` image: all migrations apply, the API serves
the 5,000 flights, and the nginx-served frontend proxies `/api` to the backend. This is a local/dev compose file (it runs the backend's dev-friendly default profile, not
`--prod`). See the comments in `docker-compose.yml` and `backend/src/main/resources/
application-prod.properties` for what a real deployment needs beyond this (`DB_URL`,
`DB_USERNAME`, `DB_PASSWORD`, `AOCS_JWT_SECRET`, `CORS_ALLOWED_ORIGINS`, and
`SPRING_PROFILES_ACTIVE=prod`, all with no defaults).

---

## Environment variables

See `.env.example`. For local (non-Docker) dev the backend has fallback defaults for the database
(`postgres`/`postgres` on `localhost:5432/aocs_db`), so no `.env` file is required.

- `AOCS_JWT_SECRET` — signing key for login tokens. **There is deliberately no default**: if it is
  unset the backend generates a random key for that run (logged as a warning), which is safe but
  means everyone has to log in again after a restart. Set it to a long random value (32+
  characters) for any shared or deployed run; the `prod` profile refuses to start without it.
- `DB_USERNAME` / `DB_PASSWORD` / `SPRING_DATASOURCE_URL` — override the database connection.

---

## Security model (short version)

- Login issues a token tied to a server-side session (`auth_sessions`); logging out or logging in
  elsewhere revokes it immediately. One active session per user.
- The user's **role is read from the database on every request**, never trusted from the token,
  and the frontend re-verifies the stored session with `GET /api/auth/me` on page load.
- Role checks (`@PreAuthorize`) guard every write endpoint and the sensitive lookups/exports;
  unauthenticated callers can only use the public passenger endpoints (flights, gates, tasks
  board, lost-and-found search, inquiry submission) and get redacted data.
- Failed-login lockout per username and per IP; passwords are bcrypt-hashed and never serialized.

---

## Database migrations

Flyway migrations live **only** in `backend/src/main/resources/db/migration/` (V1–V20) and build
everything from an empty database: schema, constraints, and the ~158k-row demo dataset.

- `V16__complete_production_dataset_sync.sql` truncates the tables it fills, then loads the dataset.
  That is correct on a fresh database; on a database that already had V1–V15 applied, rows created
  through the app before upgrading are replaced by the snapshot.
- Flyway's checksum validation is switched off (`spring.flyway.validate-on-migrate=false`) because
  earlier migrations were edited after being applied on the original development database. A new
  database is unaffected.

---

## Running tests

```bash
cd backend
./mvnw test
```

109 backend unit tests cover auth/session handling, gate-assignment locking and wingspan checks, login lockout,
turnaround task and flight state transitions, delay logging, clearance and carousel rules, and more. They use mocks and do not touch a
database; CI additionally boots the app against an empty Postgres 16 to prove the migrations.

```bash
cd frontend
npx tsc --noEmit -p tsconfig.app.json   # typecheck
pnpm run build                          # typecheck + production build
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

**`start.sh` says a port is already in use**: an earlier backend/frontend is still running.
`lsof -ti :8080 | xargs kill` (same for `:3000`), then run it again.

---

## What runs on live data

Every dashboard and the public pages read from the backend and write back to it. A write the
server rejects is rolled back (or never shown) and the server's reason is displayed.

| Screen | Live data |
|---|---|
| Public flight tracker, schedule, lost & found | Paged flights, status counts, carousels, latest weather report, lost property |
| Ground Ops | Paged task board, live status counts, active turnarounds, ramp staff workload, assignment |
| Airside Ops | Gates, runways (traffic counted from flights), live/upcoming flights, computed conflicts (wingspan over gate limit, overlapping departures), gate and runway assignment |
| AOCC Controller | Flight board with turnaround progress, per-flight tasks, delay log and codes, delay logging, gate assignment |
| Passenger & Security Ops | Boarding flights, manifests (last four passport digits only), clearance scans and log, incident log, lounge visits, lost & found |
| Check-In | Flight manifests, boarding pass issue, baggage tags (server-issued numbers), desks |
| Logistics | Baggage desk, cargo manifest, carousels (reassignable), fuel logs, ground equipment, turnaround timeline |
| System Admin | Staff directory, account creation and suspension, audit trail |
| Billing | Invoices and charges |

## Known limitations

- The seed data has fixed dates (July to September 2026) rather than dates relative to today, and
  the latest weather report is from August. Screens show the timestamps so this is visible.
- The seed contains 1,164 aircraft assigned to gates narrower than their wingspan; the Airside
  conflicts list shows them, and new assignments are refused if the aircraft does not fit.
- Things the data does not record, and so the screens do not show: fuel volume pumped (only
  density), cargo load status, lounge capacity, check-in queue lengths and agents, wind direction.
- Flyway's checksum validation is off (`spring.flyway.validate-on-migrate=false`).
- The older Department (cleaning/fuel/maintenance) dashboard is no longer assigned to any role.
- Report exports are plain TXT/CSV.

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
