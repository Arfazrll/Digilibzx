package com.digilibz.controller;

import com.digilibz.service.user.AdminService;
import com.digilibz.service.user.LecturerService;
import com.digilibz.service.user.StudentService;
import com.digilibz.service.user.UserService;
import com.digilibz.dto.user.*;
import com.digilibz.models.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Mengambil semua data pengguna", description = "Mengambil semua data pengguna berdasarkan parameter role (opsional)")
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers(
            @RequestParam(value = "role", required = false) String role) {
        List<User> users = userService.findAll(role);
        List<UserResponseDTO> response = users.stream()
                .map(user -> new UserResponseDTO(
                        user.getId(),
                        user.getEmail(),
                        user.getName(),
                        user.getRole(),
                        user.getPhone(),
                        user.getNim(),
                        user.getNip(),
                        user.getYear()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Mengambil data user berdasarkan ID-nya.", description = "Mengambil data user berdasarkan ID-nya.")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(
            @Parameter(description = "ID of the user to retrieve", required = true) @PathVariable String id) {
        Optional<User> user = userService.findById(id);
        UserResponseDTO response = new UserResponseDTO(
                user.get().getId(),
                user.get().getEmail(),
                user.get().getName(),
                user.get().getRole(),
                user.get().getPhone(),
                user.get().getNim(),
                user.get().getNip(),
                user.get().getYear()
        );
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update user data by id", description = "TAMBAHKAN ROLE [admin, student, lecturer]")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User newUser) {
        try {
            User updatedUser = userService.updateUser(newUser, id);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @Operation(summary = "Delete user", description = "Delete a user by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        try {
            userService.deleteById(id);
            response.put("status", "success");
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @Autowired
    private StudentService studentService;

    @Operation(summary = "Register a student", description = "Register a user with the role of student")
    @PostMapping("/register/student")
    public ResponseEntity<User> registerStudent(@Valid @RequestBody StudentRequestDTO studentDTO) {
        User user = studentService.registerStudent(studentDTO);
        return ResponseEntity.status(201).body(user);
    }

    @Autowired
    private LecturerService lecturerService;

    @Operation(summary = "Register a lecturer", description = "Register a user with the role of lecturer")
    @PostMapping("/register/lecturer")
    public ResponseEntity<User> registerLecturer(@Valid @RequestBody LecturerRequestDTO lecturerDTO) {
        User user = lecturerService.registerLecturer(lecturerDTO);
        return ResponseEntity.status(201).body(user);
    }

    @Autowired
    private AdminService adminService;

    @Operation(summary = "Register an admin", description = "Register a user with the role of admin")
    @PostMapping("/register/admin")
    public ResponseEntity<User> registerAdmin(@Valid @RequestBody UserRequestDTO adminDTO) {
        User user = adminService.registerAdmin(adminDTO);
        return ResponseEntity.status(201).body(user);
    }
}