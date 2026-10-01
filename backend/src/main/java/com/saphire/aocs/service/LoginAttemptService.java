package com.saphire.aocs.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.saphire.aocs.exception.TooManyRequestsException;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Brute-force protection for /api/auth/login. Two independent counters:
 *
 *  - per submitted username: stops guessing one account's password. Counts attempts for names
 *    that don't exist too, so a lockout can't be used to find out which usernames are real.
 *  - per client IP: stops one machine spraying guesses across many usernames.
 *
 * After too many failures inside the window the key is locked for a fixed period and further
 * attempts (even with the right password) get 429 + Retry-After without touching the database.
 * A successful login clears that username's counter.
 *
 * State is in memory: it resets on restart and isn't shared between instances. That is enough to
 * make online guessing impractical for a single node; a multi-node deployment should move the
 * counters to Redis or the database. The IP is the socket address, so behind a reverse proxy the
 * proxy must be configured to pass the client address through (server.forward-headers-strategy).
 */
@Service
public class LoginAttemptService {

    private static final Logger log = LoggerFactory.getLogger(LoginAttemptService.class);
    private static final int MAX_TRACKED_KEYS = 50_000;
    private static final int MAX_KEY_LENGTH = 100;

    private static final class Entry {
        int failures;
        Instant windowStart;
        Instant lockedUntil;
    }

    private final ConcurrentHashMap<String, Entry> entries = new ConcurrentHashMap<>();
    private final Clock clock;
    private final int maxUserFailures;
    private final int maxIpFailures;
    private final Duration window;
    private final Duration lockDuration;

    @Autowired
    public LoginAttemptService(
            @Value("${aocs.security.login.max-failures:5}") int maxUserFailures,
            @Value("${aocs.security.login.max-failures-per-ip:30}") int maxIpFailures,
            @Value("${aocs.security.login.window-seconds:900}") long windowSeconds,
            @Value("${aocs.security.login.lock-seconds:900}") long lockSeconds) {
        this(Clock.systemUTC(), maxUserFailures, maxIpFailures,
                Duration.ofSeconds(windowSeconds), Duration.ofSeconds(lockSeconds));
    }

    LoginAttemptService(Clock clock, int maxUserFailures, int maxIpFailures,
                        Duration window, Duration lockDuration) {
        this.clock = clock;
        this.maxUserFailures = maxUserFailures;
        this.maxIpFailures = maxIpFailures;
        this.window = window;
        this.lockDuration = lockDuration;
    }

    /** Throws TooManyRequestsException if this username or IP is currently locked out. */
    public void assertNotLocked(String username, String ip) {
        Instant now = clock.instant();
        long retry = Math.max(remainingLock(userKey(username), now), remainingLock(ipKey(ip), now));
        if (retry > 0) {
            log.warn("Login blocked (locked out) user='{}' ip={} retryAfter={}s", safe(username), ip, retry);
            throw new TooManyRequestsException(
                    "Too many failed login attempts. Try again in " + Math.max(1, (retry + 59) / 60) + " minute(s).",
                    retry);
        }
    }

    public void recordFailure(String username, String ip) {
        Instant now = clock.instant();
        boolean userLocked = fail(userKey(username), maxUserFailures, now);
        boolean ipLocked = fail(ipKey(ip), maxIpFailures, now);
        if (userLocked || ipLocked) {
            log.warn("Login lockout started user='{}' ip={} (userLocked={}, ipLocked={}) for {}s",
                    safe(username), ip, userLocked, ipLocked, lockDuration.toSeconds());
        }
        evictIfNeeded(now);
    }

    public void recordSuccess(String username) {
        entries.remove(userKey(username));
    }

    private boolean fail(String key, int max, Instant now) {
        boolean[] justLocked = {false};
        entries.compute(key, (k, e) -> {
            if (e == null || e.windowStart == null || now.isAfter(e.windowStart.plus(window))) {
                e = new Entry();
                e.windowStart = now;
            }
            e.failures++;
            if (e.failures >= max && (e.lockedUntil == null || now.isAfter(e.lockedUntil))) {
                e.lockedUntil = now.plus(lockDuration);
                justLocked[0] = true;
            }
            return e;
        });
        return justLocked[0];
    }

    private long remainingLock(String key, Instant now) {
        Entry e = entries.get(key);
        if (e == null || e.lockedUntil == null || !now.isBefore(e.lockedUntil)) {
            return 0;
        }
        return Math.max(1, Duration.between(now, e.lockedUntil).toSeconds());
    }

    private void evictIfNeeded(Instant now) {
        if (entries.size() <= MAX_TRACKED_KEYS) {
            return;
        }
        entries.entrySet().removeIf(en -> {
            Entry e = en.getValue();
            boolean lockActive = e.lockedUntil != null && now.isBefore(e.lockedUntil);
            boolean windowOpen = e.windowStart != null && !now.isAfter(e.windowStart.plus(window));
            return !lockActive && !windowOpen;
        });
    }

    private static String userKey(String username) {
        return "u:" + safe(username);
    }

    private static String ipKey(String ip) {
        return "ip:" + (ip == null ? "unknown" : ip);
    }

    private static String safe(String username) {
        String s = username == null ? "" : username.trim().toLowerCase(Locale.ROOT);
        return s.length() > MAX_KEY_LENGTH ? s.substring(0, MAX_KEY_LENGTH) : s;
    }
}
