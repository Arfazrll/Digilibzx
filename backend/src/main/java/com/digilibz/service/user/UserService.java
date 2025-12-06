package com.digilibz.service.user;

import com.digilibz.models.User;
import com.digilibz.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
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
        return Optional.ofNullable(userRepository.findById(id).orElse(null));
    }

    public List<User> findAll(String role) {
        if (role != null && !role.isEmpty()) {
            return userRepository.findAllByRole(User.Role.valueOf(role));
        }
        return userRepository.findAll();
    }

    public void deleteById(String id) {
        userRepository.deleteById(id);
    }

    @Lazy
    @Autowired
    private AdminService adminService;
    @Lazy
    @Autowired
    private LecturerService lecturerService;
    @Lazy
    @Autowired
    private StudentService studentService;

    public User updateUser(User newUser, String id) {
        switch (newUser.getRole()) {
            case admin:
                return adminService.updateAdmin(newUser, id);
            case lecturer:
                return lecturerService.updateLecturer(newUser, id);
            case student:
                return studentService.updateStudent(newUser, id);
            default:
                throw new IllegalArgumentException("Invalid user role");
        }
    }
}