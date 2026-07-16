package com.mindcraft.backend.mindmap.controller;

import com.mindcraft.backend.mindmap.dto.AiKeywordResponse;
import com.mindcraft.backend.mindmap.dto.KeywordExtractRequestDto;
import com.mindcraft.backend.mindmap.dto.MindMapResponseDto;
import com.mindcraft.backend.mindmap.dto.MindMapSaveDto;
import com.mindcraft.backend.user.dto.UserSecurityDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "MindMap", description = "마인드맵 관련 API")
public interface MindMapApiSpec {

    @Operation(
            summary = "마인드맵 조회 및 생성",
            description = ""
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(schema = @Schema(implementation = MindMapResponseDto.class))
            ),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 요청(토큰 없음/만료)"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
    })
    ResponseEntity getMindMap(UserSecurityDto userSecurityDto);

    ResponseEntity<AiKeywordResponse> extractKeywords(
            @RequestBody KeywordExtractRequestDto dto
    );

    ResponseEntity saveMindMap(
            UserSecurityDto userSecurityDto,
            @RequestBody MindMapSaveDto mindMapSaveDto
    );
}
