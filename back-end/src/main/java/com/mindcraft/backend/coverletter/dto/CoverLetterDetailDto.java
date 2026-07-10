package com.mindcraft.backend.coverletter.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mindcraft.backend.coverletter.section.dto.CoverLetterSectionDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterDetailDto {
    private long id;

    @JsonProperty("mindmap_id")
    private long mindMapId;

    private String title;

    @JsonProperty("company_name")
    private String companyName;

    @JsonProperty("company_ideal")
    private String companyIdeal;

    @JsonProperty("job_description")
    private String jobDescription;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    private List<CoverLetterSectionDto> sections;
}
