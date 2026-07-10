package com.mindcraft.backend.coverletter.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    private Long userId;    // 엔티티의 user (외래키)를 오갈 때 쓰이는 Long 값

    private Long mindmapId; // 마인드맵 편집화면에서 내보내기 버튼에서 전달됨

    private String title;

    @JsonProperty("company_name") // API의 Request_Body 참고
    private String companyName;

    @JsonProperty("company_ideal") // API의 Request_Body 참고
    private String companyIdeal;

    @JsonProperty("job_description") // API의 Request_Body 참고
    private String jobDescription;

    // 상세조회 시에만 채워짐 ( coverletter_section 테이블에서 조회한 항목 목록 )
    private List<CoverLetterSectionDto> sections;
}