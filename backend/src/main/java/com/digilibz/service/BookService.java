package com.digilibz.service;

import com.digilibz.models.Book;
import com.digilibz.repository.BookRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public List<Book> getAllBooks(String search, String category, Integer years) {
        StringBuilder jpql = new StringBuilder("SELECT b FROM Book b WHERE 1=1");
        Map<String, Object> parameters = new HashMap<>();

        if (search != null && !search.isEmpty()) {
            jpql.append(" AND LOWER(b.title) LIKE :search");
            parameters.put("search", "%" + search.toLowerCase() + "%");
        }

        if (category != null && !category.isEmpty()) {
            jpql.append(" AND b.category = :category");
            parameters.put("category", category);
        }

        if (years != null) {
            jpql.append(" AND b.year = :year");
            parameters.put("year", years);
        }

        TypedQuery<Book> query = entityManager.createQuery(jpql.toString(), Book.class);

        parameters.forEach(query::setParameter);

        return query.getResultList();
    }

    public Optional<Book> getBookById(String id) {
        return Optional.ofNullable(bookRepository.findById(id).orElse(null));
    }

    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    public Book updateBook(String id, Book updatedBook) {
        return bookRepository.findById(id).map(existingBook -> {
            existingBook.setTitle(updatedBook.getTitle());
            existingBook.setAuthor(updatedBook.getAuthor());
            existingBook.setCategory(updatedBook.getCategory());
            existingBook.setYear(updatedBook.getYear());
            existingBook.setDescription(updatedBook.getDescription());
            existingBook.setImage(updatedBook.getImage());
            existingBook.setQuota(updatedBook.getQuota());
            existingBook.setRackNumber(updatedBook.getRackNumber());
            existingBook.setIsbn(updatedBook.getIsbn());
            existingBook.setLanguage(updatedBook.getLanguage());
            existingBook.setAvailableCopies(updatedBook.getAvailableCopies());
            existingBook.setLateFee(updatedBook.getLateFee());
            existingBook.setCanBorrow(updatedBook.isCanBorrow());
            existingBook.setRating(updatedBook.getRating());
            return bookRepository.save(existingBook);
        }).orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public void deleteById(String id) {
        bookRepository.deleteById(id);
    }

    public boolean existsById(String id) {
        return bookRepository.existsById(id);
    }

    public List<Book> getRecommendedBooks(Integer max) {
        String jpql = "SELECT b FROM Book b ORDER BY FUNCTION('RAND')";

        TypedQuery<Book> query = entityManager.createQuery(jpql, Book.class);

        if (max != null && max > 0) {
            query.setMaxResults(max);
        }

        return query.getResultList();
    }
}