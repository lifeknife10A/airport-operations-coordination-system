# Saphire AOCS — Phase 2 Remediation Audit (Follow-Up)

**Reviewer role:** Principal Java / Spring Boot Software Architect
**Bundle audited:** `phase2_refactored_full_backend.zip` — 83 files (17 entities, 16 repositories, 5 services, 5 controllers, security package, 9 test classes, `pom.xml`, `V3` migration)
**Previous grade:** C+ → **Updated grade: B−** (see §4 for the reasoning and the specific path to A−)

**Verification method and its limits — please read this first.** This environment has a JRE but **no JDK (`javac`), no Maven, no local `.m2`, and no network**, so I could not compile or run anything. Every finding below is from static reading of the source plus cross-referencing your project docs. Where a claim rests on language/framework specification rather than observed execution, I say so explicitly. Two findings I *attempted* to prove by compiling a minimal reproduction and could not — they are marked accordingly. Please treat §1.1 as the first thing to test rather than as verified fact.

---

## 1. Verification of the Three Release Blockers

| # | Blocker | Status | Notes |
|---|---|---|---|
| 1 | Unauthenticated login | ✅ **Resolved** | Real `passwordEncoder.matches()`; identical failure for unknown-user and bad-password; token in response; `SecurityConfig` exists |
| 2 | Missing flight state machine | ✅ **Resolved** | `FlightStatus.canTransitionTo()` guards every transition; unknown status → 400; timestamps now idempotent |
| 3 | HTTP 500 on validation failure | ⚠️ **Mostly resolved** | `@Valid` → 400 with `fieldErrors` ✅. But four other exception classes still produce 500 — see §1.4 |

### 1.1 🔴 The test suite cannot compile — so none of the nine tests have run

**This is my error, not yours, and I want to be direct about it.** I gave you `TaskDTO` as a Java `record` (the §3.1 ergonomics recommendation) *and*, in a different file, tests that call getter-style accessors on it. Those two files contradict each other and I shipped both.

`dto/TaskDTO.java` is `public record TaskDTO(..., String status, ...)`. Per JLS §8.10.3 a record's accessor is named for the component — `status()`, not `getStatus()` — and Lombok's `@Builder` does not add `getX()` methods to records (`@Data`/`@Getter` aren't applicable to record types). Three lines therefore reference methods that do not exist:

```
src/test/java/com/saphire/aocs/service/TurnaroundTaskServiceTest.java
  line  97:  assertThat(result.getStatus()).isEqualTo("IN_PROGRESS");
  line 234:  assertThat(result.getAssignedUserId()).isEqualTo(7L);
  line 235:  assertThat(result.getAssignedUserName()).isEqualTo("R. Kulkarni");
```

Because `test-compile` is a single unit, one broken class fails the whole module — so **all nine test classes, including the four that were previously passing, have not executed.** Any "tests integrated" status in your branch notes reflects files present, not a green run.

I could not confirm this by compiling (no `javac` available — I tried). But the record-accessor rule is unambiguous in the language spec, and I verified by grep that these are the *only* three occurrences, and that `src/main/` never calls a getter on `TaskDTO` (so production code compiles fine — the failure is confined to the test module).

**Fix — three characters plus a rename each:**
```java
assertThat(result.status()).isEqualTo("IN_PROGRESS");
assertThat(result.assignedUserId()).isEqualTo(7L);
assertThat(result.assignedUserName()).isEqualTo("R. Kulkarni");
```
Alternatively revert `TaskDTO` to the `@Data` class and keep the getters. Either is fine; pick one and be consistent. **Run `mvn test` before reading further — some findings below are predictions that a green build would confirm or refute.**

### 1.2 🔴 Gate conflict detection is inert against your real data model

Audit question 1b asked whether conflicts are detected "without false positives." The answer is worse than a false-positive problem: **the check will essentially never fire at all**, so NFR §3.8 remains unmet despite looking implemented.

`GateService.assertNoOverlap()` treats a flight's ground-occupancy window as `[scheduledArrivalTime, scheduledDepartureTime]`:

```java
ZonedDateTime newStart = incoming.getScheduledArrivalTime();
ZonedDateTime newEnd   = incoming.getScheduledDepartureTime();
...
.filter(f -> newStart.isBefore(f.getScheduledDepartureTime())
          && f.getScheduledArrivalTime().isBefore(newEnd))
```

But one `Flight` row is **one leg**, and a leg departs before it arrives. Per `saphire_hub_architecture.md` §3.2, an arrival leg has `origin = external, destination = SPH`: it departs DXB at 06:00 and arrives at SPH at 10:00. So `scheduledDepartureTime` (06:00) is *earlier* than `scheduledArrivalTime` (10:00) — for departure legs too, since those leave SPH and arrive elsewhere. **In both cases `newStart > newEnd`, the interval is inverted, and the predicate is unsatisfiable for realistic data.** Two flights can still be double-booked onto one gate silently.

The unit test passes because its fixture encodes the same false premise the production code does — `flight(101L, "SPH101", BASE, BASE.plusHours(1), ...)` passes arrival=10:00, departure=11:00, i.e. arrival *before* departure. That fixture is mine too. It's a clean example of a test validating an assumption rather than reality, and it's why a green suite alone wouldn't have caught this.

I flagged this exact risk as an "OPEN MODELING QUESTION" in the file's javadoc when I didn't have the entity source. Now that I do, it's resolved: the assumption is wrong. That comment should have been treated as a blocking to-do rather than shipped.

**Fix.** Ground occupancy has to be modelled explicitly rather than inferred from two timestamps that mean something else. Cleanest for your scope — derive it from the leg pairing you already have via `inboundFlightId`:

```java
/** Ground window at SPH: arrival of the inbound leg -> departure of this (outbound) leg. */
private Optional<Window> groundWindow(Flight f) {
    if ("ARRIVAL".equals(f.getFlightType())) {
        // Occupies the gate from touchdown until its paired outbound leg pushes back.
        ZonedDateTime start = f.getScheduledArrivalTime();
        ZonedDateTime end = flightRepository.findByInboundFlightId(f.getFlightId())
                .map(Flight::getScheduledDepartureTime)
                .orElse(start.plusMinutes(DEFAULT_TURNAROUND_MINUTES)); // no paired leg yet
        return Optional.of(new Window(start, end));
    }
    if ("DEPARTURE".equals(f.getFlightType()) && f.getInboundFlightId() != null) {
        return flightRepository.findById(f.getInboundFlightId())
                .map(in -> new Window(in.getScheduledArrivalTime(), f.getScheduledDepartureTime()));
    }
    return Optional.empty(); // departure with no inbound: nothing to reserve yet
}
```
Then compare windows with the (already correct) half-open overlap test. The simpler alternative, if you'd rather not add the pairing query: add explicit `gate_occupancy_start` / `gate_occupancy_end` columns in a `V4` migration and have the planner set them. Either way, **rewrite the test fixture with realistic timestamps** (departure < arrival) or it will keep certifying the bug.

### 1.3 🟠 Stand double-booking is not checked at all

`assignGateToFlight` resolves and assigns `dto.getStandId()`, but `assertNoOverlap` only ever examines the gate. Two flights can hold the same stand. Since a stand is the physical parking real estate (and `Stand` carries `isRemote`/`hasJetbridge`), this is arguably the more safety-relevant of the two. Add a parallel `findByStand_StandId` check inside the same guard.

### 1.4 🟠 Four exception classes still return 500

`GlobalExceptionHandler` has eight handlers but does **not** extend `ResponseEntityExceptionHandler`, so these fall through to `@ExceptionHandler(Exception.class)`:

| Exception | Current | Should be |
|---|---|---|
| `HttpMessageNotReadableException` (malformed JSON) | 500 | 400 |
| `HttpRequestMethodNotSupportedException` | 500 | 405 |
| `HttpMediaTypeNotSupportedException` | 500 | 415 |
| `AccessDeniedException` from `@PreAuthorize` | 500 | 403 |

The last one is a trap worth understanding before you add RBAC. Denials from `authorizeHttpRequests` are thrown inside the security filter chain and handled by Spring Security's `ExceptionTranslationFilter` → correct 403, never reaching your advice. But a denial from **method security** (`@PreAuthorize`) is thrown inside the DispatcherServlet, propagates to `@RestControllerAdvice`, and your catch-all converts it to **500**. Right now there is no `@PreAuthorize` anywhere so this is latent — it will bite the moment you fix §2.2.

My own test `FlightControllerValidationTest#createFlight_MalformedJson_ShouldReturn400` predicted the first row and said so in a comment; that signal wasn't acted on. Fix both at once:

```java
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler { ... }

@ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
public ProblemDetail handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
    return build(HttpStatus.FORBIDDEN, "access-denied", "You do not have permission to perform this action", req, ex, false);
}
```
Note that extending `ResponseEntityExceptionHandler` changes some return types to `ResponseEntity<Object>`; keep your `ProblemDetail` builders and override `handleExceptionInternal` if you want one consistent body shape.

### 1.5 ✅ Delay-log concurrency: correctly fixed

This one is right, and worth saying so precisely. `logTaskDelay` takes `PESSIMISTIC_WRITE` on the parent `flights` row, *then* reads `MAX(delay_seq_no)`, then inserts:

```java
Flight lockedFlight = flightRepository.findByIdForUpdate(flightId).orElseThrow(...);
int nextSeq = delayLogRepository.findMaxSeqForFlight(flightId) + 1;
```

Transaction B blocks on the `SELECT … FOR UPDATE` until A commits and releases, so B reads A's committed sequence. The TOCTOU window is genuinely closed. Two supporting details are also correct: `logTaskDelay` is a private method invoked from within the same class, so it joins the caller's transaction rather than silently bypassing a proxy (which is what would happen if you later annotate it `@Transactional(REQUIRES_NEW)` — don't); and `@Lock` on a `@Query` method is the supported way to do this in Spring Data JPA.

Two things to record as invariants:
- **The lock is on `flights`, not `delay_logs`.** It works only because `logTaskDelay` is the sole writer. If you add a "supervisor manually records a delay" endpoint later, it must take the same lock or the race returns. Document this on the method.
- **Keep lock ordering consistent** (`flights` before `tasks`). Today the `tasks` UPDATE flushes at commit, after the `flights` lock is held, so ordering is uniform and deadlock risk is low. A future path that locks `tasks` first would invert it.

Longer term, the more robust design is to stop computing the sequence in application code — either make `delay_seq_no` a plain identity/sequence column, or insert with `ON CONFLICT DO NOTHING` and retry.

### 1.6 ⚠️ ReportService: N+1 eliminated, but replaced by full-table scans

The per-flight query is gone — one `findAll()` plus a `Set` membership test. Correct as far as it goes. But it now loads **every row of `delay_logs` and every row of `tasks`** into heap to compute six scalars. At your seed scale (35 delay logs, 120 tasks) that's invisible; it grows without bound. Replace with aggregate projections:

```java
// DelayLogRepository
@Query("SELECT DISTINCT d.id.flightId FROM DelayLog d")
Set<Long> findDistinctDelayedFlightIds();

// TaskRepository
long countByStatus(String status);
long countByStatusIn(Collection<String> statuses);
```
That takes the endpoint to four cheap queries with no entity hydration. Minor bonus: prefer `d.getId().getFlightId()` over `d.getFlight().getFlightId()` — with `@MapsId` the FK already lives in the embedded id, so you avoid depending on Hibernate's proxy-identifier optimisation.

### 1.7 🟠 N+1 still live in two other places

I checked the entity fetch strategies before asserting this: `Flight` correctly declares all seven associations `LAZY`, which avoids the classic EAGER-plus-JPQL trap. But `mapToDTO` dereferences non-identifier getters on all seven (`getGate().getGateNumber()`, `getAirline().getAirlineName()`, …), each of which forces proxy initialisation:

| Call site | Query used | Associations fetch-joined | Lazy inits per flight |
|---|---|---|---|
| `FlightService.getSaphireHubFlights()` | `findAllSaphireHubFlightsWithDetails()` | 4 of 7 | **3** (gate, stand, department) |
| `GateService.getAllGates()` | `findAllSaphireHubFlights()` | **0** | **up to 7** |

At 60 seed flights that's roughly 180 extra queries on `GET /api/flights` and up to ~420 on `GET /api/gates`. Fix by extending the fetch-join — **and note the join type matters:**

```java
@Query("""
       SELECT DISTINCT f FROM Flight f
         JOIN FETCH f.originAirport
         JOIN FETCH f.destinationAirport
         JOIN FETCH f.airline
         JOIN FETCH f.aircraft
         LEFT JOIN FETCH f.gate
         LEFT JOIN FETCH f.stand
         LEFT JOIN FETCH f.department
       WHERE f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1
       """)
List<Flight> findAllSaphireHubFlightsWithDetails();
```
`gate`, `stand` and `department` are nullable, so an inner `JOIN FETCH` would **silently drop every flight without a gate assigned** — exactly the flights a gate-planning screen most needs to see. The existing four are `nullable = false`, so inner join is safe there. Then point `GateService` at this query instead of the bare one. The comment already on `findAllSaphireHubFlightsWithDetails` correctly warns against adding `@OneToMany` collections without `DISTINCT`; these are all to-one, so no Cartesian inflation.

---

## 2. Security & Production Readiness

### 2.1 🟠 CORS is now configured twice, in conflict

**The five controllers were not modified at all** — I diffed `FlightController` against the original and they are byte-identical. All five still carry `@CrossOrigin(origins = "*")`, while `SecurityConfig` now also registers a `CorsConfigurationSource` restricted to `http://localhost:3000`.

Both mechanisms will run: Spring Security's `CorsFilter` (from `.cors()`) in the filter chain, and Spring MVC's per-handler CORS processing (from `@CrossOrigin`). The usual outcome is a response carrying **two `Access-Control-Allow-Origin` headers**, which browsers reject outright ("…contains multiple values"). You may not have noticed yet because Phase 2 had no browser client. Phase 3 is a React app on `localhost:3000` — this will surface on the first fetch.

**Fix: delete `@CrossOrigin` from all five controllers** and let `SecurityConfig` own CORS centrally. On the preflight question specifically: `OPTIONS` *is* in your `allowedMethods`, and Security's `CorsFilter` short-circuits preflight before authorization, so preflight will work once the duplicate is removed. Add `config.setAllowCredentials(true)` only if you move to cookie-based auth — with bearer tokens you don't need it, and it's incompatible with a wildcard origin.

### 2.2 🟠 RBAC is defined in the docs but barely enforced in code

`SecurityConfig` restricts exactly two paths; everything else is `.anyRequest().authenticated()`. Against your README's own RBAC table that leaves real gaps:

| Endpoint | Current | README intent |
|---|---|---|
| `PUT /api/flights/{id}/status` | any authenticated user | `ROLE_ATC` for `LANDED`/`DEPARTED`; supervisors otherwise |
| `POST /api/flights` | any authenticated user | `ROLE_ADMIN` / `ROLE_SUPERVISOR` |
| `PUT /api/tasks/{id}/status` | any authenticated user | `ROLE_GROUND_CREW`, **own department only** |

So a ground-crew token can currently mark any flight `DEPARTED`. `@EnableMethodSecurity` is switched on but there is not a single `@PreAuthorize` in the codebase. Add path rules for the coarse cases and `@PreAuthorize` for the row-level one ("own department") — and fix §1.4's `AccessDeniedException` handler *first*, or your 403s will arrive as 500s.

### 2.3 🟠 Identity is taken from the request body, not the token

`JwtService` puts `userId` in the claims, but `JwtAuthFilter` never reads it — the principal is just the username string. Meanwhile `TaskController` passes `dto.getUserId()` from the **request body** into `updateTaskStatus`, so any authenticated caller can attribute task work to any user ID they like. For a system whose NFR §6 demands a trustworthy 7-year audit trail, actor identity must come from the verified token:

```java
// JwtAuthFilter — carry userId through as the principal
Long userId = claims.get("userId", Long.class);
var principal = new AocsPrincipal(userId, claims.getSubject());  // small record
var authToken = new UsernamePasswordAuthenticationToken(principal, null, authorities);
```
Then drop `userId` from `StatusUpdateDTO` and read it from the `SecurityContext`. This also unblocks the `TODO(audit)` still sitting in `FlightService.updateFlightStatus` — `AuditLog` is now in the bundle, so that can finally be wired.

### 2.4 🔴 `application.properties` is absent — the app will not start

No `.properties` or `.yml` anywhere in the bundle. `JwtService` declares `@Value("${aocs.jwt.secret}")` with **no default**, so context startup fails with an unresolvable-placeholder error. If the file merely wasn't zipped, confirm it contains:

```properties
aocs.jwt.secret=${AOCS_JWT_SECRET:}      # >= 32 bytes; inject from env, never commit a real secret
aocs.jwt.expiry-minutes=60
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
```
Also note `Keys.hmacShaKeyFor()` throws `WeakKeyException` for a secret under 32 bytes (256 bits for HS256) — a short dev secret produces a confusing startup crash. Fail fast with a clear message in the constructor instead.

### 2.5 🟠 `secret.getBytes()` is platform-charset dependent (my bug)

```java
this.key = Keys.hmacShaKeyFor(secret.getBytes());   // uses the default charset
```
If `file.encoding` differs between a developer's machine and the deployment target, the derived key differs and **every previously issued token becomes invalid**. Always pin the charset:
```java
this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
```

### 2.6 🟡 `JwtAuthFilter` is registered twice

It's annotated `@Component` **and** wired via `addFilterBefore`. Spring Boot auto-registers any `Filter` bean into the servlet container's chain, so it exists in two chains. In practice the default ordering saves you — Security's chain sits at order `-100`, ahead of plain filter beans, so the in-chain instance authenticates first and `OncePerRequestFilter`'s already-filtered guard makes the later container-level invocation a no-op. **Auth does work**; I'm flagging fragility, not breakage. But the filter also runs for dispatches that bypass the security chain, and the behaviour depends on ordering you didn't choose. Make it explicit:

```java
@Bean
public FilterRegistrationBean<JwtAuthFilter> disableAutoRegistration(JwtAuthFilter filter) {
    var reg = new FilterRegistrationBean<>(filter);
    reg.setEnabled(false);   // security chain registers it deliberately
    return reg;
}
```

### 2.7 🟡 Malformed authorities from empty/missing role claims (my bug)

Two paths produce junk `GrantedAuthority` values:
- `JwtService` writes `roleName == null ? "" : roleName` → filter builds the authority `"ROLE_"`.
- If the claim is absent, `String.valueOf(claims.get("role"))` yields the string `"null"` → authority `"ROLE_null"`.

Neither grants access (no rule matches), so this is cosmetic rather than a privilege issue — but it pollutes logs and would mislead anyone debugging a 403. Omit the claim when the role is null, and in the filter grant no authority rather than a synthesised one.

### 2.8 BCrypt and the `V3` migration

**BCrypt itself is correct**: `BCryptPasswordEncoder` bean, hashes never leave `AuthService`, `LoginResponseDTO` has no password field, and `matches()` returns `false` (rather than throwing) when `passwordHash` is `NULL` — so a user with no hash simply cannot log in. That fails closed, which is the right direction.

The migration has three problems:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)
  DEFAULT '$2a$10$e8w617u.S92a4m6Z9mZ8ve0A/x9Bv6g5C8g5C8g5C8g5C8g5C8g5C';
```

1. **Drop the column `DEFAULT` entirely.** Every future `INSERT` that omits a password silently inherits a *shared, known* hash. Today that's harmless because the value is unusable (see below); if anyone ever replaces it with a working hash, you've created a backdoor across all new accounts. Use `ALTER TABLE users ALTER COLUMN password_hash DROP DEFAULT;` and add `NOT NULL` once backfill is done — that also aligns the DB with the intent, since the entity currently declares the column nullable.
2. **The default hash looks fabricated.** I verified it is *structurally* valid (60 chars, correct `$2a$10$` prefix, 53-char salt+digest, valid BCrypt alphabet) — but the tail `C8g5C8g5C8g5C8g5C` is a repeating pattern that real BCrypt output does not produce. It will match no password.
3. **Verify the backfill hash empirically.** `$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xD0D1bPHZ3OmyI.6` is also structurally valid, but I have no way to confirm it actually hashes `password123` — I could not run BCrypt here, and I won't guess. Prove it with a throwaway test before you rely on it for the demo:

```java
@Test void seedHashMatchesDocumentedPassword() {
    assertThat(new BCryptPasswordEncoder()
        .matches("password123", "$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xD0D1bPHZ3OmyI.6")).isTrue();
}
```
If it fails, generate a fresh hash locally and update `V3` **before** it reaches anyone's database (Flyway checksums make editing an applied migration painful — better to fix it now than to need a `V4` repair).

One thing I checked and can confirm as correct: `@Table(name = "tasks")` on `TurnaroundTask` matches `ALTER TABLE tasks` in the migration, so the `notes` column lands on the right table and `ddl-auto=validate` will be satisfied. I had suspected a `turnaround_tasks` mismatch from the earlier design docs; that's not an issue here.

### 2.9 Also noted
- **No token revocation, refresh, or login rate limiting.** Acceptable at this scope — just be ready to say so in the viva rather than being caught out. Brute-forcing `/api/auth/login` is currently unthrottled.
- **No clock-skew tolerance** in `Jwts.parser()` (default 0) and no issuer/audience validation. Minor for a single-node deployment.
- **`.claims(Map.of(...))` after `.subject(...)`** — in jjwt 0.12.x `claims(Map)` merges, so the subject survives; but the ordering dependence is easy to break on an upgrade. Prefer explicit `.claim("userId", …).claim("role", …)`. Also, `Map.of` throws NPE on a null value, which is why the empty-string role in §2.7 exists — explicit `.claim()` calls remove that coupling too.
- **No `@Version` on `Flight` or `TurnaroundTask`.** `updateFlightStatus` reads with `findById` and writes without any concurrency guard, so two simultaneous status updates can lost-update. The state machine narrows the damage (most conflicting pairs are now illegal transitions) but doesn't eliminate it.
- **Still open from the first review's §3** (all lower priority, all untouched because the controllers weren't modified): no pagination/sorting/filtering on list endpoints, no `Location` header on `201`, no `/v1` prefix despite the README documenting one, `@RequestParam` vs body inconsistency on `assignTaskUser`, and the `GateAssignmentDTO` contract still disagreeing with the README's documented gate-assignment route.

---

## 3. What Improved — Credit Where It's Due

Not everything needs a fix note, and the delta here is real:

- **The security layer went from nonexistent to functional.** Stateless sessions, BCrypt, a filter chain, and a token that the frontend can actually use.
- **The state machine is genuinely well done.** `canTransitionTo` handles `CANCELLED` as a cross-cutting terminal case instead of enumerating it nine times; `parseStatus` returns 400 with the valid value list; the timestamp branches are consistently null-guarded, which closes the analytics-corruption bug cleanly.
- **The pessimistic-locking fix is correct** (§1.5) — including the subtle parts about transaction participation and lock ordering.
- **RFC 7807 with a correlation ID and server-side logging** is a genuine step up, and the detail-free 500 path is exactly right.
- **`Flight` is all-`LAZY`.** I went in expecting the EAGER-plus-JPQL N+1 trap and it isn't there.
- **`pom.xml` is clean**: Boot 3.2.5, Java 17, jjwt pinned at 0.12.6 (matching the fluent API the code uses), Lombok managed by the parent at a version that supports `@Builder` on records.

---

## 4. Updated Grade: **B−**

Three of three blockers are substantively resolved at the code level, and the security architecture is a real improvement. That's meaningful progress from C+.

It isn't higher because two basic gates aren't met:

1. **The test suite does not compile**, so nothing is verified. A build that doesn't run tests can't be said to have fixed anything, only to have changed it.
2. **A headline fix is inert.** Gate conflict detection reads as implemented, passes a test, and cannot fire against real data. That's a worse failure mode than an unimplemented feature, because it looks done — and it's the specific requirement your own NFR §3.8 calls out.

Add to that: the app likely won't boot without the missing config, CORS is actively self-conflicting right before you attach a browser client, and RBAC exists mostly in documentation.

### The path to A− (roughly a day of work, in this order)

| # | Task | Why first |
|---|---|---|
| 1 | Fix the 3 record-accessor lines; run `mvn test` | Nothing else is verifiable until the suite runs |
| 2 | Fix the seed BCrypt hash + drop the column `DEFAULT` | Cheap; blocks login demos if wrong; painful to change after Flyway applies it |
| 3 | Add `application.properties` with a ≥32-byte secret | App won't start otherwise |
| 4 | Delete `@CrossOrigin` from all 5 controllers | Phase 3 breaks on day one otherwise |
| 5 | Rewrite the gate window using `inboundFlightId`; **fix the test fixture too** | The actual unmet requirement |
| 6 | Add the stand overlap check | Same guard, small addition |
| 7 | `extends ResponseEntityExceptionHandler` + `AccessDeniedException` → 403 | Must precede RBAC or 403s arrive as 500s |
| 8 | Add `LEFT JOIN FETCH` for gate/stand/department; point `GateService` at it | Biggest cheap performance win |
| 9 | `getBytes(UTF_8)`; disable the duplicate filter registration; clean the role claim | Small hygiene, prevents mystery bugs later |
| 10 | Path-based RBAC + `@PreAuthorize`; token-derived identity; wire `AuditLog` | Closes the NFR §6 compliance gap |

### Before Phase 3 specifically

Items **1, 3, and 4** are hard prerequisites — a React client cannot talk to a backend that doesn't boot or emits duplicate CORS headers. Item **10** matters more than it looks for frontend work: if the API doesn't return real 401/403 responses, you'll build login and route-guard logic against behaviour that changes underneath you later. Get authentication semantics stable before writing the first `axios` interceptor.

One process suggestion. Both §1.1 and §1.2 are cases where a comment in the code named the risk — "verify against your live entity semantics", "if this test reports 500, that's the signal" — and the note was integrated verbatim along with the code. When a handed-over file contains a flagged assumption, that flag is a task, not documentation. Grepping the branch for `TODO`, `ASSUMPTION`, and `OPEN MODELING QUESTION` before the next handoff would have caught both.
