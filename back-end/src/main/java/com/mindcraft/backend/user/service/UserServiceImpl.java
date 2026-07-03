package com.mindcraft.backend.user.service;

import com.mindcraft.backend.global.exception.DuplicateEmailException;
import com.mindcraft.backend.user.entity.User;
import com.mindcraft.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User createUser(User user) {

        // TODO 이메일 중복 체크
        // TODO 저장
        return null;
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

    // 이메일 중복 체크
    private void verifyEmail(String email) {
        userRepository.ex
        if (user.isPresent()) {
            throw new DuplicateEmailException("이미 가입한 이메일입니다.");
        }
    }
}
