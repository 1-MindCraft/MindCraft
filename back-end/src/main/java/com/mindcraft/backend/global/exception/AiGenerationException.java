package com.mindcraft.backend.global.exception;

/**
 * FastAPI AI 서버 호출/생성 실패 시 던지는 예외.
 * (연결 실패, 422, 타임아웃 등)
 */
public class AiGenerationException extends RuntimeException {

    public AiGenerationException(String message) {
        super(message);
    }

    public AiGenerationException(String message, Throwable cause) {
        super(message, cause);
    }
}