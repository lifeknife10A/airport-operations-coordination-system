package com.saphire.aocs.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown on any failed login — unknown username OR wrong password.
 *
 * Deliberately used for BOTH cases with the SAME message and SAME HTTP status. Returning a
 * different status/message for "user does not exist" vs. "wrong password" lets an attacker
 * enumerate valid usernames one request at a time; collapsing both into one exception type
 * removes that signal entirely.
 */
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
