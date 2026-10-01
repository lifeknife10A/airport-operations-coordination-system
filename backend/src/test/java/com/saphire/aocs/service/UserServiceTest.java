package com.saphire.aocs.service;

import com.saphire.aocs.dto.UserResponseDTO;
import com.saphire.aocs.dto.UserStatusUpdateDTO;
import com.saphire.aocs.entity.Department;
import com.saphire.aocs.entity.Role;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @InjectMocks private UserService userService;

    private User user(long id, String username) {
        return User.builder()
                .userId(id).username(username).name("Test User")
                .role(Role.builder().roleId(1L).roleName("GATE_AGENT").build())
                .department(Department.builder().departmentId(1L).departmentName("Airside").build())
                .build();
    }

    @Test
    @DisplayName("getAllUsers maps role/department names and always reports ACTIVE")
    void getAllUsers_MapsFields() {
        when(userRepository.findAll()).thenReturn(List.of(user(1L, "aarav.s")));

        List<UserResponseDTO> result = userService.getAllUsers();

        assertThat(result).hasSize(1);
        UserResponseDTO dto = result.get(0);
        assertThat(dto.getUsername()).isEqualTo("aarav.s");
        assertThat(dto.getRole()).isEqualTo("GATE_AGENT");
        assertThat(dto.getDepartment()).isEqualTo("Airside");
        assertThat(dto.getStatus()).isEqualTo("ACTIVE");
    }

    @Test
    @DisplayName("user id 10 (root admin) cannot be suspended")
    void rootAdminId_CannotBeSuspended() {
        assertThatThrownBy(() -> userService.updateUserStatus(10L,
                UserStatusUpdateDTO.builder().status("SUSPENDED").build()))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    @DisplayName("the 'admin' username cannot suspend itself, regardless of id")
    void adminUsername_CannotSuspendSelf() {
        when(userRepository.findById(42L)).thenReturn(Optional.of(user(42L, "admin")));

        assertThatThrownBy(() -> userService.updateUserStatus(42L,
                UserStatusUpdateDTO.builder().status("SUSPENDED").build()))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    @DisplayName("an ordinary user can be suspended")
    void ordinaryUser_CanBeSuspended() {
        when(userRepository.findById(5L)).thenReturn(Optional.of(user(5L, "aarav.s")));

        UserResponseDTO result = userService.updateUserStatus(5L,
                UserStatusUpdateDTO.builder().status("SUSPENDED").build());

        assertThat(result.getUserId()).isEqualTo(5L);
    }

    @Test
    @DisplayName("an unknown user id is a 404, not a silent no-op")
    void unknownUser_ThrowsNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateUserStatus(999L,
                UserStatusUpdateDTO.builder().status("SUSPENDED").build()))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
