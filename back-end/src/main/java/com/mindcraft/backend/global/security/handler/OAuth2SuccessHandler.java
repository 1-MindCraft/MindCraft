package com.mindcraft.backend.global.security.handler;

import com.mindcraft.backend.global.util.JWTUtil;
import com.mindcraft.backend.user.dto.UserSecurityDto;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.util.Map;

public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    // TODO : application.properties로 빼기
    private static final String FRONTEND_URL = "http://localhost:5173/oauth2/callback";

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        UserSecurityDto userSecurityDto = (UserSecurityDto) authentication.getPrincipal();
        Map<String, Object> claims = userSecurityDto.getClaims();

        String accessToken = JWTUtil.generateToken(claims, 10);
        String refreshToken = JWTUtil.generateToken(claims, 24 * 60);

        String redirectUrl = FRONTEND_URL
                + "?accessToken=" + accessToken
                + "&refreshToken=" + refreshToken;

        response.sendRedirect(redirectUrl);
    }
}
