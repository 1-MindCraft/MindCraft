package com.mindcraft.backend.global.security.handler;

import com.mindcraft.backend.user.dto.UserSecurityDto;
import com.mindcraft.backend.user.entity.User;
import com.mindcraft.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        UserSecurityDto userSecurityDto = new UserSecurityDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.isVerified()
        );


        return userSecurityDto;
    }
}
