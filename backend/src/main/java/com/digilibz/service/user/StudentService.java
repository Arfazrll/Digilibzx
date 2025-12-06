package com.digilibz.service.user;

import com.digilibz.models.User;
import com.digilibz.dto.user.StudentRequestDTO;
import org.springframework.stereotype.Service;

@Service
public class StudentService extends UserService {

    public User registerStudent(StudentRequestDTO studentDTO) {
        if (userRepository.existsByEmail(studentDTO.getEmail())) {
            throw new IllegalArgumentException("Email sudah digunakan.");
        }
        User user = new User();
        user.setEmail(studentDTO.getEmail());
        user.setPassword(passwordEncoder.encode(studentDTO.getPassword()));
        user.setName(studentDTO.getName());
        user.setRole(User.Role.student);
        user.setPhone(studentDTO.getPhone());
        user.setNim(studentDTO.getNim());
        user.setYear(studentDTO.getYear());
        return userRepository.save(user);
    }

    public User updateStudent(User newStudent, String id) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    if (newStudent.getEmail() != null && !newStudent.getEmail().equals(existingUser.getEmail())) {
                        if (userRepository.existsByEmail(newStudent.getEmail())) {
                            throw new IllegalArgumentException("Email is already in use");
                        }
                        existingUser.setEmail(newStudent.getEmail());
                    }
                    if (newStudent.getPhone() != null && !newStudent.getPhone().equals(existingUser.getPhone())) {
                        if (userRepository.existsByPhone(newStudent.getPhone())) {
                            throw new IllegalArgumentException("Phone number is already in use");
                        }
                        existingUser.setPhone(newStudent.getPhone());
                    }
                    if(!newStudent.getName().isEmpty()){
                        existingUser.setName(newStudent.getName());
                    }
                    if(!newStudent.getPassword().isEmpty()){
                        existingUser.setPassword(passwordEncoder.encode(newStudent.getPassword()));
                    }
                    if (!newStudent.getRole().toString().isEmpty()){
                        existingUser.setRole(newStudent.getRole());
                    }
                    if (!newStudent.getNim().isEmpty()){
                        existingUser.setNim(newStudent.getNim());
                    }
                    if (!newStudent.getYear().isEmpty()){
                        existingUser.setYear(newStudent.getYear());
                    }
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new RuntimeException("User student not found with ID: " + id));
    }
}