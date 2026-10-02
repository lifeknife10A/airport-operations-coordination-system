package com.saphire.aocs.service;

import com.saphire.aocs.dto.UserCreateDTO;
import com.saphire.aocs.dto.UserCreatedResponseDTO;
import com.saphire.aocs.dto.UserResponseDTO;
import com.saphire.aocs.dto.UserStatusUpdateDTO;
import com.saphire.aocs.entity.Department;
import com.saphire.aocs.entity.Role;
import com.saphire.aocs.entity.User;
import com.saphire.aocs.exception.BadRequestException;
import com.saphire.aocs.exception.ConflictException;
import com.saphire.aocs.exception.ResourceNotFoundException;
import com.saphire.aocs.repository.DepartmentRepository;
import com.saphire.aocs.repository.RoleRepository;
import com.saphire.aocs.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private DepartmentRepository departmentRepository;
    @Mock private SessionService sessionService;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private UserService userService;

    private User user(long id, String username) {
        return User.builder()
                .userId(id).username(username).name("Test User")
                .role(Role.builder().roleId(1L).roleName("GATE_AGENT").build())
                .department(Department.builder().departmentId(1L).departmentName("Airside").build())
                .build();
    }

    private static UserStatusUpdateDTO status(String s) {
        return UserStatusUpdateDTO.builder().status(s).build();
    }

    @Test
    @DisplayName("getAllUsers maps role/department names and the stored status")
    void getAllUsers_MapsFields() {
        User suspended = user(2L, "b.user");
        suspended.setStatus("SUSPENDED");
        when(userRepository.findAll()).thenReturn(List.of(user(1L, "aarav.s"), suspended));

        List<UserResponseDTO> result = userService.getAllUsers();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getUsername()).isEqualTo("aarav.s");
        assertThat(result.get(0).getRole()).isEqualTo("GATE_AGENT");
        assertThat(result.get(0).getDepartment()).isEqualTo("Airside");
        assertThat(result.get(0).getStatus()).isEqualTo("ACTIVE");
        assertThat(result.get(1).getStatus()).isEqualTo("SUSPENDED");
    }

    @Test
    @DisplayName("user id 10 (root admin) cannot be suspended")
    void rootAdminId_CannotBeSuspended() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(user(10L, "someone")));

        assertThatThrownBy(() -> userService.updateUserStatus(10L, status("SUSPENDED"), "other.admin"))
                .isInstanceOf(BadRequestException.class);
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("the 'admin' username cannot be suspended, regardless of id")
    void adminUsername_CannotBeSuspended() {
        when(userRepository.findById(42L)).thenReturn(Optional.of(user(42L, "admin")));

        assertThatThrownBy(() -> userService.updateUserStatus(42L, status("SUSPENDED"), "other.admin"))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    @DisplayName("an administrator cannot suspend their own account")
    void cannotSuspendSelf() {
        when(userRepository.findById(7L)).thenReturn(Optional.of(user(7L, "boss.user")));

        assertThatThrownBy(() -> userService.updateUserStatus(7L, status("SUSPENDED"), "boss.user"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("own account");
    }

    @Test
    @DisplayName("suspending a user persists the status and revokes their sessions")
    void suspend_PersistsAndRevokesSessions() {
        User target = user(5L, "aarav.s");
        when(userRepository.findById(5L)).thenReturn(Optional.of(target));

        UserResponseDTO result = userService.updateUserStatus(5L, status("SUSPENDED"), "admin.user");

        assertThat(result.getStatus()).isEqualTo("SUSPENDED");
        assertThat(target.getStatus()).isEqualTo("SUSPENDED");
        verify(userRepository).save(target);
        verify(sessionService).revokeAllForUser(5L, "ACCOUNT_SUSPENDED");
    }

    @Test
    @DisplayName("reactivating a user restores ACTIVE without touching sessions")
    void reactivate_Persists() {
        User target = user(5L, "aarav.s");
        target.setStatus("SUSPENDED");
        when(userRepository.findById(5L)).thenReturn(Optional.of(target));

        UserResponseDTO result = userService.updateUserStatus(5L, status("ACTIVE"), "admin.user");

        assertThat(result.getStatus()).isEqualTo("ACTIVE");
        verify(sessionService, never()).revokeAllForUser(any(), anyString());
    }

    @Test
    @DisplayName("an unknown user id is a 404, not a silent no-op")
    void unknownUser_ThrowsNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateUserStatus(999L, status("SUSPENDED"), "admin.user"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    private UserCreateDTO createDto(String email, String role, String dept) {
        UserCreateDTO dto = new UserCreateDTO();
        dto.setName("New Person");
        dto.setEmail(email);
        dto.setRoleName(role);
        dto.setDepartmentName(dept);
        return dto;
    }

    @Test
    @DisplayName("createUser derives a unique username, hashes a random temporary password and returns it once")
    void createUser_Success() {
        when(userRepository.findByEmail("new.person@saphire.in")).thenReturn(Optional.empty());
        when(roleRepository.findByRoleName("GATE_AGENT")).thenReturn(Optional.of(Role.builder().roleId(5L).roleName("GATE_AGENT").build()));
        when(departmentRepository.findByDepartmentName("AIRSIDE")).thenReturn(Optional.of(Department.builder().departmentId(1L).departmentName("AIRSIDE").build()));
        when(userRepository.findByUsername("new.person")).thenReturn(Optional.of(user(1L, "new.person")));
        when(userRepository.findByUsername("new.person1")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("HASHED");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UserCreatedResponseDTO result = userService.createUser(createDto("New.Person@saphire.in", "gate_agent", "airside"));

        ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(saved.capture());
        assertThat(saved.getValue().getUsername()).isEqualTo("new.person1");
        assertThat(saved.getValue().getEmail()).isEqualTo("new.person@saphire.in");
        assertThat(saved.getValue().getPasswordHash()).isEqualTo("HASHED");
        assertThat(result.getTemporaryPassword()).hasSize(12);
        verify(passwordEncoder).encode(result.getTemporaryPassword());
    }

    @Test
    @DisplayName("createUser rejects a duplicate email")
    void createUser_DuplicateEmail() {
        when(userRepository.findByEmail("a@b.in")).thenReturn(Optional.of(user(1L, "a")));

        assertThatThrownBy(() -> userService.createUser(createDto("a@b.in", "GATE_AGENT", "AIRSIDE")))
                .isInstanceOf(ConflictException.class);
    }

    @Test
    @DisplayName("createUser rejects an unknown role")
    void createUser_UnknownRole() {
        when(userRepository.findByEmail("a@b.in")).thenReturn(Optional.empty());
        when(roleRepository.findByRoleName("NOPE")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.createUser(createDto("a@b.in", "nope", "AIRSIDE")))
                .isInstanceOf(BadRequestException.class);
    }
}
