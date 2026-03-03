package com.example.demo.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "security_logs", indexes = @Index(name = "idx_security_logs_username_created", columnList = "username, created_at"))
public class SecurityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, length = 20)
    private String action; // LOGIN, LOGOUT

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    public SecurityLog() {}

    public SecurityLog(String username, String action, String ipAddress, String userAgent) {
        this.username = username;
        this.action = action;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent != null && userAgent.length() > 512 ? userAgent.substring(0, 512) : userAgent;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getAction() { return action; }
    public String getIpAddress() { return ipAddress; }
    public String getUserAgent() { return userAgent; }
    public Instant getCreatedAt() { return createdAt; }
}
