package com.digilibz.service.user;

import com.digilibz.models.User;
import com.digilibz.dto.user.UserRequestDTO;
import org.springframework.stereotype.Service;

@Service
public class AdminService extends UserService {

    public User registerAdmin(UserRequestDTO adminDTO) {
        if (userRepository.existsByEmail(adminDTO.getEmail())) {
            throw new IllegalArgumentException("Email sudah digunakan.");
        }
        User user = new User();
        user.setEmail(adminDTO.getEmail());
        user.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
        user.setName(adminDTO.getName());
        user.setRole(User.Role.admin);
        user.setPhone(adminDTO.getPhone());
        return userRepository.save(user);
    }

    public User updateAdmin(User newAdmin, String id) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    if (newAdmin.getEmail() != null && !newAdmin.getEmail().equals(existingUser.getEmail())) {
                        if (userRepository.existsByEmail(newAdmin.getEmail())) {
                            throw new IllegalArgumentException("Email is already in use");
                        }
                        existingUser.setEmail(newAdmin.getEmail());
                    }
                    if (newAdmin.getPhone() != null && !newAdmin.getPhone().equals(existingUser.getPhone())) {
                        if (userRepository.existsByPhone(newAdmin.getPhone())) {
                            throw new IllegalArgumentException("Phone number is already in use");
                        }
                        existingUser.setPhone(newAdmin.getPhone());
                    }
                    if(!newAdmin.getName().isEmpty()){
                        existingUser.setName(newAdmin.getName());
                    }
                    if(!newAdmin.getPassword().isEmpty()){
                        existingUser.setPassword(passwordEncoder.encode(newAdmin.getPassword()));
                    }
                    if (!newAdmin.getRole().toString().isEmpty()){
                        existingUser.setRole(newAdmin.getRole());
                    }
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User admin not found with ID: " + id));
    }
}