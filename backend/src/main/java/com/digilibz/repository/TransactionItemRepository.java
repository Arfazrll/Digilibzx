package com.digilibz.repository;

import com.digilibz.models.TransactionItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionItemRepository extends JpaRepository<TransactionItem, String> {
}