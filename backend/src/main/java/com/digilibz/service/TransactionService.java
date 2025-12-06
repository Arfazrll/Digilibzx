package com.digilibz.service;

import com.digilibz.models.*;
import com.digilibz.dto.TransactionRequest;
import com.digilibz.repository.TransactionRepository;
import com.digilibz.repository.TransactionItemRepository;
import com.digilibz.repository.BookRepository;
import com.digilibz.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TransactionItemRepository transactionItemRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationsService notificationService;

     @Transactional
     public String createTransaction(TransactionRequest transactionRequest) {
         User user = userRepository.findById(transactionRequest.getUserId())
                 .orElseThrow(() -> new RuntimeException("User not found"));

         Transaction transaction = new Transaction();
         transaction.setUser(user);
         transaction.setTotalFee(transactionRequest.getTotalFee());
         transaction.setPaymentMethod(transactionRequest.getPaymentMethod());
         transaction.setPaymentEvidence(transactionRequest.getPaymentEvidence());
         transaction.setDateFrom(transactionRequest.getDateFrom());
         transaction.setDateTo(transactionRequest.getDateTo());
         transaction.setStatus(Transaction.TransactionStatus.PENDING);
         transaction.setType(Transaction.TransactionType.BORROW);

         String randomHex = generateRandomHex(3);
         String currentDate = getCurrentDate();
         String invoiceCode = "INV-" + currentDate + "-" + randomHex;

         transaction.setInvoiceCode(invoiceCode);

         Transaction savedTransaction = transactionRepository.save(transaction);

         String title = "Transaction Pending";
         String message = "Your transaction with invoice code " + invoiceCode + " is pending and will be reviewed by an admin until approved.";
         notificationService.addNotification(user, title, message, Notification.NotificationType.INFO);

         List<TransactionItem> transactionItems = transactionRequest.getItems().stream()
                 .map(itemRequest -> {
                     Book book = bookRepository.findById(itemRequest.getId())
                             .orElseThrow(() -> new RuntimeException("Book not found"));

                     TransactionItem transactionItem = new TransactionItem();
                     transactionItem.setTransaction(savedTransaction);
                     transactionItem.setBook(book);

                     return transactionItem;
                 }).toList();

         transactionItemRepository.saveAll(transactionItems);

         return savedTransaction.getInvoiceCode();
     }

     private String generateRandomHex(int length) {
         StringBuilder hexString = new StringBuilder();
         String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
         for (int i = 0; i < length; i++) {
             int randomIndex = (int) (Math.random() * characters.length());
             hexString.append(characters.charAt(randomIndex));
         }
         return hexString.toString();
     }

     private String getCurrentDate() {
         java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyyMMdd");
         return sdf.format(new java.util.Date());
     }

     @Transactional
     public Map<String, Object> getTransactionByInvoiceCode(String invoiceCode) {
         Transaction transaction = transactionRepository.findByInvoiceCode(invoiceCode)
                 .orElseThrow(() -> new RuntimeException("Transaction not found"));

         transaction.getUser().getName();
         transaction.getItems().size();

         return Map.of(
                 "id", transaction.getId(),
                 "invoiceCode", transaction.getInvoiceCode(),
                 "dateRange", Map.of(
                         "from", transaction.getDateFrom(),
                         "to", transaction.getDateTo()
                 ),
                 "status", transaction.getStatus(),
                 "type", transaction.getType(),
                 "user", Map.of(
                         "id", transaction.getUser().getId(),
                         "name", transaction.getUser().getName(),
                         "email", transaction.getUser().getEmail(),
                         "phone", transaction.getUser().getPhone(),
                         "role", transaction.getUser().getRole()
                 ),
                 "totalFee", transaction.getTotalFee(),
                 "paymentMethod", transaction.getPaymentMethod(),
                 "paymentEvidence", transaction.getPaymentEvidence(),
                 "items", transaction.getItems().stream()
                         .map(this::mapTransactionItemToResponse)
                         .collect(Collectors.toList())
         );
     }

     private Map<String, Object> mapTransactionItemToResponse(TransactionItem transactionItem) {
         return Map.of(
                 "id", transactionItem.getBook().getId(),
                 "title", transactionItem.getBook().getTitle(),
                 "author", transactionItem.getBook().getAuthor(),
                 "image", transactionItem.getBook().getImage(),
                 "lateFee", transactionItem.getBook().getLateFee()
         );
     }

     @Transactional
     public List<Map<String, Object>> getTransactionsWithFilter(String search, String status, String type, String userId) {
         List<Transaction> transactions = transactionRepository.findAll().stream()
                 .filter(transaction ->
                          (status == null || status.equalsIgnoreCase("all") || transaction.getStatus().toString().equalsIgnoreCase(status)) &&
                                 (type == null || type.equalsIgnoreCase("all") || transaction.getType().toString().equalsIgnoreCase(type)) &&
                                 (userId == null || transaction.getUser().getId().equals(userId)) &&
                                 (search == null ||
                                         transaction.getInvoiceCode().contains(search) ||
                                         transaction.getUser().getName().toLowerCase().contains(search.toLowerCase()))
                 )
                 .toList();

         return transactions.stream()
                 .map(this::mapTransactionToResponse)
                 .collect(Collectors.toList());
     }

     private Map<String, Object> mapTransactionToResponse(Transaction transaction) {
         return Map.of(
                 "id", transaction.getId(),
                 "invoiceCode", transaction.getInvoiceCode(),
                 "dateRange", Map.of(
                         "from", transaction.getDateFrom(),
                         "to", transaction.getDateTo()
                 ),
                 "status", transaction.getStatus(),
                 "type", transaction.getType(),
                 "user", Map.of(
                         "id", transaction.getUser().getId(),
                         "name", transaction.getUser().getName(),
                         "email", transaction.getUser().getEmail(),
                         "phone", transaction.getUser().getPhone(),
                         "role", transaction.getUser().getRole()
                 ),
                 "totalFee", transaction.getTotalFee(),
                 "paymentMethod", transaction.getPaymentMethod(),
                 "paymentEvidence", transaction.getPaymentEvidence(),
                 "items", transaction.getItems().stream()
                         .map(this::mapTransactionItemToResponse)
                         .collect(Collectors.toList())
         );
     }

    @Transactional
    public void updateTransactionStatus(String invoiceCode, String status, String typeIn) {
        Transaction transaction = transactionRepository.findByInvoiceCode(invoiceCode)
                .orElseThrow(() -> new IllegalArgumentException("Transaksi dengan kode invoice tidak ditemukan"));

        if (!List.of("approved", "declined", "pending", "overdue").contains(status.toLowerCase())) {
            throw new IllegalArgumentException("Status tidak valid. Gunakan 'approved', 'declined', 'pending', atau 'overdue'");
        }

        transaction.setStatus(Transaction.TransactionStatus.valueOf(status.toUpperCase()));

        if (typeIn != null && !typeIn.isEmpty()) {
            if (!List.of("borrow", "return").contains(typeIn.toLowerCase())) {
                throw new IllegalArgumentException("Tipe transaksi tidak valid. Gunakan 'borrow' atau 'return'");
            }
            transaction.setType(Transaction.TransactionType.valueOf(typeIn.toUpperCase()));
        }

        transactionRepository.save(transaction);

        User user = transaction.getUser();
        String currentType = transaction.getType().toString().toLowerCase();

        String title;
        String message;
        Notification.NotificationType notificationType;

        if ("borrow".equalsIgnoreCase(currentType)) {
            switch (status.toLowerCase()) {
                case "approved":
                    title = "Borrow Request Approved";
                    message = "Your borrow request with invoice code " + invoiceCode + " has been approved.";
                    notificationType = Notification.NotificationType.REMINDER;
                    break;
                case "declined":
                    title = "Borrow Request Declined";
                    message = "Your borrow request with invoice code " + invoiceCode + " has been declined. Please contact support for details.";
                    notificationType = Notification.NotificationType.ALERT;
                    break;
                case "overdue":
                    title = "Borrow Request Overdue";
                    message = "Your borrow request with invoice code " + invoiceCode + " is overdue. Please return the books immediately.";
                    notificationType = Notification.NotificationType.ALERT;
                    break;
                default:
                    title = "Borrow Request Pending";
                    message = "Your borrow request with invoice code " + invoiceCode + " is pending and will be reviewed by an admin.";
                    notificationType = Notification.NotificationType.INFO;
                    break;
            }
        } else {
            switch (status.toLowerCase()) {
                case "approved":
                    title = "Return Approved";
                    message = "Your return request with invoice code " + invoiceCode + " has been approved.";
                    notificationType = Notification.NotificationType.REMINDER;
                    break;
                case "declined":
                    title = "Return Declined";
                    message = "Return request with invoice code " + invoiceCode + " has been declined. Please contact support for details.";
                    notificationType = Notification.NotificationType.ALERT;
                    break;
                case "overdue":
                    title = "Return Overdue";
                    message = "Return request with invoice code " + invoiceCode + " is overdue. Please complete the return process immediately.";
                    notificationType = Notification.NotificationType.ALERT;
                    break;
                default:
                    title = "Return Pending";
                    message = "Return request with invoice code " + invoiceCode + " is pending and you should return it and approve it.";
                    notificationType = Notification.NotificationType.INFO;
                    break;
            }
        }
        notificationService.addNotification(user, title, message, notificationType);
    }
}