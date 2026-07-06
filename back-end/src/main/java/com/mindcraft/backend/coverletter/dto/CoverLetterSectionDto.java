package com.mindcraft.backend.coverletter.dto;

import lombok.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CoverLetterSectionDto {

    private Long id;
    private Long coverLetterId;

    private String question;            // 질문
    private String answer;              // 질문에 대한 답변
    private String sourceNode;
    private String writingStyle;        // 문제 선택
    private Integer maxChars;           // 글자 수
    private Boolean allowCreativity;    // AI 창의적 제작 허용
}
