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

    @Query("SELECT item FROM LostFoundItem item " +
           "WHERE (:query IS NULL OR LOWER(item.referenceCode) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(item.itemName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(item.colorAndDescription) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "   OR LOWER(item.foundLocationDetail) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:category IS NULL OR item.category = :category) " +
           "AND (:status IS NULL OR item.status = :status) " +
           "ORDER BY item.createdAt DESC")
    Page<LostFoundItem> searchItems(
            @Param("query") String query,
            @Param("category") String category,
            @Param("status") String status,
            Pageable pageable
    );

    long countByStatus(String status);
}
