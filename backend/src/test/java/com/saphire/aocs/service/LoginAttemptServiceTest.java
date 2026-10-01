package com.saphire.aocs.service;

import com.saphire.aocs.exception.TooManyRequestsException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LoginAttemptServiceTest {

    /** Clock the test can move forward, so lockout windows can be tested without sleeping. */
    static class MutableClock extends Clock {
        Instant now = Instant.parse("2026-01-01T00:00:00Z");
        @Override public java.time.ZoneId getZone() { return ZoneOffset.UTC; }
        @Override public Clock withZone(java.time.ZoneId zone) { return this; }
        @Override public Instant instant() { return now; }
        void advance(Duration d) { now = now.plus(d); }
    }

    private MutableClock clock;
    private LoginAttemptService service;

    @BeforeEach
    void setUp() {
        clock = new MutableClock();
        // 3 failures per user, 5 per IP, 10 minute window, 15 minute lock
        service = new LoginAttemptService(clock, 3, 5, Duration.ofMinutes(10), Duration.ofMinutes(15));
    }

    private void fail(String user, String ip, int times) {
        for (int i = 0; i < times; i++) service.recordFailure(user, ip);
    }

    @Test
    @DisplayName("stays open until the failure limit is reached")
    void belowLimit_isNotLocked() {
        fail("alice", "1.1.1.1", 2);
        assertThatCode(() -> service.assertNotLocked("alice", "1.1.1.1")).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("locks the username at the limit and reports how long to wait")
    void atLimit_locksUserWithRetryAfter() {
        fail("alice", "1.1.1.1", 3);
        assertThatThrownBy(() -> service.assertNotLocked("alice", "9.9.9.9"))
                .isInstanceOfSatisfying(TooManyRequestsException.class,
                        e -> assertThat(e.getRetryAfterSeconds()).isBetween(1L, 900L));
    }

    @Test
    @DisplayName("the lock is per account: another user on the same IP is unaffected below the IP limit")
    void lockIsPerUsername() {
        fail("alice", "1.1.1.1", 3);
        assertThatCode(() -> service.assertNotLocked("bob", "2.2.2.2")).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("usernames are case-insensitive so changing case does not dodge the lock")
    void usernameCaseInsensitive() {
        fail("Alice", "1.1.1.1", 3);
        assertThatThrownBy(() -> service.assertNotLocked("ALICE ", "3.3.3.3")).isInstanceOf(TooManyRequestsException.class);
    }

    @Test
    @DisplayName("unknown usernames are counted too, so the lockout reveals nothing about which accounts exist")
    void unknownUsersAreCounted() {
        fail("no.such.user", "1.1.1.1", 3);
        assertThatThrownBy(() -> service.assertNotLocked("no.such.user", "1.1.1.1")).isInstanceOf(TooManyRequestsException.class);
    }

    @Test
    @DisplayName("the lock expires after the lock duration")
    void lockExpires() {
        fail("alice", "1.1.1.1", 3);
        clock.advance(Duration.ofMinutes(16));
        assertThatCode(() -> service.assertNotLocked("alice", "1.1.1.1")).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("failures outside the window don't accumulate towards a lock")
    void oldFailuresExpire() {
        fail("alice", "1.1.1.1", 2);
        clock.advance(Duration.ofMinutes(11));
        fail("alice", "1.1.1.1", 2);
        assertThatCode(() -> service.assertNotLocked("alice", "1.1.1.1")).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("a successful login clears the username's failure count")
    void successResetsCounter() {
        fail("alice", "1.1.1.1", 2);
        service.recordSuccess("alice");
        fail("alice", "1.1.1.1", 2);
        assertThatCode(() -> service.assertNotLocked("alice", "1.1.1.1")).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("one IP guessing across many usernames is locked at the IP limit")
    void ipSprayIsBlocked() {
        for (int i = 0; i < 5; i++) service.recordFailure("user" + i, "6.6.6.6");
        assertThatThrownBy(() -> service.assertNotLocked("someone.new", "6.6.6.6")).isInstanceOf(TooManyRequestsException.class);
        assertThatCode(() -> service.assertNotLocked("someone.new", "7.7.7.7")).doesNotThrowAnyException();
    }
}
