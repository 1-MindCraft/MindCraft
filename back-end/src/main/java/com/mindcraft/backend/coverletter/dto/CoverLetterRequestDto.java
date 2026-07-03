package com.mindcraft.backend.coverletter.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter                     // 모든 필드의 Getter 메서드를 자동으로 생성합니다.
@NoArgsConstructor          // 매개변수가 없는 기본 생성자를 자동으로 생성합니다.

// 자기소개서 생성해주는 요청 DTO

public class CoverLetterRequestDto {

    // 자기소개서 제목
    private String title;

    // 작성자 회원 식별자
    private Long memberId;

    // 데이터 초기화를 위한 생성자
    public CoverLetterRequestDto(String title, Long memberId) {
        this.title = title;
        this.memberId = memberId;
    }
}
