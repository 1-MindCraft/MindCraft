package com.mindcraft.backend.user.service;

import com.mindcraft.backend.global.exception.DuplicateEmailException;
import com.mindcraft.backend.global.exception.InvalidPasswordException;
import com.mindcraft.backend.global.exception.UserNotFoundException;
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

        User createdUser = userRepository.save(user);
        return createdUser;
    }

    @Override
    public User getMyInfo(long userId) {
        User user = findUserById(userId);
        return user;
    }

    @Override
    public User updateMyInfo(User user, String currentPassword) {
        User findUser = findUserById(user.getId());

        if (findUser.getProvider() == Provider.LOCAL) {
            boolean isPasswordCorrect = passwordEncoder.matches(currentPassword, findUser.getPassword());
            if(!isPasswordCorrect) {
                throw new InvalidPasswordException("비밀번호가 일치하지 않습니다.");
            }
        }

        Optional.ofNullable(user.getName())
                .ifPresent(name -> findUser.setName(name));
        Optional.ofNullable(user.getPassword())
                .ifPresent(password -> findUser.setPassword(
                        passwordEncoder.encode(password)
                ));

        User updatedUser = userRepository.save(findUser);
        return updatedUser;
    }

    @Override
    public void deleteUser(long userId, String password) {
        User user = findUserById(userId);

        if (user.getProvider() == Provider.LOCAL) {
            boolean isPasswordCorrect = passwordEncoder.matches(password, user.getPassword());
            if(!isPasswordCorrect) {
                throw new InvalidPasswordException("비밀번호가 일치하지 않습니다.");
            }
        }

        userRepository.delete(user);
    }

    private User findUserById(long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        User user = optionalUser.orElseThrow(() -> new UserNotFoundException("일치하는 회원이 없습니다."));
        return user;
    }
}
