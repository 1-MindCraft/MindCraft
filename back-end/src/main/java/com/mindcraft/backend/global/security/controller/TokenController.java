package com.mindcraft.backend.global.security.controller;

import com.mindcraft.backend.global.exception.CustomJWTException;
import com.mindcraft.backend.global.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Map;

// Access Token 만료 => Refresh Token을 가지고 Access Token을 재발급함
@RestController
@RequiredArgsConstructor
@Slf4j
public class TokenController implements TokenApiSpec{
    // 1. Access Token 만료 여부 확인
    // 2. Refresh Token 검증
    // 3. 새로운 Access Token 생성
    // 4. 필요하면(Refresh Token 유효시간 1h under) 새로운 Refresh Token 생성
    // 5. 클라이언트에게 반환

    @GetMapping("/users/refresh")
    @Override
    public Map<String, Object> refresh (
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("refreshToken") String refreshToken
    ) {

        // Refresh Token이 없는 경우
        if (refreshToken == null) {
            throw new CustomJWTException("NULL_REFRESH");
        }

        // Authorization 헤더가 없거나, Bearer 형식이 아닌 경우
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new CustomJWTException("INVALID_STRING");
        }

        // 실제 access token 추출
        String accessToken = authHeader.substring(7);

        // Access Token 만료 여부 확인
        if (checkExpiredToken(accessToken) == false) {
            // Access Token 만료 안됨
            return Map.of(
                    "accessToken", accessToken,
                    "refreshToken", refreshToken
            );
        }

        // Access Token 만료 됨
        // refresh token은 만료 되었는지 확인
        if (checkExpiredToken(refreshToken)) {
            // Access Token 만료, Refresh Token 만료
            throw new CustomJWTException("INVALID_REFRESH");
        }

        // Access Token 만료, Refresh Token 만료안됨
            // Access Token 발급
        Map<String, Object> claims = JWTUtil.validateToken(refreshToken);
        String newAccessToken = JWTUtil.generateToken(claims, 30);

        // Refresh Token 만료 1시간 미만 -> Refresh Token 재발급
        Long expDate = ((Number) claims.get("exp")).longValue();
        String newRefreshToken =
                checkTime(expDate) ?
                        JWTUtil.generateToken(claims, 60 * 24)
                        : refreshToken;

        return Map.of(
                "accessToken", newAccessToken,
                "refreshToken", newRefreshToken
        );
    }

    private boolean checkTime(Long exp) {
        Date expDate = new Date(exp * 1000);

        // 남은 시간 계산 = 만료 시간 - 현재 시간
        long gap = expDate.getTime() - System.currentTimeMillis();

        // 분 단위로 변환
        long leftMin = gap / (1000 * 60);

        // 남은 시간 60분 (1시간) 미만이면 true
        return leftMin < 60;
    }

    private boolean checkExpiredToken(String token) {
        try {
            JWTUtil.validateToken(token);
        } catch (CustomJWTException exception) {
            // 만료된 경우 catch
            if (exception.getMessage().equals("Expired")) {
                return true;
            }
            throw exception;
        }
        return false; // 만료 안됨
    }
}
