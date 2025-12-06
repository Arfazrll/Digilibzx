package com.digilibz.repository;

import com.digilibz.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByUserId(String userId);
}