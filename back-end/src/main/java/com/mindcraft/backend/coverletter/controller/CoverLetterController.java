package com.mindcraft.backend.coverletter.controller;

import com.mindcraft.backend.coverletter.dto.CoverLetterDetailDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterRequestDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterSummaryDto;
import com.mindcraft.backend.coverletter.entity.CoverLetter;
import com.mindcraft.backend.coverletter.mapper.CoverLetterMapper;
import com.mindcraft.backend.coverletter.service.CoverLetterService;
import com.mindcraft.backend.user.dto.UserSecurityDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/coverletters") // API 엔드포인트를 바탕으로 이름은 coverletters
@RequiredArgsConstructor
@Slf4j
public class CoverLetterController {

    private final CoverLetterService coverLetterService;
    private final CoverLetterMapper mapper;

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
}
