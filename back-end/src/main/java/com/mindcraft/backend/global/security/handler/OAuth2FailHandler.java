package com.mindcraft.backend.global.security.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@RequiredArgsConstructor
public class OAuth2FailHandler implements AuthenticationFailureHandler {

    private final String frontendUrl;

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {

        String encodedMessage = URLEncoder.encode(exception.getMessage(), StandardCharsets.UTF_8);
        response.sendRedirect(frontendUrl + "?error=" + encodedMessage);

    }
}
