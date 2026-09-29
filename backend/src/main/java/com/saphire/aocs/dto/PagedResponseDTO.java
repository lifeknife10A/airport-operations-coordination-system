package com.saphire.aocs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Explicit, stable JSON shape for a paginated response, used instead of returning Spring Data's
 * Page<T> directly from a controller (PageImpl's own Jackson serialization is undocumented and
 * has shifted across Spring Boot versions).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagedResponseDTO<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
