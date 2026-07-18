package com.mindcraft.backend.coverletter.section.controller;

import com.mindcraft.backend.coverletter.section.dto.CoverLetterSectionDto;
import com.mindcraft.backend.global.exception.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@Tag(name = "CoverLetterSection", description = "자소서 문항 관련 API")
public interface CoverLetterSectionApiSpec {

    @Operation(
            summary = "자소서 문항 목록 조회",
            description = "자소서 마스터 id로 해당 자소서에 속한 문항(질문/답변) 목록을 조회한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = CoverLetterSectionDto.class)))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    List<CoverLetterSectionDto> getList(@PathVariable("coverletterId") Long coverletterId);


    @Operation(
            summary = "자소서 문항 생성",
            description = "자소서 마스터 id에 새로운 문항(질문)을 추가하고, AI가 생성한 답변을 함께 저장한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "생성 성공",
                    content = @Content(schema = @Schema(implementation = CoverLetterSectionDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "질문 또는 참조 노드(source_node)가 비어 있음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "자소서 마스터를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "422",
                    description = "AI 답변 생성 실패(AI 서버 오류/통신 오류/응답 파싱 실패)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    ResponseEntity<CoverLetterSectionDto> create(
            @PathVariable("coverletterId") Long coverletterId,
            @RequestBody CoverLetterSectionDto coverLetterSectionDto);



    @Operation(
            summary = "자소서 문항 수정",
            description = "문항 id로 해당 문항의 내용(질문, 답변 등)을 수정한다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "문항을 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    Map<String, String> update(
            @PathVariable("coverletterId") Long coverletterId,
            @PathVariable("sectionId") Long sectionId,
            @RequestBody CoverLetterSectionDto coverLetterSectionDto);


    @Operation(
            summary = "자소서 문항 삭제",
            description = "문항 id로 해당 문항 한 개를 삭제한다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "문항을 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    Map<String, String> delete(
            @PathVariable("coverletterId") Long coverletterId,
            @PathVariable("sectionId") Long sectionId);
}
