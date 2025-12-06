package com.digilibz.repository;

import com.digilibz.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
    Optional<Transaction> findByInvoiceCode(String invoiceCode);

    List<Transaction> findByStatusAndType(String status, String type);
}