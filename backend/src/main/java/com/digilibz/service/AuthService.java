package com.digilibz.service;

import com.digilibz.models.User;
import com.digilibz.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User login(String email, String password) {
        User user = (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.admin) {
            throw new RuntimeException("Unauthorized: Use admin login page");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        user.setPassword(null);
        return user;
    }

    public User loginAdmin(String email, String password) {
        User user = (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (user.getRole() != User.Role.admin) {
            throw new RuntimeException("Unauthorized: Admin access only");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        user.setPassword(null);
        return user;
    }

    public String generateToken(User user) {
        return java.util.UUID.randomUUID().toString();
    }
}