package com.mindcraft.backend.coverletter.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterRequestDto {
    private Long mindMapId;
    private String title;
    private String companyName;
    private String companyIdeal;
    private String jobDescription;
}
