package com.mindcraft.backend.global.security.controller;

import com.mindcraft.backend.global.exception.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Tag(name = "Token", description = "Access Token 재발급 관련 API")
public interface TokenApiSpec {

    @Operation(
            summary = "Access Token 재발급",
            description = "만료된 Access Token을 Refresh Token으로 검증하여 새로운 Access Token을 재발급한다. "
                    + "Refresh Token의 남은 유효기간이 1시간 미만이면 Refresh Token도 함께 재발급한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "재발급 성공 (혹은 기존 Access Token이 아직 유효한 경우 그대로 반환)",
                    content = @Content(schema = @Schema(
                            example = "{\"accessToken\": \"(JWT 문자열)\", \"refreshToken\": \"(JWT 문자열)\"}"
                    ))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Refresh Token 없음, Authorization 헤더 형식 오류(Bearer 형식 아님), 또는 Refresh Token까지 만료됨",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    Map<String, Object> refresh (
            @Parameter(description = "Access Token, 'Bearer {token}' 형식", required = true)
            @RequestHeader("Authorization") String authHeader,
            @Parameter(description = "Refresh Token", required = true)
            @RequestParam("refreshToken") String refreshToken
    );
}
