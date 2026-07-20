package com.mindcraft.backend.global.security.filter;

import com.google.gson.Gson;
import com.mindcraft.backend.global.util.JWTUtil;
import com.mindcraft.backend.user.dto.UserSecurityDto;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

// 클라이언트 요청 올때마다 JWT 검사
@Slf4j
public class JWTCheckFilter extends OncePerRequestFilter {

    // 검사 필요없는 api는 jwt 검사 생략
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

        // Preflight 요청은 체크하지 않음
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        String path = request.getRequestURI();

        if (path.startsWith("/auth/register")) {
            return true;
        }

        if (path.startsWith("/auth/login")) {
            return true;
        }

        if (path.startsWith("/users/email-check")) {
            return true;
        }
        if (path.startsWith("/users/refresh")) {
            return true;
        }
        if (path.startsWith("/swagger-ui")) {
            return true;
        }
        if (path.startsWith("/v3/api-docs")) {
            return true;
        }
        if (path.startsWith("/oauth2")) {
            return true;
        }
        if (path.startsWith("/login/oauth2")) {
            return true;
        }
        if (path.startsWith("/health")) {
            return true;
        }
        if (path.startsWith("/auth/verify-email")) {
            return true;
        }
        if (path.startsWith("/auth/resend-code")) {
            return true;
        }

        return false;
    }

    // 요청마다 doFilterInternal을 자동으로 호출함
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String authHeaderString = request.getHeader("Authorization");

        try {
            // Bearer accessToken
            String accessToken = authHeaderString.substring(7);

            Map<String, Object> claims = JWTUtil.validateToken(accessToken);
            Long id = ((Number) claims.get("id")).longValue();
            String name = (String) claims.get("name");
            String email = (String) claims.get("email");

            UserSecurityDto userSecurityDto = new UserSecurityDto(id, name, email, null);

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    userSecurityDto,
                    null,
                    userSecurityDto.getAuthorities()
            );

            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("********** JWT Check Error....");
            log.error(e.getMessage());

            Gson gson = new Gson();
            String json = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));
            response.setContentType("application/json;charset=UTF-8");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            PrintWriter writer = response.getWriter();
            writer.println(json);
            writer.close();
        }
    }
}
