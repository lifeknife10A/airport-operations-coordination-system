package com.saphire.aocs.entity;

import java.util.Map;
import java.util.Set;

/**
 * Turnaround task lifecycle, matching the CHECK constraint documented in
 * operational_flow_and_data_dictionary.md Table 8: PENDING, IN_PROGRESS, COMPLETED, BLOCKED.
 *
 * The guard here removes the need for the original TurnaroundTaskService to fabricate a fake
 * actualStart timestamp when a task jumped straight from PENDING to COMPLETED — with this in
 * place, that jump is now structurally impossible: you cannot reach COMPLETED without having
 * passed through IN_PROGRESS first, which is where a *real* actualStart gets recorded.
 */
public enum TaskStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    BLOCKED;

    private static final Map<TaskStatus, Set<TaskStatus>> ALLOWED = Map.of(
            PENDING,     Set.of(IN_PROGRESS, BLOCKED),
            IN_PROGRESS, Set.of(COMPLETED, BLOCKED),
            BLOCKED,     Set.of(IN_PROGRESS),
            COMPLETED,   Set.of()   // terminal
    );

    public boolean canTransitionTo(TaskStatus target) {
        return ALLOWED.getOrDefault(this, Set.of()).contains(target);
    }
}
