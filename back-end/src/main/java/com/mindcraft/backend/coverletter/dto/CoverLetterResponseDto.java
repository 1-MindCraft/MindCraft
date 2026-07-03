package com.mindcraft.backend.coverletter.dto;

import com.mindcraft.backend.coverletter.entity.CoverLetter;
import lombok.Getter;

@Getter
public class CoverLetterResponseDto {

    // 자기소개서 식별
    private Long id;

    // 자기소개서 제목
    private String title;

    // 엔티티를 받아서 dto로 변환하기
    public CoverLetterResponseDto(CoverLetter coverLetter) {
        this.id = coverLetter.getId();
        this.title = coverLetter.getTitle();
    }
}
