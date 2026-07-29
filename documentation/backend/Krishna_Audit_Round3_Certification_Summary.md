# Saphire AOCS — Phase 2 Backend: Final Certification

**Bundle:** `phase2_A_grade_certified_backend.zip`
**Grade progression:** C+ → B− → B+ → **A−  ✅ CERTIFIED**
**Phase 3 clearance:** ✅ **Cleared to proceed** (two action items below, neither blocking)

**Verification method:** Static analysis and diff against the previous bundle. This environment has a JRE only — no JDK, Maven, or network — so nothing was compiled or executed. One item (§4.1) is unverifiable by inspection and is flagged as an action for you.

Five files changed, exactly matching the claimed scope: `JwtService`, `FlightRepository`, `FlightService`, `GateService`, `GateServiceTest`. **No unintended changes, and no regressions introduced.** This is the first round where every claim matched what the code actually does — worth noting explicitly, because the previous two rounds each had a claim that didn't hold up.

---

## 1. Verification of the Four Items

### ✅ 1.1 Fail-closed JWT secret — verified
```java
@Value("${aocs.jwt.secret}") String secret,                        // no default → fails closed
@Value("${aocs.jwt.expiration-ms:86400000}") long expiryMs         // matches properties key
...
byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
if (keyBytes.length < 32) {
    throw new IllegalStateException("aocs.jwt.secret must be at least 32 bytes for HS256 algorithm (got " + keyBytes.length + ")");
}
```
All three sub-items confirmed. The fallback default is gone, so a missing secret now fails at startup instead of silently booting with a known key — the regression from the last bundle is closed. Length validation throws before `Keys.hmacShaKeyFor` can produce its more cryptic `WeakKeyException`, with the actual byte count in the message.

The expiry mismatch is also properly resolved: `expiration-ms` in the code now matches `aocs.jwt.expiration-ms=86400000` in `application.properties`, and `issueToken` applies it directly (`now.getTime() + expiryMs`) rather than the old `× 60_000` conversion. Tokens now genuinely live 24 hours.

### ✅ 1.2 Stand overlap detection — verified, and genuinely active
`findByStand_StandId(Long standId)` added to `FlightRepository`, and the `stand` parameter in `assertNoOverlap` is now actually read:
```java
if (stand != null) {
    List<Flight> standConflicts = flightRepository.findByStand_StandId(stand.getStandId()).stream()
            .filter(f -> !f.getFlightId().equals(incoming.getFlightId()))
            .filter(f -> !INACTIVE_STATUSES.contains(f.getFlightStatus()))
            ...
    if (!standConflicts.isEmpty()) { throw new ConflictException("Stand " + ... ); }
}
```
Same self-exclusion, same terminal-status filter, same correct half-open overlap predicate as the gate check. The `stand != null` guard is right — a gate assignment without a stand shouldn't attempt the check. The dead-parameter defect is properly closed.

### ✅ 1.3 LEFT JOIN FETCH — verified
```java
@Query("SELECT f FROM Flight f JOIN FETCH f.originAirport JOIN FETCH f.destinationAirport
        JOIN FETCH f.airline JOIN FETCH f.aircraft
        LEFT JOIN FETCH f.gate LEFT JOIN FETCH f.stand LEFT JOIN FETCH f.department
        WHERE f.originAirport.airportId = 1 OR f.destinationAirport.airportId = 1")
List<Flight> findAllSaphireHubFlightsWithAllDetails();
```
All seven associations `mapToDTO` touches are now fetched in one query, and critically **`LEFT` was used for the three nullable ones** — so flights without a gate assigned still appear, which is the trap I flagged. Both `FlightService.getSaphireHubFlights()` and `GateService.getAllGates()` were repointed. `DISTINCT` is correctly absent: every join is to-one, so there's no row multiplication to collapse.

I also checked for the failure mode that bit you last round — the old `findAllSaphireHubFlightsWithDetails()` was *renamed* rather than kept, so I grepped the whole tree for stale references to the removed name. **None.** Clean rename.

### ✅ 1.4 Test stub alignment — verified
`GateServiceTest:180` now stubs `findAllSaphireHubFlightsWithAllDetails()`, matching the production call. The `UnnecessaryStubbingException` under `STRICT_STUBS` is resolved.

I also checked whether the new stand branch breaks the other tests: no test passes a `standId`, so `stand` is always `null`, the branch is skipped, and no test needs a `findByStand_StandId` stub. **No cascading stub failures.** I have no predicted test failures in this bundle — which is a first, though see §4.2.

---

## 2. One New Gap (minor)

**The stand-conflict branch has zero test coverage.** Zero tests pass a `standId`, so the code path added in §1.2 is never executed by the suite. It reads correctly — I traced it — but it's untested, which is precisely how the dead-parameter version survived the last round. Two tests, ~20 lines, mirroring the existing gate cases:

```java
@Test void overlappingStand_ShouldThrowConflict()   // dto with standId set, conflicting window
@Test void nonOverlappingStand_ShouldSucceed()      // dto with standId set, adjacent window
```

Also worth a cleanup pass at some point: the gate and stand conflict blocks are ~15 near-identical lines each. Extracting `findFirstConflict(List<Flight>, Flight, Window)` would remove the duplication and mean a future fix to the overlap predicate only has to be made once. Relevant to the rubric's "Innovation & Code Quality" line, not to correctness.

---

## 3. Grade: **A−** (certified)

All four items are correctly implemented, with no regressions and no stale references. Combined with the earlier rounds, the backend now has: real BCrypt authentication that fails closed, a guarded flight and task state machine with idempotent timestamps, functional gate *and* stand conflict detection, correct pessimistic locking on delay-log sequencing, RFC 7807 error responses with correlation IDs, centralised CORS, and single-query loading on both list endpoints. That is a solid, defensible backend and comfortably above what this rubric expects.

I'm holding at **A−** rather than **A** for four things, all previously flagged and all still open:

| Gap | Why it matters for the top grade |
|---|---|
| **RBAC essentially undelivered** — `SecurityConfig` restricts only `/api/reports/**` and `/api/gates/assign`; everything else is `anyRequest().authenticated()`. No `@PreAuthorize` on any method (the two grep hits are javadoc text). | `instruction.md` lists RBAC as **Expected Feature #2**, and your own README defines a five-role permission table. A ground-crew token can currently mark any flight `DEPARTED` and create flights. This is the single biggest remaining delta. |
| **Audit trail not wired** — `AuditLogRepository` isn't referenced by any service; the `TODO(audit)` in `FlightService` remains. | Your own `non_functional_requirements.md` §6 mandates an immutable 7-year audit entry for every critical transaction. |
| **Suite never confirmed green** | I still cannot execute it. I have no *predicted* failures now, which is genuine progress, but "no predicted failures" isn't "verified passing." |
| **Occupancy window is still a 60-minute proxy** — both conditional branches remain unreachable for real data, `inboundFlightId` unused, `60` an unnamed literal in two places. | Detection works for short overlaps and misses long turnarounds. Fine as a documented approximation; not an A-grade model of the domain. |

Also unchanged from prior rounds, all deliberately deferred and none grade-critical: `ReportService`'s two full-table `findAll()` calls, `ROLE_null`/`ROLE_` garbage authorities in `JwtAuthFilter`, that filter's duplicate `@Component` registration, missing 405/415 handlers, the no-op actuator exposure line, the plaintext secret in `application.properties`, and no `@Version` optimistic locking.

This is consistent with the bar I set last round — "B+ → A− is a couple of hours, most of it in §4." You completed all three §4 clearance items plus two deferred ones. A− is earned; I'm not going to move the goalposts, and equally I'm not going to certify an A while an explicitly-listed required feature is undelivered.

---

## 4. Phase 3 Clearance: ✅ Cleared

Nothing in the backend now blocks a React 18 + MUI frontend. The app boots (fail-closed secret is present and valid — 64 chars, well over the 32-byte floor), CORS is single-sourced to `http://localhost:3000`, error responses are consistent, and 401/403 semantics are correct.

**Two action items, neither blocking the start of Phase 3:**

**4.1 — Verify the seed BCrypt hash today.** This is the third round I've raised it and it's still untouched (`V3__add_password_and_notes.sql` unchanged). I genuinely cannot verify it — BCrypt isn't runnable here and I won't guess:

```java
@Test void seedHashMatchesDocumentedPassword() {
    assertThat(new BCryptPasswordEncoder()
        .matches("password123", "$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xD0D1bPHZ3OmyI.6")).isTrue();
}
```
If it fails you cannot log in at all — which means no frontend login flow and no demo. Five minutes now versus a Flyway checksum repair later. While you're in that file, also `ALTER COLUMN password_hash DROP DEFAULT` (that fabricated default hash would otherwise be inherited by every future user) and add `NOT NULL` once backfill is confirmed.

**4.2 — Do the RBAC path rules before your first axios interceptor.** Roughly an hour. If you build login and route guards against an API where every authenticated user can do everything, you'll write frontend authorisation logic against behaviour that shifts when RBAC lands, then debug it twice. Adding `requestMatchers` rules for `POST /api/flights`, `PUT /api/flights/{id}/status`, and `/api/tasks/**` stabilises the contract cheaply — and the `AccessDeniedException` → 403 handler you added last round is already in place to surface it correctly.

Everything else (stand tests, occupancy constant, `ReportService` projections, 405/415 handlers, filter hygiene) is safe to do in parallel with frontend work.

---

Good work closing this out. Three rounds ago this was an API that accepted any password and returned 500 on a missing form field; it's now a coherent, defensible backend. The two items above are worth doing before Phase 3 gathers momentum — particularly 4.1, which is five minutes and protects your demo.
