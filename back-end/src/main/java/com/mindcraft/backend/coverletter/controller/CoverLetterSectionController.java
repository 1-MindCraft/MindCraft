package com.mindcraft.backend.coverletter.controller;

import com.mindcraft.backend.coverletter.dto.CoverLetterSectionDto;
import com.mindcraft.backend.coverletter.service.CoverLetterSectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/coverletters/{coverletterId}/sections")
@RequiredArgsConstructor
@Slf4j
public class CoverLetterSectionController {

    private final CoverLetterSectionService coverLetterSectionService;

    // 항목 목록 조회
    @GetMapping(value = "")
    public List<CoverLetterSectionDto> getList(@PathVariable("coverletterId") Long coverletterId) {
        log.info("coverletterId......" + coverletterId);
        return coverLetterSectionService.getList(coverletterId);
    }

    // 항목 하나에 대한 답변 / 설정 수정
    @PutMapping(value = "/{sectionId}")
    public Map<String, String> update(
            @PathVariable("coverletterId") Long coverletterId,
            @PathVariable("sectionId") Long sectionId,
            @RequestBody CoverLetterSectionDto coverLetterSectionDto) {
        log.info("update......" + coverLetterSectionDto);

        coverLetterSectionDto.setId(sectionId);
        boolean result = coverLetterSectionService.update(coverLetterSectionDto);

        if (!result) {
            return Map.of("message", "항목을 찾을 수 없습니다.");
        }
        return Map.of("message", "수정이 완료되었습니다.");
    }
}
