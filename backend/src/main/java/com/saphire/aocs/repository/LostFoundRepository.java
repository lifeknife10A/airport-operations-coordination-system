package com.saphire.aocs.repository;

import com.saphire.aocs.entity.LostFoundItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LostFoundRepository extends JpaRepository<LostFoundItem, Long> {

    Optional<LostFoundItem> findByReferenceCode(String referenceCode);

    List<LostFoundItem> findByStatus(String status);

    List<LostFoundItem> findByCategory(String category);

    // Every nullable filter is CAST to string. Without it Hibernate 6 sends a null :query with no
    // type information, Postgres infers bytea for it, and LOWER(bytea) doesn't exist -- so any
    // request that didn't supply a search term (i.e. the default list view) threw a 500.
    @Query("SELECT item FROM LostFoundItem item " +
           "WHERE (CAST(:query AS string) IS NULL " +
           "   OR LOWER(item.referenceCode) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) " +
           "   OR LOWER(item.itemName) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) " +
           "   OR LOWER(item.colorAndDescription) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%')) " +
           "   OR LOWER(item.foundLocationDetail) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))) " +
           "AND (CAST(:category AS string) IS NULL OR item.category = CAST(:category AS string)) " +
           "AND (CAST(:status AS string) IS NULL OR item.status = CAST(:status AS string)) " +
           "ORDER BY item.createdAt DESC")
    Page<LostFoundItem> searchItems(
            @Param("query") String query,
            @Param("category") String category,
            @Param("status") String status,
            Pageable pageable
    );

    long countByStatus(String status);
}
