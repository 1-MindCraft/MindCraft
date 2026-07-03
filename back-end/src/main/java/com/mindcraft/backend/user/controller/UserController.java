package com.mindcraft.backend.user.controller;

import com.mindcraft.backend.user.dto.UserJoinDto;
import com.mindcraft.backend.user.entity.User;
import com.mindcraft.backend.user.mapper.UserMapper;
import com.mindcraft.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserMapper userMapper;
    private final UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity createUser(@RequestBody UserJoinDto userJoinDto) {
        User user = userMapper.userJoinDtoToUser(userJoinDto);
        User createdMember = userService.createUser(user);
        return new ResponseEntity<>(userMapper.userToUserResponseDto(createdMember), HttpStatus.CREATED);
    }
}
