package com.mindcraft.backend.user.service;

import com.mindcraft.backend.user.entity.User;

public interface UserService {

    // 회원가입
    public User createUser(User User);

    // 내 정보 조회
    public User getMyInfo(long userId);

    // 정보 수정
    public User updateMyInfo(User User, String currentPassword);

    // 회원 탈퇴
    public void deleteUser(long userId, String password);

    // 이메일 인증
    public void verifyEmail(String email, String code);
}
