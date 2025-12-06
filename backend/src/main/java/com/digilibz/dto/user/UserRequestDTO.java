package com.digilibz.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserRequestDTO {
    @Email(message = "Invalid email format")
    @Schema(description = "Email of the user", example = "user@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Schema(description = "Password of the user", example = "password123")
    private String password;

    @NotBlank(message = "Name is required")
    @Schema(description = "Name of the user", example = "John Doe")
    private String name;

    @Schema(description = "Role of the user (admin, user)", example = "user", defaultValue = "user", hidden = true)
    private String role;

    @NotNull(message = "Phone is required")
    @Schema(description = "Phone number of the user", example = "08123456789")
    private String phone;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}