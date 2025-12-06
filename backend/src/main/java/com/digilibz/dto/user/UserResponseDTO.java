package com.digilibz.dto.user;

import com.digilibz.models.User;

public class UserResponseDTO {
    private String id;
    private String email;
    private String name;
    private User.Role role;
    private String phone;

    public UserResponseDTO() {}

    public UserResponseDTO(String id, String email, String name, User.Role role, String phone) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.phone = phone;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User.Role getRole() {
        return role;
    }

    public void setRole(User.Role role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}