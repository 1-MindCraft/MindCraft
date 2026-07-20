package com.mindcraft.backend.user.util;

import java.security.SecureRandom;

public class VerificationCodeGenerator {

    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generate() {
        int code = RANDOM.nextInt(1_000_000);
        return String.format("%06d", code);
    }
}
