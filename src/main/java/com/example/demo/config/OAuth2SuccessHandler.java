package com.example.demo.config;

import com.example.demo.service.SecurityLogService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final String frontendUrl;
    private final SecurityLogService securityLogService;

    public OAuth2SuccessHandler(@Value("${app.frontend.url:http://localhost:3000}") String frontendUrl,
                                 SecurityLogService securityLogService) {
        this.frontendUrl = frontendUrl;
        this.securityLogService = securityLogService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                         Authentication authentication) throws IOException {
        if (authentication.getPrincipal() instanceof OAuth2User oauth2User) {
            String name = oauth2User.getAttribute("email") != null
                    ? oauth2User.getAttribute("email")
                    : oauth2User.getName();
            if (name != null) {
                String ip = clientIp(request);
                securityLogService.logLogin(name, ip, request.getHeader("User-Agent"));
            }
        }
        response.sendRedirect(frontendUrl);
    }

    private static String clientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
