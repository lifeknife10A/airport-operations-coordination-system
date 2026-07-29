# Saphire AOCS — Phase 2 Final Certification Audit

**Bundle:** `phase2_A_grade_final_backend.zip`
**Grade history:** C+ → B− → **B+** (target was A/A−; see §3 for why I can't certify that yet)
**Phase 3 clearance:** ⚠️ **Conditional** — three items, ~30 minutes. See §4.

**Method and limits (same as before):** JRE only — no JDK, no Maven, no `.m2`, no network. Nothing was compiled or executed. Findings are static analysis plus specification reasoning, and I flag which is which. §2.4 in particular is a prediction about Mockito behaviour that a single `mvn test` run will confirm or refute in seconds — please run it before accepting my word.

I diffed this bundle against the previous one: **nine files changed** (5 controllers, `TaskDTO`, `GlobalExceptionHandler`, `JwtService`, `GateService`), plus a new `application.properties`. `GateServiceTest`, `FlightRepository`, `ReportService`, `SecurityConfig`, `JwtAuthFilter` and the `V3` migration are **byte-identical to the previous version**. That matters, because several of your five claimed fixes depend on files that didn't move.

---

## 1. Verification of the Five Claimed Fixes

| # | Claim | Verdict |
|---|---|---|
| 1 | TaskDTO / test compilation | ✅ **Resolved** |
| 2a | Realistic gate occupancy window | ✅ **Resolved** (inversion fixed) — but now a 60-min heuristic, see §2.6 |
| 2b | "Applied eager fetch to eliminate N+1" | ❌ **Overstated** — N+1 reduced 7→3 per flight, not eliminated (§2.5) |
| 3 | CORS consolidation | ✅ **Resolved** |
| 4a | `application.properties` + UTF-8 | ⚠️ **Partial** — UTF-8 ✅, but property key mismatch (§2.1) and a new security regression (§2.2) |
| 4b | "fallback values" in `JwtService` | ❌ **Harmful** — the fallback is the regression (§2.2) |
| 5 | RFC 7807 handlers (400 / 403) | ✅ **Resolved** |

### 1.1 ✅ Compile defect — fixed
`TaskDTO` reverted to a `@Data` class with three record-style alias methods (`status()`, `assignedUserId()`, `assignedUserName()`). Both call styles now resolve, so `TurnaroundTaskServiceTest` compiles.

Worth knowing *why* this is safe rather than just that it is: Jackson's bean introspection only treats `getX()`/`isX()` as property accessors on ordinary classes, so the bare `status()` alias is ignored during serialisation and you won't get a duplicate `status` field in the JSON. (Had `TaskDTO` stayed a `record`, Jackson's record handling plus an explicit `getStatus()` would have been a genuine conflict risk.) The approach works.

Minor note: aliases exist for only 3 of 12 fields, which will read as arbitrary to the next maintainer. Fixing the three test lines instead would have been cleaner. Not a defect — just carrying weight for no benefit.

### 1.2 ✅ Gate occupancy inversion — fixed
The critical "check can never fire" bug is genuinely gone. `getGroundOccupancyWindow()` now branches on `flightType` and, importantly, **validates the ordering before trusting a timestamp**:

```java
if (f.getScheduledDepartureTime() != null && f.getScheduledDepartureTime().isAfter(start)) {
    end = f.getScheduledDepartureTime();
} else {
    end = start.plusMinutes(60);
}
```

I traced this against the real data model. For an `ARRIVAL` leg, `scheduledDepartureTime` is departure from the *external origin*, so it's before the SPH arrival — the `isAfter` guard correctly rejects it and falls back to `arrival + 60min`. For a `DEPARTURE` leg, the symmetric guard rejects the arrival-at-destination time and uses `departure − 60min`. Windows are now non-inverted in both directions, and the (already correct) half-open overlap predicate can fire. Good fix.

### 1.3 ✅ CORS and exception handlers — fixed
`@CrossOrigin` is gone from all five controllers; CORS lives only in `SecurityConfig`. The duplicate-`Access-Control-Allow-Origin` hazard is closed and preflight will work for the React client.

`GlobalExceptionHandler` now has nine handlers including `AccessDeniedException` → 403 and `HttpMessageNotReadableException` → 400. Folding the latter into the existing `@ExceptionHandler({...})` group rather than extending `ResponseEntityExceptionHandler` is a legitimate choice — it keeps one consistent `ProblemDetail` body shape and avoids the return-type churn. Two residual gaps: `HttpRequestMethodNotSupportedException` (→ 500, should be 405) and `HttpMediaTypeNotSupportedException` (→ 500, should be 415). Low priority; add them to the same group when convenient.

Adding the `AccessDeniedException` handler *before* wiring RBAC was the right ordering — that was the prerequisite I flagged, and it's now in place.

---

## 2. Remaining and Newly Introduced Defects

### 2.1 🔴 NEW — JWT expiry property is dead; tokens live 1 hour, not 24

```properties
# application.properties
aocs.jwt.expiration-ms=86400000          # 24 hours
```
```java
// JwtService.java line 22
@Value("${aocs.jwt.expiry-minutes:60}") long expiryMinutes
```

The key you added (`aocs.jwt.expiration-ms`) is **not the key the code reads** (`aocs.jwt.expiry-minutes`). Spring silently binds nothing, the `:60` default applies, and tokens expire after 60 minutes. The new property is inert configuration.

Not a security hole — shorter expiry is the safe direction — but it's exactly the kind of silent mismatch that produces "why does the app log me out mid-demo?" during Phase 3. Pick one name:

```java
@Value("${aocs.jwt.expiration-ms:3600000}") long expiryMs
...
Date expiry = new Date(now.getTime() + expiryMs);
```

### 2.2 🔴 NEW — the JWT secret fallback is a security regression

```java
@Value("${aocs.jwt.secret:defaultSecretWithMinimumLength256Bits12345678901234567890}") String secret
```

This is strictly worse than the previous version. Before, a missing `aocs.jwt.secret` caused **startup failure** — noisy, but it failed closed. Now the application boots silently with a hardcoded secret that is written in plaintext in your source tree *and* in my earlier review document. Anyone who knows it can forge a token for any username with `ROLE_ADMIN` and the signature will verify.

That's a latent auth bypass, not a theoretical one. It triggers whenever the property doesn't resolve: a profile that doesn't load this file, a packaged jar missing `application.properties` on the classpath, a typo'd `AOCS_JWT_SECRET` env override, a Docker image built without the resource. The whole value of failing fast on a missing secret is that these situations become visible instead of invisible.

**Remove the default.** Keep the property required, and validate strength explicitly so the failure message is useful:

```java
public JwtService(@Value("${aocs.jwt.secret}") String secret,
                  @Value("${aocs.jwt.expiration-ms:3600000}") long expiryMs) {
    byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
    if (keyBytes.length < 32) {
        throw new IllegalStateException(
            "aocs.jwt.secret must be at least 32 bytes for HS256 (got " + keyBytes.length + ")");
    }
    this.key = Keys.hmacShaKeyFor(keyBytes);
    this.expiryMs = expiryMs;
}
```

Separately: the real secret is now committed in plaintext. For an academic submission that's defensible, but make it an env lookup so the habit is right and the repo is safe to share — `aocs.jwt.secret=${AOCS_JWT_SECRET}` with the value supplied locally.

### 2.3 🔴 The `stand` conflict check is a dead parameter

`assertNoOverlap`'s signature was widened to `(Flight incoming, Gate gate, Stand stand)` — and `stand` **never appears in the method body**. I grepped the extracted method: the only occurrence is the parameter declaration. There is no `findByStand_StandId` in `FlightRepository` either. Stand double-booking remains completely undetected.

This is the same pattern as the original `notes` bug from my first review — a value accepted, threaded through a signature, and never read. The difference is that this one now *looks* addressed at the call site, which makes it harder to notice. Since a stand is the actual physical parking real estate (and `Stand` carries `isRemote`/`hasJetbridge`), it's arguably the more safety-relevant of the two checks.

```java
// FlightRepository
List<Flight> findByStand_StandId(Long standId);

// GateService.assertNoOverlap — add alongside the gate check
if (stand != null) {
    findConflicts(flightRepository.findByStand_StandId(stand.getStandId()), incoming, newWin)
        .ifPresent(clash -> { throw new ConflictException(
            "Stand " + stand.getStandNumber() + " is already reserved for flight " + clash.getFlightNumber()); });
}
```
Extracting the shared filter chain into a `findConflicts(list, incoming, window)` helper removes the duplication between the two checks.

### 2.4 🟠 `GateServiceTest` will fail at runtime

Your summary says all nine test classes "compile cleanly" — I agree, and that was the fix I asked for. But compiling isn't passing, and one test now breaks because the production code moved under it.

`getAllGates()` was changed to call `findAllSaphireHubFlightsWithDetails()`. `GateServiceTest` line 180 still stubs the old method:

```java
when(flightRepository.findAllSaphireHubFlights()).thenReturn(List.of(departed));
```

`MockitoExtension` defaults to `Strictness.STRICT_STUBS`, so an unused stub raises `UnnecessaryStubbingException` and fails the test. (The assertions themselves would incidentally still hold — Mockito returns an empty list for the unstubbed call — so the failure is purely the strictness check.) One-line fix: point the stub at `findAllSaphireHubFlightsWithDetails()`.

**This is spec-based reasoning, not an observed failure.** Run `mvn test` and confirm; it's the single most valuable thing you can do before submitting, because until the suite goes green nothing in this codebase is actually verified.

### 2.5 🟠 The N+1 claim doesn't hold

`GateService` does now call `findAllSaphireHubFlightsWithDetails()` — but **`FlightRepository` was not modified**, and that query still fetch-joins only four of the seven associations:

```java
@Query("SELECT f FROM Flight f JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport
        JOIN FETCH f.airline JOIN FETCH f.aircraft WHERE ...")
```

`gate`, `stand` and `department` remain `LAZY`, and `mapToDTO` dereferences non-identifier getters on all three (`getGate().getGateNumber()`, `getStand().getStandNumber()`, `getDepartment().getDepartmentName()`). That's **3 lazy initialisations per flight**, in both `getAllGates()` and `getSaphireHubFlights()` — roughly 180 extra queries across 60 seed flights.

Real improvement (down from ~7 per flight in `getAllGates()`), so the change helped. But "eliminated" isn't accurate. The fix is in the repository, and the join type matters:

```java
@Query("""
       SELECT DISTINCT f FROM Flight f
         JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport
         JOIN FETCH f.airline JOIN FETCH f.aircraft
         LEFT JOIN FETCH f.gate LEFT JOIN FETCH f.stand LEFT JOIN FETCH f.department
       WHERE f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1
       """)
List<Flight> findAllSaphireHubFlightsWithDetails();
```
`LEFT` is required for those three — they're nullable, and an inner `JOIN FETCH` would silently drop every flight without a gate assigned, which is precisely the set a gate-planning screen needs to show.

### 2.6 🟠 The occupancy window is a 60-minute magic number, and both real branches are dead

Follow the logic through with production data: for an `ARRIVAL` leg the departure timestamp is always earlier than the arrival, so `isAfter(start)` is always false and the code **always** takes `start.plusMinutes(60)`. Symmetrically for departures. The conditional branches never execute against real rows — every window is a fixed ±60 minutes.

Consequences:
- A wide-body with a genuine 3-hour turnaround is modelled as 60 minutes, so a real double-booking at minute 90 is not detected. The check works for short overlaps and misses long ones.
- `inboundFlightId` — the field that actually links an arrival leg to its paired departure, and the basis for a true window — is still unused.
- `60` is an unnamed literal duplicated in two branches.
- `flightType == null` falls silently into the `DEPARTURE` branch (`"ARRIVAL".equalsIgnoreCase(null)` returns `false` rather than throwing). A row with a missing or misspelled `flight_type` gets a plausible-looking but arbitrary window. In safety-adjacent logic, prefer returning `null` (skip the check and log) or rejecting outright over silently defaulting.

Minimum improvement: extract `DEFAULT_TURNAROUND_MINUTES = 60` as a named constant and document that this is a deliberate approximation pending the `inboundFlightId` join. That's honest and defensible in a viva; the current form reads as if it computes a real window when it doesn't.

### 2.7 🟡 Untouched from the previous audit

Five items from my ordered path weren't attempted. Listing them so the remaining scope is explicit, not to re-argue them:

| Item | Status | Impact |
|---|---|---|
| `V3` migration: fabricated `DEFAULT` hash, no `DROP DEFAULT`, no `NOT NULL`, `password123` hash still unverified | Unchanged | **This was #2 on my priority list.** If that hash doesn't actually match `password123`, login fails during your live demo — and Flyway checksums make editing an applied migration painful. Verify it with the one-line `BCryptPasswordEncoder().matches(...)` test from the last report *today*. |
| RBAC: only `/api/reports/**` and `/api/gates/assign` restricted | Unchanged | `PUT /api/flights/{id}/status`, `POST /api/flights` and all `/api/tasks/**` are open to any authenticated user. A ground-crew token can mark a flight `DEPARTED`. Contradicts your README's RBAC table. `@EnableMethodSecurity` is on but there is not one `@PreAuthorize` in the codebase. |
| Token identity unused; `AuditLog` not wired | Unchanged | `JwtAuthFilter` ignores the `userId` claim; services still read `userId` from the request body, so task attribution is forgeable. The `TODO(audit)` in `FlightService` remains. NFR §6 compliance gap. |
| `ReportService` full-table `findAll()` ×2 | Unchanged | Loads all of `delay_logs` and `tasks` to compute six scalars. Fine at seed scale. |
| `JwtAuthFilter`: `"ROLE_null"`/`"ROLE_"` authorities; duplicate `@Component` registration | Unchanged | Cosmetic and fragility respectively. Both mine. |

### 2.8 🟢 Two small notes on the new properties file
- `management.endpoints.web.exposure.include=*` — currently a **no-op**, because `spring-boot-starter-actuator` isn't a dependency (I checked: zero matches in `pom.xml`). Harmless today, but if anyone adds actuator later this line exposes `/actuator/env` and `/actuator/heapdump` to any authenticated user — and a heapdump can contain your signing key. Either delete the line or narrow it to `health,info` now, while it costs nothing.
- `ddl-auto=validate` is the right choice. It does mean the schema must match all 17 entities exactly. `V1`/`V2` aren't in the bundle, so I can't confirm columns like `flights.boarding_time`, `runway_id`, `inbound_flight_id`, `stand_id`, `department_id` exist. First boot will tell you immediately.

---

## 3. Final Grade: **B+**

Honest assessment, and I want to separate the trajectory from the certification.

**The trajectory is genuinely good.** Across three rounds this went from an API with no authentication, no state machine, and 500s on every validation error, to one with real BCrypt auth, a properly guarded lifecycle, RFC 7807 errors, correct pessimistic locking, and centralised CORS. The two hardest findings from the last round — the compile break and the inverted occupancy interval — are both properly resolved. That's real engineering, and against the academic rubric in `instruction.md` this is well above typical mini-project work.

**But I can't certify A or A−**, for four specific reasons:

1. **A new security regression was introduced.** The JWT secret fallback (§2.2) converts a fail-closed startup error into a silent boot with a publicly-known signing key. An A-grade backend does not ship with a known-secret landmine, and this one is a net step backwards from the B− bundle.
2. **A claimed fix is a dead parameter.** `assertNoOverlap(..., Stand stand)` accepts the value and never reads it (§2.3). The appearance of a fix without the substance is worse than an open item, because it stops getting looked at.
3. **The suite still almost certainly isn't green** (§2.4), so "verified" remains unestablished for the third round running. Two of the five claims here (N+1 elimination, 24-hour tokens) are also inaccurate as stated — and both are things a run would have surfaced.
4. **The highest-priority cheap item was skipped.** The BCrypt seed hash (§2.7) was #2 on my ordered list precisely because it's five minutes of work and breaks your demo if wrong.

An A/A− needs: a green test suite, no known security regressions, and claimed fixes that are actually implemented. You're close enough that **B+ → A− is a couple of hours**, most of it in §4.

---

## 4. Phase 3 Clearance: Conditional

**Cleared to start once these three are done — roughly 30 minutes:**

1. **Fix the JWT expiry key mismatch** (§2.1). Otherwise you'll debug phantom 1-hour logouts while building the login flow, and blame the frontend.
2. **Remove the JWT secret fallback default** (§2.2). Do this before the repo is shared with anyone, including for grading.
3. **Fix the `GateServiceTest` stub and run `mvn test`** (§2.4). Do not start Phase 3 on an unverified backend — a red suite means you can't tell whether a Phase 3 bug is in React or in the API.

**Then verify before your demo (today, not later):** the `password123` BCrypt hash (§2.7). If it's wrong you cannot log in at all, and it's a five-minute check.

**Safe to defer and do in parallel with frontend work:** the stand overlap check, the `LEFT JOIN FETCH`, the occupancy constant, `ReportService` projections, and the 405/415 handlers. None of these block a React client.

**One caveat on ordering.** RBAC and token-derived identity (§2.7) are technically deferrable, but if you build login and route guards against an API where every authenticated user can do everything, you'll write frontend authorisation logic against behaviour that changes underneath you when RBAC lands. If you have the choice, do the path-based `requestMatchers` rules *before* the first `axios` interceptor — it's maybe an hour and it makes the frontend contract stable.

---

## Closing note

One pattern is now three-for-three across these audits, and it's worth naming because it will outlive this project: each round, at least one finding was addressed at the *signature or call-site* level while the *behaviour* stayed unchanged — `notes` accepted and discarded (round 1), the occupancy comment shipped as documentation instead of actioned (round 2), `Stand stand` accepted and ignored (round 3). The common thread is that the change compiled and looked right at the call site, so nothing prompted a second look.

Two habits close that gap cheaply: for every parameter you add, write the assertion that fails without it before you write the implementation; and treat a green `mvn test` as the definition of "done" rather than a green compile. Both would have caught §2.3 and §2.4 in minutes.

Good work getting here. The remaining list is short and mostly mechanical.
