package com.mindcraft.backend.global.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "MindCraft API",
                version = "v1",
                description = "마인드 맵 기반 자기소개서 작성 서비스 API 문서"
        )
)
public class OpenApiConfig {
}
