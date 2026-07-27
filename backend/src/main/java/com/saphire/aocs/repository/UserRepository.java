package com.saphire.aocs.repository;

import com.saphire.aocs.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    List<User> findByDepartment_DepartmentId(Long departmentId);

    List<User> findByRole_RoleId(Long roleId);
}
