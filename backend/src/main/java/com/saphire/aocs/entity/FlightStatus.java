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
 * DELAYED is deliberately NOT a state here. A flight is still fundamentally BOARDING or
 * SERVICING even while running late — you already model "is this delayed, and why" as a
 * separate concern via the DELAY_LOGS weak entity. Folding "current stage" and "running late"
 * into one mutually-exclusive column is what let ReportService's "ON_BLOCK" filter (line 29 of
 * the original) reference a value the documented CHECK constraint didn't even allow. If the
 * frontend needs a "delayed" badge, derive it from `estimatedDepartureTime` vs.
 * `scheduledDepartureTime` (or the presence of a DELAY_LOGS row), not from this enum.
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
            CANCELLED, Set.of()                     // terminal
    );

    public boolean canTransitionTo(FlightStatus target) {
        if (target == CANCELLED) {
            return this != DEPARTED && this != CANCELLED;
        }
        return ALLOWED.getOrDefault(this, Set.of()).contains(target);
    }
}
