package com.saphire.aocs.entity;

import java.util.Map;
import java.util.Set;

/**
 * Canonical flight lifecycle. This did not exist anywhere in the original codebase — flight
 * status was a raw String accepted from the API with zero validation.
 *
 * NOTE ON SCOPE: this enum is the single source of truth this project was missing. Your own
 * docs currently disagree with each other on the exact value set:
 *   - operational_flow_and_data_dictionary.md's DB CHECK constraint: SCHEDULED, BOARDING,
 *     AIRBORNE, LANDED, DELAYED, CANCELLED (no ON_BLOCK/SERVICING/READY)
 *   - ER_Diagram_Design.md's comment: SCHEDULED, LANDED, SERVICING, READY, DEPARTED, DELAYED
 *     (no BOARDING/AIRBORNE)
 *   - chen_er_diagram_and_operational_flow.md: SCHEDULED, ON-BLOCK, SERVICING, READY, DEPARTED
 *
 * This enum uses the full ground-operations sequence (the union of the above, minus DELAYED —
 * see below), matching the state machine named in the review brief. Whichever team member owns
 * the live Flyway migration needs to update the flight_status CHECK constraint to match this
 * exact set of names before this compiles against a real database.
 *
 * DELAYED IS a state here (an earlier version excluded it on purpose). The database CHECK
 * constraint allows it, 167 seeded flights are already DELAYED and the dashboards filter and
 * badge on it, so leaving it out of this enum made every one of those flights un-updatable
 * (parsing their current status threw a 400). "Why is it late" still lives in DELAY_LOGS; this
 * only records that the flight is currently running late. A delayed flight resumes into any
 * normal stage (or is cancelled).
 */
public enum FlightStatus {
    SCHEDULED,
    LANDED,
    ON_BLOCK,
    SERVICING,
    READY,
    BOARDING,
    AIRBORNE,
    DEPARTED,
    DELAYED,
    CANCELLED;

    /**
     * Allowed forward transitions. CANCELLED is handled separately in canTransitionTo() rather
     * than listed here, since (with the exception of DEPARTED) it's reachable from every state —
     * listing it explicitly under all eight other entries would be pure noise.
     */
    private static final Map<FlightStatus, Set<FlightStatus>> ALLOWED = Map.of(
            SCHEDULED, Set.of(LANDED, BOARDING),   // BOARDING covers a pure-departure leg with no arrival-at-SPH row
            LANDED,    Set.of(ON_BLOCK),
            ON_BLOCK,  Set.of(SERVICING),
            SERVICING, Set.of(READY),
            READY,     Set.of(BOARDING),
            BOARDING,  Set.of(AIRBORNE),
            AIRBORNE,  Set.of(DEPARTED),
            DEPARTED,  Set.of(),                    // terminal
            DELAYED,   Set.of(SCHEDULED, LANDED, ON_BLOCK, SERVICING, READY, BOARDING, AIRBORNE),
            CANCELLED, Set.of()                     // terminal
    );

    public boolean canTransitionTo(FlightStatus target) {
        if (target == CANCELLED) {
            return this != DEPARTED && this != CANCELLED;
        }
        if (target == DELAYED) {
            // Can run late at any stage before it is actually in the air.
            return this != AIRBORNE && this != DEPARTED && this != CANCELLED && this != DELAYED;
        }
        return ALLOWED.getOrDefault(this, Set.of()).contains(target);
    }
}
