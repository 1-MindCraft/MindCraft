package com.mindcraft.backend.coverletter.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterSummaryDto {
    private long id;
    private long mindMapId;
    private String title;
    private String companyName;
    private String companyIdeal;
    private String jobDescription;
    private LocalDateTime updatedAt;
}
