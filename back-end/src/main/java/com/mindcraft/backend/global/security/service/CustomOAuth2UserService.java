package com.mindcraft.backend.global.security.service;

import com.mindcraft.backend.global.exception.OAuth2EmailDuplicateException;
import com.mindcraft.backend.user.dto.OAuth2UserInfo;
import com.mindcraft.backend.user.dto.UserSecurityDto;
import com.mindcraft.backend.user.entity.Provider;
import com.mindcraft.backend.user.entity.User;
import com.mindcraft.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. 유저 정보(raw data) 가져오기
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // 2. registrationId 가져오기 (서드파티 id)
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        Provider provider = parseProvider(registrationId);

        // 3. providerId (user name attribute name) 가져오기
        OAuth2UserInfo userInfo = OAuth2UserInfo.of(provider, attributes);
        String email = userInfo.getEmail();
        String name = userInfo.getName();
        String providerId = userInfo.getProviderId();

        // ! 이미 데이터베이스에 있는 이메일인지 검증 -> 있으면 거부
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            // ! 다른 방식(email or other provider)으로 가입된 이메일인 경우
            if (!user.getProvider().equals(provider)) {
                throw new OAuth2EmailDuplicateException(email);
            }

            // 이미 같은 provider로 가입된 유저 -> 정상 로그인
            // 4. 유저 정보 dto 생성 -> 반환
            return new UserSecurityDto(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    null,
                    attributes);
        }
        // 4. 신규 유저 정보 dto 생성
        User newUser = User.builder()
                .email(email)
                .name(name)
                .password(null)
                .provider(provider)
                .providerId(providerId)
                .isVerified(true)
                .build();

        userRepository.save(newUser);

        // 6. 유저 정보 dto 생성 -> 반환
        return new UserSecurityDto(
                newUser.getId(),
                newUser.getName(),
                newUser.getEmail(),
                null,
                attributes);
    }

    private Provider parseProvider (String registrationId) {
        Provider parsedProvider = switch (registrationId.toUpperCase()) {
            case "GOOGLE" -> Provider.GOOGLE;
            case "KAKAO" -> Provider.KAKAO;
            case "NAVER" -> Provider.NAVER;
            default -> throw new IllegalArgumentException("지원하지 않는 provider: " + registrationId);
        };
        return parsedProvider;
    }
}
