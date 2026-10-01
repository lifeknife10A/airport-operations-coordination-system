package com.saphire.aocs.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Gives every request a correlation id and logs one line per request.
 *
 * The id is taken from an incoming X-Correlation-Id header when it looks safe (so a caller or
 * gateway can supply its own), otherwise generated. It is put in the logging MDC -- so every log
 * line written while handling the request carries it -- and echoed back in the response header.
 * GlobalExceptionHandler reuses it as the "correlationId" it returns in error bodies, so an id a
 * user reports can be searched straight to the matching server log lines.
 *
 * Successful GETs are logged at DEBUG (they are the bulk of the traffic); anything that changes
 * state, or that failed, is logged at INFO/WARN. Headers, bodies and tokens are never logged.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter extends OncePerRequestFilter {

    public static final String HEADER = "X-Correlation-Id";
    public static final String MDC_KEY = "correlationId";
    /** Set by JwtAuthFilter once a token is accepted, so the request line can name the caller. */
    public static final String USER_ATTRIBUTE = "aocs.authenticatedUser";

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
    // Only accept ids that can't be used to inject fake log lines or oversized values.
    private static final Pattern SAFE_ID = Pattern.compile("^[A-Za-z0-9._-]{1,64}$");

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain chain) throws ServletException, IOException {
        String supplied = request.getHeader(HEADER);
        String correlationId = supplied != null && SAFE_ID.matcher(supplied).matches()
                ? supplied : UUID.randomUUID().toString();

        MDC.put(MDC_KEY, correlationId);
        response.setHeader(HEADER, correlationId);
        long start = System.nanoTime();
        try {
            chain.doFilter(request, response);
        } finally {
            long ms = (System.nanoTime() - start) / 1_000_000;
            int status = response.getStatus();
            Object user = request.getAttribute(USER_ATTRIBUTE);
            String who = user != null ? user.toString() : "anonymous";

            if (status >= 500) {
                log.error("{} {} -> {} in {}ms user={}", request.getMethod(), request.getRequestURI(), status, ms, who);
            } else if (status >= 400) {
                log.warn("{} {} -> {} in {}ms user={}", request.getMethod(), request.getRequestURI(), status, ms, who);
            } else if ("GET".equals(request.getMethod()) || "OPTIONS".equals(request.getMethod())) {
                log.debug("{} {} -> {} in {}ms user={}", request.getMethod(), request.getRequestURI(), status, ms, who);
            } else {
                log.info("{} {} -> {} in {}ms user={}", request.getMethod(), request.getRequestURI(), status, ms, who);
            }
            MDC.remove(MDC_KEY);
        }
    }
}
