package com.mindcraft.backend.headlthCheck;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;

@Tag(name = "Health", description = "EC2 헬스체크용")
public interface HealthCheckApiSpec {
    @Operation(
            summary = "EC2 대상 그룹 헬스 체크 목적",
            description = "애플리케이션 헬스 체크"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Healthy"
            )
    })
    ResponseEntity healthCheck();
}
