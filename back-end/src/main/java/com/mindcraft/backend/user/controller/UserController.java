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
public class UserController implements UserApiSpec{

    private final UserMapper userMapper;
    private final UserService userService;

    @PostMapping("/auth/register")
    @Override
    public ResponseEntity createUser(@RequestBody @Valid UserJoinDto userJoinDto) {
        User user = userMapper.userJoinDtoToUser(userJoinDto);
        User createdMember = userService.createUser(user);
        return new ResponseEntity<>(
                userMapper.userToUserResponseDto(createdMember),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/users/me")
    @Override
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
    @Override
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
    @Override
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
}
