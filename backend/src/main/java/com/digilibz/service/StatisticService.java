package com.digilibz.service;

import com.digilibz.repository.*;
import com.digilibz.dto.review.ReviewDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatisticService {

  private final ReviewRepository reviewrepository;
  private final UserRepository userRepository;
  private final BookRepository bookRepository;
  private final ReviewService reviewService;
  private final TransactionRepository transactionRepository;
  private final NotificationRepository notificationRepository;

  public StatisticService(
          ReviewRepository reviewrepository,
          UserRepository userRepository,
          BookRepository bookRepository,
          ReviewService reviewService,
          TransactionRepository transactionRepository,
          NotificationRepository notificationRepository
  ) {
    this.reviewrepository = reviewrepository;
    this.userRepository = userRepository;
    this.bookRepository = bookRepository;
    this.reviewService = reviewService;
    this.transactionRepository = transactionRepository;
    this.notificationRepository = notificationRepository;
  }

  public Long getJumlahUserNow() {
    return userRepository.count();
  }

  public long getStatisticBook() {
    return bookRepository.count();
  }

  public Long getJumlahReview() {
    return reviewrepository.count();
  }

  public Double getAverageReview() {
    Double averageRating = reviewrepository.findAverageRating();
    if (averageRating == null) {
      return 0.0;
    }
    return Math.round(averageRating * 100.0) / 100.0;
  }

  public List<ReviewDTO> getRecentReview(Integer max) {
    return reviewService.getReview(null, max);
  }

  public Long getJumlahTransaksi() {
    return transactionRepository.count();
  }

  public Long getJumlahNotifikasi() {
    return notificationRepository.count();
  }
}