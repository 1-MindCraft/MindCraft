package com.mindcraft.backend.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@ToString
public class UserSecurityDto extends User implements OAuth2User {
    private Long id;
    private String name;
    private String email;
    private String password;

    // OAuth2User가 요구하는 attribure(raw 데이터 by google) 원본
    private Map<String, Object> attributes;

    // 이메일 로그인 생성자
    public UserSecurityDto(Long id, String name, String email, String password) {
        // 추후 role 업데이트시 변경필요
        super(email, password, List.of());

        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // 소셜 로그인 생성자
    public UserSecurityDto(Long id, String name, String email, String password,
                           Map<String, Object> attributes) {
        // 추후 role 업데이트시 변경필요
        this(id, name, email, password);
        this.attributes = attributes;
    }

    // JWT에 담을 정보 추출
    @JsonIgnore
    public Map<String, Object> getClaims() {
        Map<String, Object> dataMap = new HashMap<>();
        dataMap.put("id", id);
        dataMap.put("name", name);
        dataMap.put("email", email);
        return dataMap;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    // OAuth2User의 식별자 역할
    @Override
    public String getName() {
        return email;
    }
}
