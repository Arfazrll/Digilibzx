package com.digilibz.service.user;

import com.digilibz.models.User;
import com.digilibz.repository.UserRepository;
import com.digilibz.dto.user.UserRequestDTO;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    protected UserRepository userRepository;
    
    @Autowired
    protected PasswordEncoder passwordEncoder;

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public List<User> findAll(String role) {
        if (role != null && !role.isEmpty()) {
            return userRepository.findAllByRole(User.Role.valueOf(role.toUpperCase()));
        }
        return userRepository.findAll();
    }

    public void deleteById(String id) {
        userRepository.deleteById(id);
    }

    public User registerUser(UserRequestDTO userDTO, User.Role role) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email sudah digunakan.");
        }
        
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setName(userDTO.getName());
        user.setRole(role);
        user.setPhone(userDTO.getPhone());
        
        return userRepository.save(user);
    }

    public User updateUser(User newUser, String id) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    if (newUser.getEmail() != null && !newUser.getEmail().equals(existingUser.getEmail())) {
                        if (userRepository.existsByEmail(newUser.getEmail())) {
                            throw new IllegalArgumentException("Email is already in use");
                        }
                        existingUser.setEmail(newUser.getEmail());
                    }
                    if (newUser.getPhone() != null && !newUser.getPhone().equals(existingUser.getPhone())) {
                        if (userRepository.existsByPhone(newUser.getPhone())) {
                            throw new IllegalArgumentException("Phone number is already in use");
                        }
                        existingUser.setPhone(newUser.getPhone());
                    }
                    if (newUser.getName() != null && !newUser.getName().isEmpty()) {
                        existingUser.setName(newUser.getName());
                    }
                    if (newUser.getPassword() != null && !newUser.getPassword().isEmpty()) {
                        existingUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
                    }
                    if (newUser.getRole() != null) {
                        existingUser.setRole(newUser.getRole());
                    }
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }
}