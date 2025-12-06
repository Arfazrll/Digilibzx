package com.digilibz.service;

import com.digilibz.service.user.UserService;
import com.digilibz.dto.review.ReviewDTO;
import com.digilibz.dto.review.ReviewRequest;
import com.digilibz.dto.review.ReviewContent;
import com.digilibz.models.Book;
import com.digilibz.models.Review;
import com.digilibz.models.User;
import com.digilibz.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private BookService bookService;

    @Autowired
    private UserService userService;

    @Autowired
    private ReviewRepository reviewRepository;

    public List<ReviewDTO> getReview(String bookId, Integer max) {
        if (max == null) {
            max = 5;
        }

        PageRequest pageRequest = PageRequest.of(0, max);

        Page<Review> reviewPage = (bookId != null)
                ? reviewRepository.findByBookId(bookId, pageRequest)
                : reviewRepository.findAll(pageRequest);

        return reviewPage.getContent().stream()
                .map(review -> new ReviewDTO(
                        review.getId(),
                        review.getBook().getTitle(),
                        review.getAuthor().getName(),
                        review.getDate(),
                        review.getRating(),
                        review.getContent()
                ))
                .collect(Collectors.toList());
    }

    public ResponseEntity<?> submitReview(ReviewRequest reviewRequest) {
        String bookId = reviewRequest.getBookId();
        String userId = reviewRequest.getReview().getAuthorId();

        Optional<Book> bookOptional = bookService.getBookById(bookId);
        if (bookOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of("message", "Book not found with id: " + bookId)
            );
        }

        Optional<User> userOptional = userService.findById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of("message", "User not found with id: " + userId)
            );
        }

        ReviewContent reviewContent = reviewRequest.getReview();
        String authorId = reviewContent.getAuthorId();
        double rating = reviewContent.getRating();
        String content = reviewContent.getContent();

        Review review = new Review();
        review.setBook(bookOptional.get());
        review.setAuthor(userOptional.get());
        review.setDate(LocalDateTime.now());
        review.setRating(rating);
        review.setContent(content);

        reviewRepository.save(review);

        Map<String, Object> response = new HashMap<>();
        response.put("bookId", bookId);
        response.put("author", authorId);
        response.put("rating", rating);
        response.put("content", content);

        return ResponseEntity.ok().body(response);
    }
}