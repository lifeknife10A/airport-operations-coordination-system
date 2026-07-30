package com.saphire.aocs.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a request is syntactically valid but conflicts with the current state of a
 * resource — an illegal Flight/Task status transition, or a gate/stand double-booking.
 *
 * Maps to 409 CONFLICT, which is the semantically correct code here: the payload itself is
 * fine (that's a 400), the problem is that it disagrees with the resource's current state.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
