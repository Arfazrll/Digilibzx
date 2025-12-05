package com.digilibz.controller;

import com.digilibz.service.TransactionService;
import com.digilibz.dto.TransactionRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

     @Operation(summary = "Tambah data transaksi", description = "Menambah data transaksi")
     @PostMapping()
     public ResponseEntity<?> postTransaction(
             @Valid @RequestBody TransactionRequest transactionRequest
     ) {
         try {
             var transaction = transactionService.createTransaction(transactionRequest);
             return ResponseEntity.ok().body(
                     Map.of("message", "Transaction successfully created", "data", transaction)
             );
         } catch (Exception e) {
             return ResponseEntity.status(500).body(Map.of("message", "Failed to create transaction", "error", e.getMessage()));
         }
     }

     @Operation(summary = "Ambil data invoice transaksi berdasarkan invoiceCode", description = "Mengambil daftar transaksi berdasarkan [invoiceCode=INV-20241211-0001]")
     @GetMapping("/invoice")
     public ResponseEntity<?> getTransactionByInvoiceCode(
             @RequestParam(value = "invoiceCode", required = true) String invoiceCode
     ) {
         Map<String, Object> response = transactionService.getTransactionByInvoiceCode(invoiceCode);
         return ResponseEntity.ok().body(response);
     }

     @Operation(summary = "Ambil data transaksi berdasarkan status & type (optional)", description = "Mengambil data transaksi berdasarkan status & type")
     @GetMapping()
     public ResponseEntity<?> getTransactionWithStatusType(
             @RequestParam(value = "search", required = false) String search,
             @RequestParam(value = "status", required = false) String status,
             @RequestParam(value = "type", required = false) String type,
             @RequestParam(value = "userId", required = false) String userId
     ) {
         return ResponseEntity.ok().body(transactionService.getTransactionsWithFilter(search, status, type, userId));
     }

     @PutMapping
     @Operation(summary = "Perbarui status transaksi berdasarkan kode invoice",
             description = "Memperbarui status transaksi dengan kode invoice dan status baru.")
     public ResponseEntity<?> updateTransactionStatus(
             @RequestParam(value = "invoiceCode", required = true) String invoiceCode,
             @RequestParam(value = "status", required = true) String status,
             @RequestParam(value = "type", required = false) String type
     ) {
         try {
             transactionService.updateTransactionStatus(invoiceCode, status, type);
             return ResponseEntity.ok().body(Map.of("message", "Status transaksi berhasil diperbarui"));
         } catch (IllegalArgumentException e) {
             return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Gagal memperbarui status transaksi"));
         }
     }

}