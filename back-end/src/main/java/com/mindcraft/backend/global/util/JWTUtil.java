package com.mindcraft.backend.global.util;


import com.mindcraft.backend.global.exception.CustomJWTException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

@Component
public class JWTUtil {
    // JWT 서명에 사용할 비밀키

    private static String key;

    @Value("${jwt.secret}")
    public void setKey(String secretKey) {
        JWTUtil.key = secretKey;
    }

    // JWT 생성
    public static String generateToken(Map<String, Object> dataMap, int min) {
        SecretKey  key = null;

        try {
            key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }

        String jwtStr = Jwts.builder()
                .header()
                .type("JWT")
                .and()
                .claims(dataMap)
                .issuedAt(Date.from(ZonedDateTime.now().toInstant()))
                .expiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant()))
                .signWith(key)
                .compact();

        return jwtStr;
    }

    // JWT 검증
    // 유효한가? -> claim의 유저 데이터 뺌
    public static Map<String, Object> validateToken(String token) {

        Map<String, Object> claims = null;

        try {
            // 문자열 비밀키를 SecretKey 객체로 변환
            SecretKey key = Keys.hmacShaKeyFor(JWTUtil.key.getBytes("UTF-8"));

            // 서명 검증
            // 토큰 형식 검증
            // 만료 여부 검증 -> 검증들이 되지 않는다면 error -> catch
            // PayLoad 추출

            claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

        } catch (MalformedJwtException malformedJwtException) {
            throw new CustomJWTException("MalFormed");
        } catch (ExpiredJwtException expiredJwtException) {
            throw new CustomJWTException("Expired");
        } catch (InvalidClaimException invalidClaimException) {
            throw new CustomJWTException("Invalid");
        } catch (JwtException jwtException) {
            throw new CustomJWTException("JWTError");
        } catch (Exception e) {
            throw new CustomJWTException("Error");
        }

        return claims;
    }
}
