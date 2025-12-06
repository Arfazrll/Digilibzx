package com.digilibz.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Setter
@Getter
@Entity
@Table(name = "books", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"title"}),
        @UniqueConstraint(columnNames = {"isbn"})
})
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "author", nullable = false, length = 255)
    private String author;

    @Column(name = "category", length = 255)
    private String category;

    @Column(name = "year")
    private int year;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "image", length = 255)
    private String image;

    @Column(name = "quota")
    private int quota;

    @Column(name = "rack_number", length = 255)
    private String rackNumber;

    @Column(name = "isbn", nullable = false, unique = true, length = 255)
    private String isbn;

    @Column(name = "language", length = 255)
    private String language;

    @Column(name = "available_copies")
    private int availableCopies;

    @Column(name = "late_fee", precision = 10, scale = 2)
    private BigDecimal lateFee;

    @Column(name = "can_borrow", nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private boolean canBorrow = true;

    @Column(name = "rating", precision = 3, scale = 2)
    private BigDecimal rating;

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", this.id);
        map.put("title", this.title);
        map.put("author", this.author);
        map.put("category", this.category);
        map.put("year", this.year);
        map.put("description", this.description);
        map.put("image", this.image);
        map.put("quota", this.quota);
        map.put("rackNumber", this.rackNumber);
        map.put("isbn", this.isbn);
        map.put("language", this.language);
        map.put("availableCopies", this.availableCopies);
        map.put("lateFee", this.lateFee);
        map.put("canBorrow", this.canBorrow);
        map.put("rating", this.rating);
        return map;
    }
}