package com.digilibz.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "transaction_items")
public class TransactionItem {

     @Id
     @GeneratedValue(strategy = GenerationType.UUID)
     private String id;

     @ManyToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "transaction_id", nullable = false)
     private Transaction transaction;

     @ManyToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "book_id", nullable = false)
     private Book book;

     public String getId() {
         return id;
     }

     public void setId(String id) {
         this.id = id;
     }

     public Transaction getTransaction() {
         return transaction;
     }

     public void setTransaction(Transaction transaction) {
         this.transaction = transaction;
     }

     public Book getBook() {
         return book;
     }

     public void setBook(Book book) {
         this.book = book;
     }
}