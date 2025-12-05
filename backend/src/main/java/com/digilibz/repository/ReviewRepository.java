package com.digilibz.repository;

import com.digilibz.models.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    Page<Review> findByBookId(String bookId, Pageable pageable);
    Page<Review> findAll(Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r")
    Double findAverageRating();
}