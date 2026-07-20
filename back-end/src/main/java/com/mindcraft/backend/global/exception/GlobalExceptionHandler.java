package com.mindcraft.backend.global.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomJWTException.class)
    public ResponseEntity<Map<String, String>> handleJWTException(CustomJWTException e) {
        log.error("JWT Exception : {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateEmail(DuplicateEmailException e) {
        log.error("Duplicate Email Exception: {} ", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException e) {
        log.error("User Not Found : {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<Map<String, String>> handleInvalidPassword(InvalidPasswordException e) {
        log.error("Invalid Password : {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(InvalidMindMapException.class)
    public ResponseEntity<Map<String, String>> handleInvalidMindMap(InvalidMindMapException e) {
        log.error("Invalid MindMap : {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(CoverLetterNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleCoverLetterNotFound(CoverLetterNotFoundException e) {
        log.error("CoverLetter Not Found : {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(CoverLetterSectionNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleCoverLetterSectionNotFound(CoverLetterSectionNotFoundException e) {
        log.error("CoverLetter Section Not Found : {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(InvalidCoverLetterSectionException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCoverLetterSection(InvalidCoverLetterSectionException e) {
        log.error("Invalid CoverLetter Section : {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(AiGenerationException.class)
    public ResponseEntity<Map<String, String>> handleAiGeneration(AiGenerationException e) {
        log.error("AI Generation Exception : {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(InvalidCoverLetterException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCoverLetter(InvalidCoverLetterException e) {
        log.error("Invalid CoverLetter : {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException e) {
        log.error("Access Denied : {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(MailSendException.class)
    public ResponseEntity<Map<String, String>> handleMailSendException(MailSendException e) {
        log.error("Mail Send Exception : {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
    }
    @ExceptionHandler(InvalidVerificationCodeException.class)
    public ResponseEntity<Map<String, String>> handleInvalidVerificationCode(InvalidVerificationCodeException e) {
        log.error("Invalid Verification Code : {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(VerificationCodeExpiredException.class)
    public ResponseEntity<Map<String, String>> handleVerificationCodeExpired(VerificationCodeExpiredException e) {
        log.error("Verification Code Expired : {}", e.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
    }
}
