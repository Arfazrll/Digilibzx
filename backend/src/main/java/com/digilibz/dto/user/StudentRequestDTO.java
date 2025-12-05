package com.digilibz.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public class StudentRequestDTO extends UserRequestDTO {
    @NotBlank(message = "NIM is required for student")
    @Schema(description = "NIM of the student", example = "1301223164")
    private String nim;

    @NotBlank(message = "Year is required for students")
    @Schema(description = "Tahun angkatan", example = "2022")
    private String year;

    public String getNim() {
        return nim;
    }

    public void setNim(String nim) {
        this.nim = nim;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }
}