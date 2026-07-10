package com.mindcraft.backend.coverletter.dto;

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
    private long mindMapId;
    private String title;
    private String companyName;
    private String companyIdeal;
    private String jobDescription;
    private LocalDateTime updatedAt;
    private List<CoverLetterSectionDto> sections;
}
