# Screenshot Checklist & Appendix Slide Kit — Saphire AOCS

Companion to the 22-slide deck (`../I075_I078_I080_I088_Saphire_AOCS_Presentation.pptx`).
Everything here is built from the **verified code** — no invented behavior.

---

## Part 1 — The three appendix slides (built for you)

| File | Use as | Insert into PowerPoint |
|---|---|---|
| `AppendixA_State_Machines.svg/.png` | Backup for "show me the flight lifecycle" questions | Insert → Pictures → This Device → pick the **.svg** (stays crisp at any zoom). Use the .png if your PowerPoint is older than 2016 |
| `AppendixB_Session_Security.svg/.png` | Backup for "how does logout/security actually work" | same |
| `AppendixC_409_ProblemDetail.svg/.png` | Backup for "what does an error response look like" / ties to Slide 20 | same |

**How to add them:** open the deck → after Slide 22 add three new slides titled
*Appendix A — State Machines*, *Appendix B — Session Security*, *Appendix C — Error Contract*,
then insert each image full-bleed (it already includes its own title band). Mark them **hidden**
(slide thumbnail → right-click → Hide Slide) so they don't run in the main flow but are one click away in the viva.

**Suggested talking points when the examiner asks:**

- **Appendix A:** "Flight lifecycle is a 10-state machine in `FlightStatus.canTransitionTo()` — e.g. SCHEDULED→BOARDING is legal for a pure departure, SCHEDULED→DEPARTED is not, and illegal jumps get 409, never a DB row. Task lifecycle is a second, 4-state machine; that's what made the old *fabricated actualStart* hack impossible."
- **Appendix B:** "The JWT only proves a token was issued. Every request re-checks `auth_sessions` (revoked_at IS NULL AND expires_at > now), and the role is loaded from the DB — never from the token. Logout, login elsewhere (single session per user), and admin suspension all revoke instantly; the next request fails closed with 401."
- **Appendix C:** "One `@RestControllerAdvice` builds every error as RFC 7807 ProblemDetail with a correlationId that also appears in the `X-Correlation-Id` header and every log line. 409 means 'legal request, illegal state' — e.g. the gate occupancy/wingspan rules — shown live in the Airside Ops conflict list."

---

## Part 2 — Screenshot capture plan (the deck currently has zero live-app screenshots)

**Prerequisites**
1. `./start.sh` and log in at `http://localhost:3000/login`.
2. Find a username per role (logins accept username **or** email; shared demo password is `password123`):

```sql
SELECT r.role_name, MIN(u.username) AS username, MIN(u.email) AS email
FROM users u JOIN roles r ON u.role_id = r.role_id
GROUP BY r.role_name ORDER BY r.role_name;
```

**Golden rules**
- Browser window 1440×900 or 1920×1080, zoom 100%, bookmarks bar hidden (Cmd+Shift+B).
- Fresh session per shot; wait for data to finish loading before capturing.
- Capture **after** the fact-check fixes (see the deck audit) so the UI matches the slide wording.
- Never screenshot a feature the slides no longer claim (e.g. don't feature a "PDF" export unless implemented).

**Shot list**

| # | Target slide | Route | Log in as | What to capture | Suggested caption |
|---|---|---|---|---|---|
| 1 | 2 / 21 | `/` | — | Home hero + concourse bento | Public portal — Saphire International (SPH) |
| 2 | 21 | `/tracker` | — | Radar/search over live flights + baggage journey | Live tracker on real paged flight data |
| 3 | 21 | `/schedule` | — | Departures board, concourse filter, pagination | Live departure/arrival boards (search + paging) |
| 4 | 14 / 21 | `/dashboard/check-in` | CHECKIN_AGENT | PNR lookup → seat map → issued pass + bag tag | DCS check-in: seat map + server-issued pass |
| 5 | 13 / 21 | `/dashboard/aocc` | AIRPORT_OPERATIONS_MANAGER | Turnaround board + delay-log modal | AOCC board with turnaround progress + IATA delay codes |
| 6 | 20 | `/dashboard/airside-ops` | GATE_AGENT | Try a conflicting gate assignment → capture the rejection | Server rejects a conflicting assignment (409) |
| 7 | 20 | `/dashboard/airside-ops` | GATE_AGENT | Wingspan-vs-gate conflict list | Wingspan vs gate conflict detection (1,164 in seed) |
| 8 | 21 | `/dashboard/ground-ops` | GROUND_HANDLING_SUPERVISOR | Task board + live status counts + assignment | Ground Ops: paged tasks, live counts, staff workload |
| 9 | 21 | `/dashboard/logistics` | BAGGAGE_HANDLER | Carousel / cargo / fuel tabs | Logistics: carousels, cargo, fuel, equipment |
| 10 | 21 | `/dashboard/passenger-security` | SECURITY_OFFICER | Clearance log + incident log | Security desk: clearance scans + incident lifecycle |
| 11 | 19 / 21 | `/dashboard/system-admin` | SYSTEM_ADMINISTRATOR | Audit stream + suspend a user | System Admin: real suspension + audit trail |
| 12 | 21 | `/dashboard/billing` | AIRLINE_BILLING_CLERK | Invoice + line items | Billing: invoices reconciled to line items (V19) |

**Placement:** put the 4–6 strongest (4, 5, 6, 7, 11, 2) on **Slide 21** as a 2×3 grid; use 6/7 on
**Slide 20** as the testing evidence for the BVA/conflict claims; keep the rest for the video.

---

## Part 3 — Housekeeping before submission

1. **Commit `presentation/` to git** — it is currently **untracked**, so the deck+appendix would be missing from a repo submission. Also commit `documentation/SVG/Final Assets/`.
2. **Push `main`** — it is 7 commits ahead of `origin`; CI only validates once pushed (the deck claims "100% passing", so confirm it's green).
3. Apply the **fact-check fixes** from the audit before printing/screenshotting (18→22 controllers, Postman claim, exports wording, React Router v7, Postgres 16/18, migration file count, gate count, 409-not-400, wingspan test numbers, "integration tests" wording).
4. Rehearse the **4×~1:20 video script** in `documentation/MD/submission_guidelines.md` against the live app — the appendix diagrams make great on-screen cutaways while explaining security/state machines.
