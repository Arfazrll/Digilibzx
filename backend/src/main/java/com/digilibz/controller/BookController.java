package com.digilibz.controller;

import com.digilibz.models.Book;
import com.digilibz.service.BookService;
import com.digilibz.service.ReviewService;
import com.digilibz.dto.review.ReviewDTO;
import com.digilibz.exception.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private ReviewService reviewService;

    @Operation(summary = "Get all books", description = "Retrieve all books with optional filters")
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "years", required = false) Integer years
    ) {
        List<Book> books = bookService.getAllBooks(search, category, years);
        return ResponseEntity.ok(books);
    }

    @Operation(summary = "Get recommended books", description = "Retrieve recommended books with max data filters")
    @GetMapping("/recommended")
    public ResponseEntity<List<Book>> getRecommendedBooks(
            @RequestParam(value = "max", required = false) Integer max
    ) {
        List<Book> books = bookService.getRecommendedBooks(max);
        return ResponseEntity.ok(books);
    }

    @Operation(summary = "Get book by ID", description = "Retrieve a book by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBookById(
            @Parameter(description = "ID of the book to retrieve", required = true) @PathVariable String id,
            @RequestParam(value = "max", required = false) Integer max
    ) {
        Book book = bookService.getBookById(id)
                .orElseThrow(() -> new ApiException("No value present", HttpStatus.NOT_FOUND));

        List<ReviewDTO> reviews = reviewService.getReview(id, max);

        Map<String, Object> response = new HashMap<>(book.toMap());
        response.put("reviews", reviews);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        Book createdBook = bookService.addBook(book);
        return ResponseEntity.ok(createdBook);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable String id, @RequestBody Book book) {
        try {
            Book updatedBook = bookService.updateBook(id, book);
            return ResponseEntity.ok(updatedBook);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Delete book by ID", description = "Delete a book by its ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(
            @Parameter(description = "ID of the book to delete", required = true)
            @PathVariable String id
    ) {
        if (!bookService.existsById(id)) {
            throw new ApiException("No value present", HttpStatus.NOT_FOUND);
        }

        bookService.deleteById(id);

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.OK.value());
        response.put("message", "Book successfully deleted");
        response.put("path", "/api/books/" + id);

        return ResponseEntity.ok(response);
    }
}