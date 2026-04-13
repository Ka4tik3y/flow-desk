package org.pm.flowdesk.controller;

import jakarta.validation.Valid;
import org.pm.flowdesk.dto.ResponseMapper;
import org.pm.flowdesk.dto.UserRequest;
import org.pm.flowdesk.dto.UserResponse;
import org.pm.flowdesk.exception.ForbiddenException;
import org.pm.flowdesk.model.Role;
import org.pm.flowdesk.model.User;
import org.pm.flowdesk.service.CurrentUserService;
import org.pm.flowdesk.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final CurrentUserService currentUserService;

    public UserController(UserService userService, CurrentUserService currentUserService) {
        this.userService = userService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<UserResponse> listUsers(@RequestParam(required = false) String query, Pageable pageable) {
        return userService.listUsers(query, pageable).map(ResponseMapper::toUserResponse);
    }

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable Long id) {
        User current = currentUserService.requireCurrentUser();
        if (current.getRole() != Role.ADMIN && !current.getId().equals(id)) {
            throw new ForbiddenException("You can only view your own profile");
        }
        return ResponseMapper.toUserResponse(userService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse createUser(@Valid @RequestBody UserRequest request) {
        return ResponseMapper.toUserResponse(userService.create(request));
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        User current = currentUserService.requireCurrentUser();
        return ResponseMapper.toUserResponse(userService.update(id, request, current));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }
}
