package com.mindcraft.backend.global.security.handler;

import com.google.gson.Gson;
import com.mindcraft.backend.global.util.JWTUtil;
import com.mindcraft.backend.user.dto.UserSecurityDto;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Slf4j
public class LoginSuccessHandler implements AuthenticationSuccessHandler {
    // 로그인 성공시 여기로 옴
    // request : 요청 객체
    // response : 응답 객체
    // authentication : 인증 완료된 사용자 정보
    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        log.info("-- ** login success handler ** --");

        // 인증 객체에서 로그인한 사용자 정보 가져옴
        UserSecurityDto userSecurityDto = (UserSecurityDto) authentication.getPrincipal();

        // JWT 에 저장할 사용자 정보(Map 형태) 가져옴
        Map<String, Object> claims = userSecurityDto.getClaims();

        // Access Token 생성
        String accessToken = JWTUtil.generateToken(claims, 10);

        // Refresh Token 생성
        String refreshToken = JWTUtil.generateToken(claims, 24 * 60);

        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);

        // Map 객체 -> Json 객체 변환
        Gson gson = new Gson();
        String json = gson.toJson(claims);

        // 응답
        response.setContentType("application/json;charset=UTF-8");
        PrintWriter writer = response.getWriter();
        writer.println(json);
        writer.close();
    }
}
