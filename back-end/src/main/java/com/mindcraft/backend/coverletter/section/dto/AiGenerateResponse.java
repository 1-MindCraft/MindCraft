package com.mindcraft.backend.coverletter.section.dto;

/**
 * FastAPI AI 서버로부터 받는 응답.
 * FastAPI CoverLetterGenerateResponse와 1:1 (answer만).
 */
public record AiGenerateResponse(
        String answer
) {
}