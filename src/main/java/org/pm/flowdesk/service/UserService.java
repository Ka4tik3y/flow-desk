package org.pm.flowdesk.service;

import jakarta.persistence.criteria.Predicate;
import org.pm.flowdesk.dto.UserRequest;
import org.pm.flowdesk.exception.BadRequestException;
import org.pm.flowdesk.exception.ForbiddenException;
import org.pm.flowdesk.exception.NotFoundException;
import org.pm.flowdesk.model.Role;
import org.pm.flowdesk.model.User;
import org.pm.flowdesk.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<User> listUsers(String query, Pageable pageable) {
        Specification<User> spec = (root, q, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (query != null && !query.isBlank()) {
                String like = "%" + query.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("username")), like),
                        cb.like(cb.lower(root.get("email")), like)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return userRepository.findAll(spec, pageable);
    }

    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new NotFoundException("User not found"));
    }

    public User create(UserRequest request) {
        validateUniqueFields(request.getEmail(), request.getUsername(), null);

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BadRequestException("Password is required");
        }
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() == null ? Role.USER : request.getRole());

        return userRepository.save(user);
    }

    public User update(Long id, UserRequest request, User currentUser) {
        User existing = getById(id);

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean selfUpdate = currentUser.getId().equals(id);

        if (!isAdmin && !selfUpdate) {
            throw new ForbiddenException("You can only update your own profile");
        }

        validateUniqueFields(request.getEmail(), request.getUsername(), id);

        existing.setUsername(request.getUsername());
        existing.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (isAdmin && request.getRole() != null) {
            existing.setRole(request.getRole());
        }

        return userRepository.save(existing);
    }

    public void delete(Long id) {
        User existing = getById(id);
        userRepository.delete(existing);
    }

    private void validateUniqueFields(String email, String username, Long excludeId) {
        userRepository.findByEmail(email).ifPresent(user -> {
            if (excludeId == null || !user.getId().equals(excludeId)) {
                throw new BadRequestException("Email already in use");
            }
        });

        userRepository.findByUsername(username).ifPresent(user -> {
            if (excludeId == null || !user.getId().equals(excludeId)) {
                throw new BadRequestException("Username already in use");
            }
        });
    }
}
