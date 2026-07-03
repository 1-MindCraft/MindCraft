package com.mindcraft.backend.coverletter.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mindcraft.backend.user.entity.Member;

public interface CoverLetterRepository extends JpaRepository<Member, Long> {

    // 회원 식별자로 자기소개서 목록 조회
}
