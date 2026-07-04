package com.mindcraft.backend.user.service;

import com.mindcraft.backend.global.exception.DuplicateEmailException;
import com.mindcraft.backend.user.entity.Provider;
import com.mindcraft.backend.user.entity.User;
import com.mindcraft.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User createUser(User user) {

        // 이메일 중복 체크
        boolean exists = userRepository.existsByEmail(user.getEmail());
        if (exists) {
            throw new DuplicateEmailException("이미 존재하는 이메일입니다.");
        }

        // createdAt 설정, updatedAt 설정, password 암호화
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User createdUser = userRepository.save(user);
        return createdUser;
    }

    @Override
    public User getMyInfo(long userId) {
        return null;
    }

    @Override
    public User updateMyInfo(User user) {
        return null;
    }

    @Override
    public void deleteUser(long userId) {

    }

}
