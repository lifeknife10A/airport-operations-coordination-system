package com.saphire.aocs.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
 * Minimal security wiring. This entire package/class did not exist in the reviewed ZIP — every
 * endpoint, including PUT /api/flights/{id}/status and PUT /api/gates/assign, was reachable by
 * anyone with network access regardless of login state.
 *
 * The role names in requestMatchers below (ADMIN, SUPERVISOR, GROUND_CREW, ATC) match the
 * ROLE_* values already named in README.md's RBAC table and
 * operational_flow_and_data_dictionary.md Table 1 — wire this up against whatever the real
 * `roles.role_name` values turn out to be (they're currently defined as ROLE_ADMIN,
 * ROLE_SUPERVISOR, ROLE_GROUND_CREW, ROLE_ATC, ROLE_DISPATCH; JwtAuthFilter already normalizes
 * to a "ROLE_" prefix so hasRole("ADMIN") below matches a ROLE_ADMIN authority).
 *
 * Scope note: this is deliberately minimal for a project at this stage — no refresh tokens, no
 * token revocation list, no rate limiting on /api/auth/login. Call these out explicitly as
 * "next steps" rather than pretending this is a finished IAM system.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // enables @PreAuthorize on controller/service methods
public class SecurityConfig {

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
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/reports/**").hasAnyRole("ADMIN", "SUPERVISOR")
                .requestMatchers("/api/gates/assign").hasAnyRole("ADMIN", "SUPERVISOR")
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // README.md's own CORS Policy section: the React dev origin, never "*" — a wildcard
        // origin combined with credentialed/Authorization-header requests is rejected by
        // browsers anyway, so "*" was always going to break the moment auth landed.
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
