package com.mindcraft.backend.global.exception;

public class CustomJWTException extends RuntimeException {
    public CustomJWTException(String message) {
        super(message);
    }
}
