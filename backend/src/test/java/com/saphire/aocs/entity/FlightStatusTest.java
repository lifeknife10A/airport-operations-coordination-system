package com.saphire.aocs.entity;

import org.junit.jupiter.api.Test;

import static com.saphire.aocs.entity.FlightStatus.*;
import static org.assertj.core.api.Assertions.assertThat;

class FlightStatusTest {

    @Test
    void delayedFlightCanResumeAnyNormalStageOrBeCancelled() {
        assertThat(DELAYED.canTransitionTo(BOARDING)).isTrue();
        assertThat(DELAYED.canTransitionTo(SCHEDULED)).isTrue();
        assertThat(DELAYED.canTransitionTo(CANCELLED)).isTrue();
    }

    @Test
    void flightCanBeDelayedBeforeDepartureButNotOnceAirborne() {
        assertThat(SCHEDULED.canTransitionTo(DELAYED)).isTrue();
        assertThat(BOARDING.canTransitionTo(DELAYED)).isTrue();
        assertThat(AIRBORNE.canTransitionTo(DELAYED)).isFalse();
        assertThat(DEPARTED.canTransitionTo(DELAYED)).isFalse();
        assertThat(CANCELLED.canTransitionTo(DELAYED)).isFalse();
        assertThat(DELAYED.canTransitionTo(DELAYED)).isFalse();
    }

    @Test
    void existingTransitionsAreUnchanged() {
        assertThat(SCHEDULED.canTransitionTo(DEPARTED)).isFalse();
        assertThat(LANDED.canTransitionTo(ON_BLOCK)).isTrue();
        assertThat(DEPARTED.canTransitionTo(CANCELLED)).isFalse();
    }
}
