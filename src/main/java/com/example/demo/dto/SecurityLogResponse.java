package com.example.demo.dto;

import com.example.demo.model.SecurityLog;

import java.time.Instant;

public record SecurityLogResponse(String action, String ipAddress, String userAgent, Instant createdAt) {

    public static SecurityLogResponse from(SecurityLog log) {
        return new SecurityLogResponse(
                log.getAction(),
                log.getIpAddress(),
                log.getUserAgent(),
                log.getCreatedAt()
        );
    }
}
