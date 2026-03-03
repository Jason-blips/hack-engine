package com.example.demo.controller;

import com.example.demo.dto.SecurityLogResponse;
import com.example.demo.service.SecurityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/security")
public class SecurityRestController {

    private final SecurityLogService securityLogService;

    public SecurityRestController(SecurityLogService securityLogService) {
        this.securityLogService = securityLogService;
    }

    @GetMapping("/logs")
    public ResponseEntity<List<SecurityLogResponse>> logs(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        List<SecurityLogResponse> list = securityLogService.findRecentLogsByUsername(principal.getName())
                .stream()
                .map(SecurityLogResponse::from)
                .toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(securityLogService.getSummary(principal.getName()));
    }
}
