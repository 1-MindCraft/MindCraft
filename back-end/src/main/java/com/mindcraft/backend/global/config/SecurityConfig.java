package com.mindcraft.backend.global.config;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // csrf : 세션 기반 로그인이 아니라 REST API라서 끔
                .csrf(csrf -> csrf.disable())

                // V1 개발 단계라 일단 허용, 로그인 / JWT 붙이면 이 부분은 다시 좁혀야 함
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );
        
        return http.build();
    }
}
