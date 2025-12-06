package com.digilibz.dto.user;

import com.digilibz.models.User;

public class AllUserRequestDTO {
    private String id;
    private String email;
    private String password;
    private String name;
    private User.Role role;
    private String phone;
    private String nim;
    private String nip;
    private String year;

    public AllUserRequestDTO() {}

    public AllUserRequestDTO(String id, String email, String name, User.Role role, String phone, String nim, String nip, String year) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.phone = phone;
        this.nim = nim;
        this.nip = nip;
        this.year = year;
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

    public String getNim() {
        return nim;
    }

    public void setNim(String nim) {
        this.nim = nim;
    }

    public String getNip() {
        return nip;
    }

    public void setNip(String nip) {
        this.nip = nip;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }
}