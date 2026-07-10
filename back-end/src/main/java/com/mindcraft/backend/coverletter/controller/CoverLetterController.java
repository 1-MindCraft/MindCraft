package com.mindcraft.backend.coverletter.controller;

import com.mindcraft.backend.coverletter.dto.CoverLetterDetailDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterRequestDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterSummaryDto;
import com.mindcraft.backend.coverletter.entity.CoverLetter;
import com.mindcraft.backend.coverletter.mapper.CoverLetterMapper;
import com.mindcraft.backend.coverletter.export.service.CoverLetterExportService; // 추가된 부분: export 서비스 사용을 위해 추가
import com.mindcraft.backend.coverletter.service.CoverLetterService;
import com.mindcraft.backend.user.dto.UserSecurityDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders; // 추가된 부분: Content-Disposition 헤더 설정에 필요
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType; // 추가된 부분: PDF/DOCX Content-Type 지정에 필요
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.net.URLEncoder; // 추가된 부분: 한글 파일명을 다운로드 헤더에 안전하게 넣기 위해 필요
import java.nio.charset.StandardCharsets; // 추가된 부분: 위와 동일한 이유
import java.util.Map;

@RestController
@RequestMapping(value = "/coverletters") // API 엔드포인트를 바탕으로 이름은 coverletters
@RequiredArgsConstructor
@Slf4j
public class CoverLetterController {

    private final CoverLetterService coverLetterService;
    private final CoverLetterMapper mapper;
    // 추가된 부분: PDF/DOCX 변환 로직을 가진 서비스 주입
    // 이유: 아래 두 export 엔드포인트가 실제 파일 바이트를 만들 때 필요해서 추가
    private final CoverLetterExportService coverLetterExportService;

    // 자소서 생성 및 조회 ( API 문서 : GET /coverletters, 1 : 1 기준 )
    // 마인드맵 페이지에서 [ 내보내기 ] 클릭할 시 가장 먼저 호출
    // mindmapId를 URL에 넣지 않고, 로그인한 사용자(JWT) 기준으로 그 사용자의
    // mindmap → coverletter 순으로 찾아간다. 있으면 반환하고, 없으면 새로 만들어서 반환.
    //
    // JWTCheckFilter가 이미 동작하고 있어서, userId를 쿼리 파라미터로 따로 받지 않고
    // @AuthenticationPrincipal로 토큰에서 바로 꺼낸다.
    // (mindmap/MindMapController.getMindMap()과 완전히 동일한 패턴)
//    @GetMapping
//    public CoverLetterDto getCoverLetter(@AuthenticationPrincipal UserSecurityDto userSecurityDto) {
//        Long userId = userSecurityDto.getId();
//        log.info("userId......" + userId);
//        return coverLetterService.getOrCreate(userId);
//    }

    // 상세조회 ( API 문서 : GET /coverletters/{id} )
    // coverletter 자신의 id로 자소서 + 항목 목록을 조회.
    // 200 { id, title, sections: [...] } / 404 { "error": "문서를 찾을 수 없습니다." }
    @GetMapping(value = "/{id}")
    public ResponseEntity getDetail(
            @AuthenticationPrincipal UserSecurityDto userSecurityDto,
            @PathVariable("id") Long coverLetterId) {
        CoverLetterDetailDto response = coverLetterService.getDetailById(userSecurityDto.getId(), coverLetterId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity getCoverLetters(@AuthenticationPrincipal UserSecurityDto userSecurityDto) {
        List<CoverLetterSummaryDto> allCoverLetters = coverLetterService.getAllCoverLetters(userSecurityDto.getId());
        return new ResponseEntity<>(allCoverLetters, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity createCoverLetter(
            @AuthenticationPrincipal UserSecurityDto userSecurityDto,
            @Valid @RequestBody CoverLetterRequestDto coverLetterRequestDto) {
        long userId = userSecurityDto.getId();
        CoverLetter coverLetter = mapper.coverLetterRequestDtoToCoverLetter(coverLetterRequestDto);
        CoverLetterSummaryDto response = coverLetterService.createCoverLetter(coverLetter, userId, coverLetterRequestDto.getMindMapId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteCoverLetter(
            @AuthenticationPrincipal UserSecurityDto userSecurityDto,
            @PathVariable("id") long coverLetterId) {
        long userId = userSecurityDto.getId();
        coverLetterService.deleteCoverLetter(userId, coverLetterId);
        return new ResponseEntity<>(
                Map.of("message", "자소서 및 하위 문항이 일괄 삭제되었습니다."),
                HttpStatus.OK
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity modifyCoverLetter(
            @AuthenticationPrincipal UserSecurityDto userSecurityDto,
            @Valid @RequestBody CoverLetterRequestDto coverLetterRequestDto,
            @PathVariable("id") long coverLetterId
    ) {
        long userId = userSecurityDto.getId();
        CoverLetter coverLetter = mapper.coverLetterRequestDtoToCoverLetter(coverLetterRequestDto);
        CoverLetterSummaryDto response = coverLetterService.updateCoverLetter(coverLetter, userId, coverLetterId);
        return new ResponseEntity<>(Map.of(
                "message", "자소서 기본 정보가 수정되었습니다."
        ), HttpStatus.OK);
    }

    // 추가된 부분: PDF 내보내기 엔드포인트 (GET /coverletters/{id}/export/pdf)
    // 이유: 프론트에서 브라우저 자체적으로(jsPDF+html2canvas 이미지 캡처 방식) 만들던 PDF를
    // 서버에서 실제 텍스트 PDF로 만들어주기 위해 추가. 한글이 이미지가 아니라 진짜 텍스트로
    // 들어가서 복사/검색이 가능해짐.
    @GetMapping(value = "/{id}/export/pdf")
    public ResponseEntity<byte[]> exportPdf(@PathVariable("id") Long id) {
        return coverLetterService.findById(id)
                .map(dto -> {
                    byte[] pdfBytes = coverLetterExportService.toPdf(dto);
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition(dto.getTitle(), "pdf"))
                            .contentType(MediaType.APPLICATION_PDF)
                            .body(pdfBytes);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // 추가된 부분: DOCX 내보내기 엔드포인트 (GET /coverletters/{id}/export/docx)
    // 이유: 위 PDF와 같은 이유 + 프론트에서 쓰던 docx 라이브러리를 서버로 옮기기 위해 추가
    @GetMapping(value = "/{id}/export/docx")
    public ResponseEntity<byte[]> exportDocx(@PathVariable("id") Long id) {
        return coverLetterService.findById(id)
                .map(dto -> {
                    byte[] docxBytes = coverLetterExportService.toDocx(dto);
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition(dto.getTitle(), "docx"))
                            .contentType(MediaType.parseMediaType(
                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                            .body(docxBytes);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // 추가된 부분: 다운로드 파일명을 만드는 헬퍼
    // 이유: 두 엔드포인트가 똑같은 파일명 규칙(제목 + 확장자)을 쓰므로 중복을 없애기 위해 추가
    private String buildFilename(String title, String ext) {
        String safeTitle = (title == null || title.isBlank()) ? "자기소개서" : title;
        return safeTitle + "." + ext;
    }

    // 추가된 부분: Content-Disposition 헤더를 만드는 헬퍼
    // 이유: 한글 파일명을 그냥 넣으면 브라우저에 따라 깨질 수 있어서, RFC 5987 방식
    // (filename*=UTF-8''인코딩값)으로 인코딩해서 넣어야 안전하게 다운로드됨
    private String contentDisposition(String title, String ext) {
        String filename = buildFilename(title, ext);
        String encoded = URLEncoder.encode(filename, StandardCharsets.UTF_8).replace("+", "%20");
        return "attachment; filename*=UTF-8''" + encoded;
    }
}