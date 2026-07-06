package com.mindcraft.backend.coverletter.dto;

import com.mindcraft.backend.coverletter.section.dto.CoverLetterSectionDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CoverLetterDto {

    private Long id;

    private Long userId;    // 마인드맵 편집화면에서 내보내기 버튼에서 전달됨
    private Long mindmapId; // 마인드맵 편집화면에서 내보내기 버튼에서 전달됨

    private String title;
    private String companyName;
    private String companyIdeal;
    private String jobDescription;

    // 상세조회 시에만 채워짐 ( coverletter_section 테이블에서 조회한 항목 목록 )
    private List<CoverLetterSectionDto> sections;
}
