package com.mindcraft.backend.coverletter.section.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * Spring → FastAPI 요청.
 * FastAPI CoverLetterGenerateRequest와 1:1.
 * JSON은 snake_case(FastAPI 규약), 자바 필드는 camelCase -> @JsonProperty로 매핑.
 */
public record AiGenerateRequest(

        @JsonProperty("company_name")
        String companyName,

        @JsonProperty("company_ideal")
        String companyIdeal,

        @JsonProperty("job_description")
        String jobDescription,

        String question,

        @JsonProperty("writing_style")
        String writingStyle,

        @JsonProperty("max_chars")
        int maxChars,

        @JsonProperty("allow_creativity")
        boolean allowCreativity,

        @JsonProperty("source_node")
        List<AiNodeDto> sourceNode
) {
}