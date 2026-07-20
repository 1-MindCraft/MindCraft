package com.mindcraft.backend.mindmap.controller;

import com.mindcraft.backend.global.exception.ErrorResponse;
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
            description = "로그인한 사용자의 마인드맵을 조회한다. 없는 경우 루트 노드를 생성해서 반환한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회(혹은 생성) 성공",
                    content = @Content(schema = @Schema(implementation = MindMapResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ResponseEntity getMindMap(UserSecurityDto userSecurityDto);


    @Operation(
            summary = "마인드 노드의 키워드 추출",
            description = "작성중인 마인드맵 노드에서 AI가 판단한 키워드를 추출한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "추출 성공",
                    content = @Content(schema = @Schema(implementation = AiKeywordResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "422",
                    description = "AI 키워드 추출 실패(AI 서버 오류/통신 오류/응답 파싱 실패)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ResponseEntity<AiKeywordResponse> extractKeywords(
            @RequestBody KeywordExtractRequestDto dto
    );


    @Operation(
            summary = "마인드맵 수정사항 저장",
            description = "로그인한 사용자의 마인드맵을 저장한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "저장 성공",
                    content = @Content(schema = @Schema(implementation = MindMapResponseDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없음, 유효하지 않은 마인드맵, 또는 본인의 마인드맵이 아님",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ResponseEntity saveMindMap(
            UserSecurityDto userSecurityDto,
            @RequestBody MindMapSaveDto mindMapSaveDto
    );
}
