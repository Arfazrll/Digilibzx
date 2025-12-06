package com.digilibz.controller;

import com.digilibz.service.StatisticService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/statistic")
public class StatisticDashboardController {
    @Autowired
    private StatisticService statisticservice;

    @Operation(summary = "Ambil data statistik", description = "Mengambil data statistik dari database")
    @GetMapping()
    public ResponseEntity<?> getStatistics(
            @RequestParam(value = "max", required = false) Integer max
    ) {
        return ResponseEntity.ok().body(
                Map.of(
                        "message", "Data statistik berhasil diambil",
                        "data", Map.of(
                                "totalBook", statisticservice.getStatisticBook(),
                                "totalUser", statisticservice.getJumlahUserNow(),
                                "totalTransaction", statisticservice.getJumlahTransaksi(),
                                "totalNotifications", statisticservice.getJumlahNotifikasi(),
                                "averageReview", statisticservice.getAverageReview(),
                                "totalReview", statisticservice.getJumlahReview(),
                                "recentReviews", statisticservice.getRecentReview(max)
                        )
                )
        );
    }
}