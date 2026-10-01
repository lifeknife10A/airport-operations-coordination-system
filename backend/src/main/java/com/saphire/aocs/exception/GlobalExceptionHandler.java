package com.saphire.aocs.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.net.URI;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String PROBLEM_BASE_URI = "https://api.saphire-aocs.example/problems/";

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, "resource-not-found", ex.getMessage(), req, ex, false);
    }

    @ExceptionHandler(BadRequestException.class)
    public ProblemDetail handleBadRequest(BadRequestException ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, "bad-request", ex.getMessage(), req, ex, false);
    }

    @ExceptionHandler(ConflictException.class)
    public ProblemDetail handleConflict(ConflictException ex, HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, "state-conflict", ex.getMessage(), req, ex, false);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ProblemDetail handleUnauthorized(UnauthorizedException ex, HttpServletRequest req) {
        return build(HttpStatus.UNAUTHORIZED, "invalid-credentials", ex.getMessage(), req, ex, false);
    }

    @ExceptionHandler(TooManyRequestsException.class)
    public ResponseEntity<ProblemDetail> handleTooManyRequests(TooManyRequestsException ex, HttpServletRequest req) {
        ProblemDetail pd = build(HttpStatus.TOO_MANY_REQUESTS, "too-many-requests", ex.getMessage(), req, ex, false);
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header(HttpHeaders.RETRY_AFTER, String.valueOf(ex.getRetryAfterSeconds()))
                .body(pd);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ProblemDetail handleAccessDenied(org.springframework.security.access.AccessDeniedException ex, HttpServletRequest req) {
        return build(HttpStatus.FORBIDDEN, "access-denied", "You do not have permission to perform this action", req, ex, false);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fe.getField(), fe.getDefaultMessage());
        }
        ProblemDetail pd = build(HttpStatus.BAD_REQUEST, "validation-failed",
                "One or more fields failed validation", req, ex, false);
        pd.setProperty("fieldErrors", fieldErrors);
        return pd;
    }

    @ExceptionHandler({MissingServletRequestParameterException.class, MethodArgumentTypeMismatchException.class, HttpMessageNotReadableException.class})
    public ProblemDetail handleBadParameter(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, "malformed-request",
                "A required parameter was missing or the request body was malformed", req, ex, false);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest req) {
        // Only a duplicate (23505) or a still-referenced/missing parent row (23503) is a genuine
        // conflict with existing data. NOT NULL (23502) and CHECK (23514) failures mean the
        // request itself is invalid, which is a 400, not a 409.
        String sqlState = ex.getRootCause() instanceof java.sql.SQLException sql ? sql.getSQLState() : null;
        if ("23502".equals(sqlState) || "23514".equals(sqlState)) {
            return build(HttpStatus.BAD_REQUEST, "invalid-data",
                    "The request contains a value the database does not accept", req, ex, true);
        }
        return build(HttpStatus.CONFLICT, "data-integrity-violation",
                "The request conflicts with an existing record or violates a data rule", req, ex, true);
    }

    @ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
    public ProblemDetail handleNoResource(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, "not-found", "No such resource", req, ex, false);
    }

    @ExceptionHandler(org.springframework.web.HttpRequestMethodNotSupportedException.class)
    public ProblemDetail handleMethodNotAllowed(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.METHOD_NOT_ALLOWED, "method-not-allowed", "That HTTP method is not supported here", req, ex, false);
    }

    @ExceptionHandler(org.springframework.web.HttpMediaTypeNotSupportedException.class)
    public ProblemDetail handleUnsupportedMedia(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "unsupported-media-type", "Unsupported content type", req, ex, false);
    }

    @ExceptionHandler(org.springframework.data.mapping.PropertyReferenceException.class)
    public ProblemDetail handleBadSort(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, "malformed-request", "Unknown sort or filter property", req, ex, false);
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnexpected(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "internal-error",
                "An unexpected error occurred. Please contact support with the reference id below.",
                req, ex, true);
    }

    private ProblemDetail build(HttpStatus status, String type, String publicMessage,
                                 HttpServletRequest req, Exception ex, boolean isUnexpected) {
        // Same id RequestLoggingFilter put in the MDC and the X-Correlation-Id response header, so
        // the id in this error body matches every log line for the request.
        String correlationId = org.slf4j.MDC.get("correlationId");
        if (correlationId == null) {
            correlationId = UUID.randomUUID().toString();
        }

        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, publicMessage);
        pd.setType(URI.create(PROBLEM_BASE_URI + type));
        pd.setTitle(status.getReasonPhrase());
        pd.setInstance(URI.create(req.getRequestURI()));
        pd.setProperty("timestamp", Instant.now());
        pd.setProperty("correlationId", correlationId);

        if (isUnexpected) {
            log.error("[{}] Unhandled {} on {} {}", correlationId, ex.getClass().getSimpleName(),
                    req.getMethod(), req.getRequestURI(), ex);
        } else {
            log.warn("[{}] {} on {} {}: {}", correlationId, ex.getClass().getSimpleName(),
                    req.getMethod(), req.getRequestURI(), ex.getMessage());
        }
        return pd;
    }
}
