package com.saphire.aocs.config;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Registered explicitly rather than relying on Jackson's ServiceLoader auto-discovery of
 * jackson-datatype-hibernate6 -- that didn't pick the module up in practice (confirmed: adding
 * only the dependency, with no @Bean, still threw the same serialization error live). Without
 * this, any controller returning a JPA entity whose association graph reaches an uninitialized
 * lazy proxy fails with "HttpMessageConversionException: Type definition error: [...
 * ByteBuddyInterceptor]" -- Jackson trying to introspect the Hibernate proxy class itself instead
 * of the real entity it wraps.
 *
 * FORCE_LAZY_LOADING is left off (the default): a still-lazy association serializes as null
 * rather than silently issuing an extra query during serialization, which both keeps responses
 * predictable and avoids reintroducing the N+1 this session already fixed in several repositories.
 */
@Configuration
public class JacksonConfig {

    @Bean
    public Hibernate6Module hibernate6Module() {
        return new Hibernate6Module();
    }
}
