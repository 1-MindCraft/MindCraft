package com.mindcraft.backend.coverletter.controller;

import com.mindcraft.backend.coverletter.dto.CoverLetterDetailDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterRequestDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterSummaryDto;
import com.mindcraft.backend.global.exception.ErrorResponse;
import com.mindcraft.backend.user.dto.UserSecurityDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "CoverLetter", description = "자기소개서 마스터 관련 API")
public interface CoverLetterApiSpec {

    @Operation(
            summary = "자소서 마스터 상세 조회",
            description = "자소서 마스터 id로 해당 자소서의 상세 정보(회사 정보, 문항 목록 등)를 조회한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(schema = @Schema(implementation = CoverLetterDetailDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "본인의 자소서 마스터가 아님",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "자소서 마스터 id를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity getDetail(
            UserSecurityDto userSecurityDto,
            @PathVariable("id") Long coverLetterId);


    @Operation(
            summary = "자소서 마스터 조회",
            description = "로그인한 본인의 모든 자소서 마스터를 조회한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "조회 성공",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = CoverLetterSummaryDto.class)))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity getCoverLetters(UserSecurityDto userSecurityDto);


    @Operation(
            summary = "자소서 마스터 생성",
            description = "자소서를 작성할 회사에 대한 정보를 작성하는 자소서 마스터를 생성한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "생성 성공",
                    content = @Content(schema = @Schema(implementation = CoverLetterSummaryDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "사용자를 찾을 수 없음 또는 유효하지 않은 마인드맵",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity createCoverLetter(
            UserSecurityDto userSecurityDto,
            @Valid @RequestBody CoverLetterRequestDto coverLetterRequestDto);


    @Operation(
            summary = "자소서 마스터 삭제",
            description = "자소서 마스터 id를 통해 자소서 마스터 한 개를 삭제한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "삭제 성공"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "본인의 자소서 마스터가 아님",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "자소서 마스터 id를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity deleteCoverLetter(
            UserSecurityDto userSecurityDto,
            @PathVariable("id") long coverLetterId);


    @Operation(
            summary = "자소서 마스터 수정",
            description = "자소서 마스터 id를 통해 자소서 마스터의 정보(회사 이름, 인재상, 직무 설명)를 수정한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "수정 성공"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "본인의 자소서 마스터가 아님",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "자소서 마스터 id를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity modifyCoverLetter(
            UserSecurityDto userSecurityDto,
            @Valid @RequestBody CoverLetterRequestDto coverLetterRequestDto,
            @PathVariable("id") long coverLetterId
    );


    @Operation(
            summary = "자소서 내용 PDF 다운",
            description = "자소서 마스터 id를 통해 해당 자소서 마스터에 포함된 자소서 문항과 내용들을 PDF로 제공한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "PDF 제작 성공"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "본인의 자소서 마스터가 아님",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "자소서 마스터 id를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity<byte[]> exportPdf(
            UserSecurityDto userSecurityDto,
            @PathVariable("id") Long coverLetterId);


    @Operation(
            summary = "자소서 내용 DOCX 다운",
            description = "자소서 마스터 id를 통해 해당 자소서 마스터에 포함된 자소서 문항과 내용들을 DOCX로 제공한다."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "DOCX 제작 성공"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "인증되지 않은 요청(토큰 없음/만료)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "본인의 자소서 마스터가 아님",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "자소서 마스터 id를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    public ResponseEntity<byte[]> exportDocx(
            UserSecurityDto userSecurityDto,
            @PathVariable("id") Long coverLetterId);
}
