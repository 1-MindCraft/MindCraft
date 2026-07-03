package com.mindcraft.backend.coverletter.service;

import com.mindcraft.backend.coverletter.dto.CoverLetterRequestDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterResponseDto;
import com.mindcraft.backend.coverletter.entity.CoverLetter;
import com.mindcraft.backend.coverletter.repository.CoverLetterRepository;
import com.mindcraft.backend.user.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mindcraft.backend.user.entity.Member;

    // 자기소개서 로직 관련 처리 서비스

    @Service
    @RequiredArgsConstructor
    @Transactional(readOnly = true)
    public class CoverLetterService {

        // final을 사용한 이유 : 객체의 불변성 보장과 의존성 주입 방식의 권장 사항
        private final CoverLetterRepository coverLetterRepository;
        private final MemberRepository memberRepository;

        // 새로운 자기소개서 생성하기
        @Transactional
        public CoverLetterResponseDto createCoverLetter(CoverLetterRequestDto requestDto) {

            // 회원 조회 ( 존재하지 않을 경우에는 예외 처리 )
            Member member = memberRepository.findById(requestDto.getMemberId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 회원을 찾을 수 없습니다."));

            // 자기소개서 Entity 생성
            CoverLetter coverLetter = new CoverLetter(member, requestDto.getTitle());

            // 데이터베이스에 저장
            CoverLetter savedCoverLetter = coverLetterRepository.save(coverLetter);

            return new CoverLetterResponseDto(savedCoverLetter);
        }
    }
}
