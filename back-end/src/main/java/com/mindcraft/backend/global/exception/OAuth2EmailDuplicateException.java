package com.mindcraft.backend.global.exception;

import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;

public class OAuth2EmailDuplicateException extends OAuth2AuthenticationException {
    public OAuth2EmailDuplicateException(String email) {
        super(new OAuth2Error("EMAIL_ALREADY_EXISTS"), "이미 가입된 이메일입니다. : " + email);
    }
}
