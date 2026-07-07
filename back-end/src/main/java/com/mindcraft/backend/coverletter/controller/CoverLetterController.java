package com.mindcraft.backend.coverletter.controller;

import com.mindcraft.backend.coverletter.dto.CoverLetterDto;
import com.mindcraft.backend.coverletter.service.CoverLetterService;
import com.mindcraft.backend.user.dto.UserSecurityDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "/coverletters") // API 엔드포인트를 바탕으로 이름은 coverletters
@RequiredArgsConstructor
@Slf4j
public class CoverLetterController {

    private final CoverLetterService coverLetterService;

    // 자소서 생성 및 조회 ( API 문서 : GET /coverletters, 1 : 1 기준 )
    // 마인드맵 페이지에서 [ 내보내기 ] 클릭할 시 가장 먼저 호출
    // mindmapId를 URL에 넣지 않고, 로그인한 사용자(JWT) 기준으로 그 사용자의
    // mindmap → coverletter 순으로 찾아간다. 있으면 반환하고, 없으면 새로 만들어서 반환.
    //
    // JWTCheckFilter가 이미 동작하고 있어서, userId를 쿼리 파라미터로 따로 받지 않고
    // @AuthenticationPrincipal로 토큰에서 바로 꺼낸다.
    // (mindmap/MindMapController.getMindMap()과 완전히 동일한 패턴)
    @GetMapping
    public CoverLetterDto getCoverLetter(@AuthenticationPrincipal UserSecurityDto userSecurityDto) {
        Long userId = userSecurityDto.getId();
        log.info("userId......" + userId);
        return coverLetterService.getOrCreate(userId);
    }

    // 상세조회 ( API 문서 : GET /coverletters/{id} )
    // coverletter 자신의 id로 자소서 + 항목 목록을 조회.
    // 200 { id, title, sections: [...] } / 404 { "error": "문서를 찾을 수 없습니다." }
    @GetMapping(value = "/{id}")
    public ResponseEntity<?> getDetail(@PathVariable("id") Long id) {
        log.info("getDetail......" + id);
        return coverLetterService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "문서를 찾을 수 없습니다.")));
    }

    // 자소서 생성 ( 1 : 1 ) 버전
    // GET 방식은 1 : 1 방식이 자리잡혀 있으나 POST 는 따로 기준이 없기도 하고
    // 무엇보다 1 : N 방식이어가지고 V1 과는 전혀 맞지 않는다
    // 그래서 POST 방식은 아예 제거함 ( API 문서에도 "나중에!"로 표시되어 있음 )

    // 정보 수정 ( API 문서 : PUT /coverletters/{id} )
    // 200 { "message": "자소서 기본 정보가 수정되었습니다." }
    // 404 { "error": "문서를 찾을 수 없습니다." }
    //
    // PutMapping을 쓰는 이유 : SpringBoot9 파일을 가이드라인으로 삼아서 만들었는데
    // PUT은 리소스 전체를 교체 및 수정한다
    @PutMapping(value = "/{id}")
    public ResponseEntity<Map<String, String>> modify(
            @PathVariable("id") Long id,
            @RequestBody CoverLetterDto coverLetterDto) {
        log.info("modify......" + coverLetterDto);

        coverLetterDto.setId(id);
        boolean result = coverLetterService.update(coverLetterDto);

        if (!result) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "문서를 찾을 수 없습니다."));
        }
        return ResponseEntity.ok(Map.of("message", "자소서 기본 정보가 수정되었습니다."));
    }
}
