package com.mindcraft.backend.user.controller;

import com.mindcraft.backend.user.dto.UserJoinDto;
import com.mindcraft.backend.user.dto.UserSecurityDto;
import com.mindcraft.backend.user.dto.UserUpdateDto;
import com.mindcraft.backend.user.entity.User;
import com.mindcraft.backend.user.mapper.UserMapper;
import com.mindcraft.backend.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserMapper userMapper;
    private final UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity createUser(@RequestBody @Valid UserJoinDto userJoinDto) {
        User user = userMapper.userJoinDtoToUser(userJoinDto);
        User createdMember = userService.createUser(user);
        return new ResponseEntity<>(
                userMapper.userToUserResponseDto(createdMember),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/users/me")
    public ResponseEntity getMyInfo(
            @AuthenticationPrincipal UserSecurityDto userSecurityDto) {
        long userId = userSecurityDto.getId();
        User myInfo = userService.getMyInfo(userId);
        return new ResponseEntity<>(
                userMapper.userToUserResponseDto(myInfo),
                HttpStatus.OK
        );
    }

    @PatchMapping("/users/me")
    public ResponseEntity updateMyInfo(
            @AuthenticationPrincipal UserSecurityDto userSecurityDto,
            @RequestBody UserUpdateDto userUpdateDto) {
        long userId = userSecurityDto.getId();
        userUpdateDto.setId(userId);
        String currentPassword = userUpdateDto.getCurrentPassword();

        User user = userMapper.userUpdateDtoToUser(userUpdateDto);
        User updatedUser = userService.updateMyInfo(user, currentPassword);
        return new ResponseEntity<>(
                userMapper.userToUserResponseDto(updatedUser),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/users/me")
    public ResponseEntity deleteUser(
            @AuthenticationPrincipal UserSecurityDto userSecurityDto,
            @RequestBody Map<String, String> body) {
        long userId = userSecurityDto.getId();
        String password = body.get("password");

        userService.deleteUser(userId, password);
        return new ResponseEntity<>(
                Map.of("message", "탈퇴가 정상 처리 되었습니다."),
                HttpStatus.OK
        );
    }

    @PostMapping("/auth/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String code = body.get("code");

        userService.verifyEmail(email, code);
        return new ResponseEntity<>(
                Map.of("message", "이메일 인증이 완료되었습니다."),
                HttpStatus.OK
        );
    }

    @PostMapping("/auth/resend-code")
    public ResponseEntity<Map<String, String>> resendVerificationCode(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        userService.resendVerificationCode(email);
        return new ResponseEntity<>(
                Map.of("message", "인증 코드가 재발송 되었습니다."),
                HttpStatus.OK
        );
    }
}
