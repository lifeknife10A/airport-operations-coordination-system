package com.saphire.aocs.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Every route used to be permitAll() regardless of login state -- a valid JWT proved who you
 * were but nothing ever checked it. Now anyRequest() requires a valid, non-revoked session
 * (JwtAuthFilter populates SecurityContext only when SessionService confirms the "sid" claim is
 * still active), with a narrow, deliberate allowlist carved out below for routes the frontend
 * genuinely calls unauthenticated:
 *
 *  - POST /api/auth/login, /logout -- how you'd get/revoke a session in the first place.
 *  - GET on flights, gates, tasks -- these three are fetched together in one Promise.all by
 *    frontend/src/services/aocsDataStore.ts's initRemoteSync(), which runs on the public
 *    FlightTracker page and the homepage's LiveFlightMatrix widget for anonymous visitors.
 *    Promise.all rejects entirely if ANY of the three 401s, so gates/tasks reads have to stay
 *    public too even though nothing public actually renders gate/task data directly, or the
 *    public flight views silently fall back to demo data for every anonymous visitor.
 *  - Lost & found create/browse and inquiry submission -- genuine public passenger self-service
 *    (frontend/src/pages/public/PassengerServices.tsx, Contact.tsx) with no login of any kind.
 *  - Inquiry lookup by ticket number -- same idea as a package-tracking number: knowing the
 *    specific ticket is the access control, not a login.
 *
 *  - GET /actuator/health -- container/orchestrator liveness checks, not a staff login flow.
 *
 * Everything else (all mutations, billing, border control, check-in/PNR, audit logs, user
 * management, shift handover, runway telemetry, incidents, reports) requires authentication.
 *
 * NOT covered by this pass, flagged as still-open gaps rather than silently pretended-away:
 *  - This is authentication only (any valid staff session), not role-based authorization. The
 *    role names this class's previous version guessed at (ADMIN/SUPERVISOR/GROUND_CREW/ATC)
 *    don't match the real seeded role_name values (e.g. AIRPORT_OPERATIONS_MANAGER,
 *    SYSTEM_ADMINISTRATOR) -- so today a CHECKIN_AGENT's token can call the billing or
 *    border-control endpoints just as successfully as a SYSTEM_ADMINISTRATOR's. Per-endpoint
 *    @PreAuthorize/hasRole rules against the real role names are a separate follow-up.
 *  - /api/webhooks/** now requires a browser-style JWT session, which doesn't really fit a
 *    system-to-system webhook (an external system won't have a staff login). Left authenticated
 *    (the safer default) rather than public, but the correct long-term fix is a separate
 *    API-key/HMAC scheme for that controller, not user auth.
 *  - No refresh tokens, no rate limiting on /api/auth/login.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // enables @PreAuthorize on controller/service methods
public class SecurityConfig {

    // Was a hardcoded http://localhost:* / 127.0.0.1:* list -- fine for this machine, but it meant
    // a real deployed frontend on any other origin would be silently CORS-blocked with nothing in
    // the response to explain why. Now reads from aocs.cors.allowed-origins (comma-separated),
    // defaulting to the same localhost patterns so local dev is unaffected.
    @Value("${aocs.cors.allowed-origins:http://localhost:*,http://127.0.0.1:*}")
    private List<String> allowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // stateless bearer-token API, no cookies -> CSRF doesn't apply
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/v1/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/logout", "/api/v1/auth/logout").permitAll()

                // Standard practice to leave health checks open: container orchestrators (Docker's
                // own HEALTHCHECK, Kubernetes liveness/readiness probes, a load balancer) need to
                // reach this without a staff login, and the exposure is already capped to just
                // `health` (management.endpoints.web.exposure.include), not the full actuator
                // surface -- everything else under /actuator/** still requires authentication.
                .requestMatchers(HttpMethod.GET, "/actuator/health", "/actuator/health/**").permitAll()

                // The generated API contract and its UI. Doesn't leak anything the shipped
                // frontend bundle doesn't already reveal (every endpoint path is in its JS), and
                // gating it behind a staff login would defeat its purpose for anyone integrating
                // against this API without already having an account.
                .requestMatchers(HttpMethod.GET, "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                .requestMatchers(HttpMethod.GET, "/api/flights/**", "/api/v1/flights/**").permitAll()
                .requestMatchers(HttpMethod.GET,
                        "/api/gates", "/api/v1/gates", "/api/airside/gates", "/api/v1/airside/gates").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/tasks", "/api/v1/tasks").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/weather/latest", "/api/v1/weather/latest").permitAll()

                .requestMatchers(HttpMethod.GET, "/api/lost-found/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/lost-found").permitAll()

                .requestMatchers(HttpMethod.POST, "/api/inquiries", "/api/v1/inquiries").permitAll()
                .requestMatchers(HttpMethod.GET,
                        "/api/inquiries/ticket/**", "/api/v1/inquiries/ticket/**").permitAll()

                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
