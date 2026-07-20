package com.mindcraft.backend.user.service;

import com.mindcraft.backend.global.exception.*;
import com.mindcraft.backend.user.entity.EmailVerification;
import com.mindcraft.backend.user.entity.Provider;
import com.mindcraft.backend.user.entity.User;
import com.mindcraft.backend.user.repository.EmailVerificationRepository;
import com.mindcraft.backend.user.repository.UserRepository;
import com.mindcraft.backend.user.util.VerificationCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationRepository emailVerificationRepository;
    private final MailService mailService;

    @Override
    @Transactional
    public User createUser(User user) {

        // 이메일 중복 체크
            // isVerified = true : 회원가입이 완료되고 이미 존재하는 이메일
            // isVerified = false : 들어온 값으로 회원가입 다시 시도
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        User targetUser;
        if (existingUser.isPresent()) {
            User found = existingUser.get();

            // isVerified = true
            if(found.isVerified()) {
                throw new DuplicateEmailException("이미 존재하는 이메일입니다.");
            }

            // isVerified = false
            found.setPassword(passwordEncoder.encode(user.getPassword()));
            targetUser = userRepository.save(found);
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            targetUser = userRepository.save(user);
        }

        String code = VerificationCodeGenerator.generate();
        EmailVerification emailVerification = emailVerificationRepository.findByUserId(targetUser.getId())
                .map(ev -> {
                    ev.renew(code);
                    return ev;
                })
                .orElseGet(() -> new EmailVerification(targetUser, code));
        emailVerificationRepository.save(emailVerification);
        mailService.sendVerificationCode(targetUser.getEmail(), code);
        return targetUser;
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

    @Override
    @Transactional
    public void verifyEmail(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("일치하는 회원이 없습니다."));

        EmailVerification emailVerification = emailVerificationRepository.findByUserId(user.getId())
                .orElseThrow(() -> new InvalidVerificationCodeException("인증 요청 내역이 없습니다. 인증코드를 재발송해주세요."));

        if (emailVerification.isExpired()) {
            throw new VerificationCodeExpiredException("인증 코드가 만료되었습니다. 재발송해주세요.");
        }

        if (!emailVerification.getCode().equals(code)) {
            throw new InvalidVerificationCodeException("인증 코드가 일치하지 않습니다.");
        }

        user.setVerified(true);
        userRepository.save(user);
        emailVerificationRepository.delete(emailVerification);
    }

    @Override
    @Transactional
    public void resendVerificationCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("일치하는 회원이 없습니다."));

        if(user.isVerified()) {
            throw new DuplicateEmailException("이미 인증이 완료된 이메일입니다.");
        }

        String code = VerificationCodeGenerator.generate();
        EmailVerification emailVerification = emailVerificationRepository.findByUserId(user.getId())
                .map(ev -> {
                    ev.renew(code);
                    return ev;
                })
                .orElseGet(() -> new EmailVerification(user, code));
        emailVerificationRepository.save(emailVerification);

        mailService.sendVerificationCode(user.getEmail(), code);
    }
}
