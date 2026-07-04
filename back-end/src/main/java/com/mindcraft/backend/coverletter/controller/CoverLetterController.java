package com.mindcraft.backend.coverletter.controller;

import com.mindcraft.backend.coverletter.dto.CoverLetterDto;
import com.mindcraft.backend.coverletter.service.CoverLetterService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "/coverletters") // API 엔드포인트를 바탕으로 이름은 coverletters
@RequiredArgsConstructor
@Slf4j
public class CoverLetterController {

    private final CoverLetterService coverLetterService;

    // 상세조회
    // 마인드맵 페이지에서 [ 내보내기 ] 클릭할 시 가장 먼저 호출함
    // 해당 mindmapId로 생성된 자소서가 있으면 반환하고, 없으면 null을 반환
    // 프론트에서는 null( 빈 응답 )을 신호로 자소서 생성 API를 호출함
    @GetMapping(value = "/mindmap/{mindmapId}")
    public CoverLetterDto getByMindmapId(@PathVariable("mindmapId") Long mindmapId) {
        log.info("mindmapId......" + mindmapId);
        return coverLetterService.getDetail(mindmapId);
    }

    // 자소서 생성
    // 상세보기에서 null 값이 왔을 때 호출하는 형태 이미 있으면 기존 데이터를 불러오고
    // 없으면 항목이 빈 상태의 새로운 자소서를 만들어서 반환
    @PostMapping(value = "")
    public CoverLetterDto add(@RequestBody CoverLetterDto coverLetterDto) {
        log.info("add......" + coverLetterDto);
        return coverLetterService.insert(coverLetterDto);
    }

    // 자소서 제목 / 항목 / 기업 정보 수정
    @PutMapping(value = "/{id}")
    public Map<String, String> modify(
            @PathVariable(name = "id") Long id,
            @RequestBody CoverLetterDto coverLetterDto) {
        log.info("modify......" + coverLetterDto);

        coverLetterDto.setId(id);
        boolean result = coverLetterService.update(coverLetterDto);

        if (!result) {
            return Map.of("RESULT", "자기소개서를 찾을 수 없습니다.");
        }
        return Map.of("RESULT", "수정이 완료되었습니다.");
    }
}
