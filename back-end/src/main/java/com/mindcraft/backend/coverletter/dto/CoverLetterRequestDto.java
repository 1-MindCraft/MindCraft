package com.mindcraft.backend.coverletter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CoverLetterRequestDto {
    @NotNull(message = "MindMapId는 필수입니다.")
    private Long mindMapId;

    private String title;

    @NotBlank(message = "companyName은 필수입니다.")
    private String companyName;

    @NotBlank(message = "companyIdeal은 필수입니다.")
    private String companyIdeal;

    @NotBlank(message = "jobDescription은 필수입니다.")
    private String jobDescription;
}
