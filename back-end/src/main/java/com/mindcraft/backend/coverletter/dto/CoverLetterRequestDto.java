package com.mindcraft.backend.coverletter.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("mindmap_id")
    private Long mindMapId;

    private String title;

    @NotBlank(message = "companyName은 필수입니다.")
    @JsonProperty("company_name")
    private String companyName;

    @NotBlank(message = "companyIdeal은 필수입니다.")
    @JsonProperty("company_ideal")
    private String companyIdeal;

    @NotBlank(message = "jobDescription은 필수입니다.")
    @JsonProperty("job_description")
    private String jobDescription;
}
