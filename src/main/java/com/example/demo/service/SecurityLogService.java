package com.example.demo.service;

import com.example.demo.model.SecurityLog;
import com.example.demo.repository.SecurityLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SecurityLogService {

    private static final int RECENT_LOGS_SIZE = 10;

    private final SecurityLogRepository securityLogRepository;

    public SecurityLogService(SecurityLogRepository securityLogRepository) {
        this.securityLogRepository = securityLogRepository;
    }

    public void logLogin(String username, String ipAddress, String userAgent) {
        securityLogRepository.save(new SecurityLog(username, "LOGIN", ipAddress, userAgent));
    }

    public void logLogout(String username, String ipAddress, String userAgent) {
        securityLogRepository.save(new SecurityLog(username, "LOGOUT", ipAddress, userAgent));
    }

    public List<SecurityLog> findRecentLogsByUsername(String username) {
        return securityLogRepository.findByUsernameOrderByCreatedAtDesc(username, PageRequest.of(0, RECENT_LOGS_SIZE));
    }

    /** Last login (excluding current session) for summary; if none, empty. */
    public Optional<SecurityLog> findLastLoginBefore(String username, long excludeAfterEpochMillis) {
        List<SecurityLog> logs = securityLogRepository.findByUsernameOrderByCreatedAtDesc(username, PageRequest.of(0, 20));
        return logs.stream()
                .filter(l -> "LOGIN".equals(l.getAction()) && l.getCreatedAt().toEpochMilli() < excludeAfterEpochMillis)
                .findFirst();
    }

    public Map<String, Object> getSummary(String username) {
        List<SecurityLog> recent = findRecentLogsByUsername(username);
        Optional<SecurityLog> lastLogin = recent.stream()
                .filter(l -> "LOGIN".equals(l.getAction()))
                .skip(1)
                .findFirst();
        return Map.of(
                "lastLoginAt", lastLogin.map(l -> l.getCreatedAt().toString()).orElse(null),
                "lastLoginIp", lastLogin.map(SecurityLog::getIpAddress).orElse(null),
                "twoFactorEnabled", false
        );
    }
}
