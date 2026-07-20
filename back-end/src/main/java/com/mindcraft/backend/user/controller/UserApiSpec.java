package com.mindcraft.backend.user.controller;

import com.mindcraft.backend.global.exception.ErrorResponse;
import com.mindcraft.backend.user.dto.UserJoinDto;
import com.mindcraft.backend.user.dto.UserResponseDto;
import com.mindcraft.backend.user.dto.UserSecurityDto;
import com.mindcraft.backend.user.dto.UserUpdateDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@Tag(name = "User", description = "회원 정보 관련 API")
public interface UserApiSpec {

    @Operation(
            summary = "내 정보 조회",
            description = "로그인한 사용자 본인의 정보를 조회한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ResponseEntity getMyInfo(@Parameter(hidden = true) UserSecurityDto userSecurityDto);


    @Operation(
            summary = "회원 가입",
            description = "이메일과 비밀번호로 회원가입한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "가입 성공",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "이미 가입된 이메일",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ResponseEntity createUser(@RequestBody @Valid UserJoinDto userJoinDto);


    @Operation(
            summary = "내 정보 수정",
            description = "로그인한 사용자 본인의 정보(이름이나 비밀번호)를 수정한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "수정 성공",
                    content = @Content(schema = @Schema(implementation = UserResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료) 또는 현재 비밀번호가 일치하지 않음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ResponseEntity updateMyInfo(
            UserSecurityDto userSecurityDto,
            @RequestBody UserUpdateDto userUpdateDto);


    @Operation(
            summary = "회원 탈퇴",
            description = "로그인한 사용자 본인이 회원 탈퇴한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "탈퇴 성공"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료) 또는 비밀번호가 일치하지 않음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ResponseEntity deleteUser(
            UserSecurityDto userSecurityDto,
            @RequestBody Map<String, String> body);
}
