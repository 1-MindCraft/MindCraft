package com.mindcraft.backend.user.dto;

import com.mindcraft.backend.user.entity.Provider;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Map;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2UserInfo {
    private String email;
    private String name;
    private String providerId;

    public static OAuth2UserInfo of(Provider provider, Map<String, Object> attributes) {
        return switch (provider) {
            case GOOGLE -> ofGoogle(attributes);
//            case KAKAO -> ofKakao(attributes);
            default -> throw new IllegalArgumentException("지원하지 않는 provider: " + provider);
        };
    }

    private static OAuth2UserInfo ofGoogle(Map<String, Object> attributes) {
        return new OAuth2UserInfo(
                (String) attributes.get("email"),
                (String) attributes.get("name"),
                (String) attributes.get("sub")
        );
    }
}
