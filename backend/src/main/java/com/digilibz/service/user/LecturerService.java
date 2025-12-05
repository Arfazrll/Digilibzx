package com.digilibz.service.user;

import com.digilibz.models.User;
import com.digilibz.dto.user.LecturerRequestDTO;
import org.springframework.stereotype.Service;

@Service
public class LecturerService extends UserService {

    public User registerLecturer(LecturerRequestDTO lecturerDTO) {
        if (userRepository.existsByEmail(lecturerDTO.getEmail())) {
            throw new IllegalArgumentException("Email sudah digunakan.");
        }
        User user = new User();
        user.setEmail(lecturerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(lecturerDTO.getPassword()));
        user.setName(lecturerDTO.getName());
        user.setRole(User.Role.lecturer);
        user.setPhone(lecturerDTO.getPhone());
        user.setNip(lecturerDTO.getNip());
        return userRepository.save(user);
    }

    public User updateLecturer(User newLecturer, String id) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    if (newLecturer.getEmail() != null && !newLecturer.getEmail().equals(existingUser.getEmail())) {
                        if (userRepository.existsByEmail(newLecturer.getEmail())) {
                            throw new IllegalArgumentException("Email is already in use");
                        }
                        existingUser.setEmail(newLecturer.getEmail());
                    }
                    if (newLecturer.getPhone() != null && !newLecturer.getPhone().equals(existingUser.getPhone())) {
                        if (userRepository.existsByPhone(newLecturer.getPhone())) {
                            throw new IllegalArgumentException("Phone number is already in use");
                        }
                        existingUser.setPhone(newLecturer.getPhone());
                    }
                    if(!newLecturer.getName().isEmpty()){
                        existingUser.setName(newLecturer.getName());
                    }
                    if(!newLecturer.getPassword().isEmpty()){
                        existingUser.setPassword(passwordEncoder.encode(newLecturer.getPassword()));
                    }
                    if (!newLecturer.getRole().toString().isEmpty()){
                        existingUser.setRole(newLecturer.getRole());
                    }
                    if(!newLecturer.getNip().isEmpty()){
                        existingUser.setNip(newLecturer.getNip());
                    }
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User lecturer not found with ID: " + id));
    }
}