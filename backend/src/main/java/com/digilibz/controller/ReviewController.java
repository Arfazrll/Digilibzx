package com.digilibz.controller;

import com.digilibz.service.ReviewService;
import com.digilibz.dto.review.ReviewDTO;
import com.digilibz.dto.review.ReviewRequest;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @Operation(summary = "Ambil daftar review by bookId", description = "Mengambil daftar review buku berdasarkan bookId")
    @GetMapping()
    public List<ReviewDTO> getNotif(
            @RequestParam(value = "bookId", required = false) String bookId,
            @RequestParam(value = "max", required = false) Integer max
    ) {
        return reviewService.getReview(bookId, max);
    }

    @Operation(summary = "Tambah review", description = "Menambah review untuk buku")
    @PostMapping()
    public ResponseEntity<?> postReview(@RequestBody ReviewRequest reviewRequest) {
        return reviewService.submitReview(reviewRequest);
    }
}