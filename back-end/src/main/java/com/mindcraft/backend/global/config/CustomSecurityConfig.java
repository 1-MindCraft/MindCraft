package com.mindcraft.backend.global.config;

import com.mindcraft.backend.global.security.filter.JWTCheckFilter;
import com.mindcraft.backend.global.security.handler.CustomAccessDeniedHandler;
import com.mindcraft.backend.global.security.handler.LoginFailHandler;
import com.mindcraft.backend.global.security.handler.LoginSuccessHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Slf4j
@RequiredArgsConstructor
@EnableMethodSecurity
public class CustomSecurityConfig {

    // security filter chain - 인증/인가 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        log.info("--- # security config ---");

        // filter Chain

        // cors 설정 (아래에 만들어놓은거 가지고 적용)
        http.cors(httpSecurityCorsConfigurer -> {
            httpSecurityCorsConfigurer.configurationSource(
                    corsConfigurationSource()
            );
        });

        // 세션 설정 해제
        http.sessionManagement(sessionConfig -> {
            sessionConfig.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
            );
        });

        // csrf 설정 -> jwt 쓸거라 비활성화
        http.csrf(config -> config.disable());

        // 로그인 설정
        http.formLogin(form -> form
                .loginProcessingUrl("/auth/login")
                .usernameParameter("email")
                .passwordParameter("password")
                .successHandler(new LoginSuccessHandler())
                .failureHandler(new LoginFailHandler())
        );

        // 권한 부족(403) 처리 -> 지금 당장은 어드민 페이지가 없음
        http.exceptionHandling(config ->
                config.accessDeniedHandler(new CustomAccessDeniedHandler())
        );

        // JWT 등록 (필터들 진행 전에 JWT 검증 진행)
        http.addFilterBefore(
                new JWTCheckFilter(),
                UsernamePasswordAuthenticationFilter.class
        );

        // 만들어놓은 필터체인 리턴
        return http.build();
    }

    // CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        // CORS 설정 객체 생성
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
                Arrays.asList("*") // 모든 도메인 허용
        );

        // 허용할 Method
        configuration.setAllowedMethods(
                Arrays.asList(
                        "HEAD",
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE"
                )
        );

        // 허용할 요청 헤더
        configuration.setAllowedHeaders(
                Arrays.asList(
                        "Authorization",
                        "Cache-Control",
                        "Content-Type"
                )
        );

        // 쿠키 및 인증 정보 허용
        configuration.setAllowCredentials(true);

        // URL 패턴별 CORS 설정 등록 객체
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // 모든 url 객체에 대해 cors 적용
        source.registerCorsConfiguration(
                "/**",
                configuration
        );
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder () {

        Map<String, PasswordEncoder> encoders = new HashMap<>();

        encoders.put("bcrypt", new BCryptPasswordEncoder());
        encoders.put("scrypt", SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8());
        encoders.put("pbkdf2", Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8());

        return new DelegatingPasswordEncoder("bcrypt", encoders);
    }
}
