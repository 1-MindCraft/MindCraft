package com.mindcraft.backend.user.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.userdetails.User;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@ToString
public class UserSecurityDto extends User {
    private Long id;
    private String name;
    private String email;
    private String password;

    public UserSecurityDto(Long id, String name, String email, String password) {
        // 추후 role 업데이트시 변경필요
        super(email, password, List.of());

        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
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

}
