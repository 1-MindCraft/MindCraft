package com.mindcraft.backend.user.dto;

import com.mindcraft.backend.user.entity.Provider;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class OAuth2UserInfo {
    private String email;
    private String name;
    private String providerId;

    public static OAuth2UserInfo of(Provider provider, Map<String, Object> attributes) {
        return switch (provider) {
            case GOOGLE -> ofGoogle(attributes);
            case KAKAO -> ofKakao(attributes);
            case NAVER -> ofNaver(attributes);
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

    @SuppressWarnings("unchecked")
    private static OAuth2UserInfo ofKakao(Map<String, Object> attributes) {
        Map<String, Object> profile =
                (Map<String, Object>) ((Map<String, Object>) attributes.get("kakao_account")).get("profile");
        log.info("OAuth2 attributes: {}", attributes); // 임시 로그
        log.info("properties: {} ",attributes.get("properties"));

        String kakaoId = String.valueOf(attributes.get("id"));
        // 카카오는 이메일을 비즈니스 앱에서만 받아올 수 있게 해놨음. 사업자 등록증 필요. 이건 데이터베이스에 저장할 가짜 이메일
        String pseudoEmail = "kakao_" + kakaoId + "@kakao.mindcraft";

        return new OAuth2UserInfo(
                pseudoEmail,
                (String) profile.get("nickname"),
                kakaoId
        );
    }

    @SuppressWarnings("unchecked")
    private static OAuth2UserInfo ofNaver(Map<String, Object> attributes) {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");

        return new OAuth2UserInfo(
                (String) response.get("email"),
                (String) response.get("name"),
                (String) response.get("id")
        );
    }

}
