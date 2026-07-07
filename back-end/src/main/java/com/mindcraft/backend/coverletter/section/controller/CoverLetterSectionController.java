package com.mindcraft.backend.coverletter.section.controller;

import com.mindcraft.backend.coverletter.section.dto.CoverLetterSectionDto;
import com.mindcraft.backend.coverletter.section.service.CoverLetterSectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/coverletters/{coverletterId}/sections")
@RequiredArgsConstructor
@Slf4j
public class CoverLetterSectionController {

    private final CoverLetterSectionService coverLetterSectionService;

    @GetMapping(value = "")
    public List<CoverLetterSectionDto> getList(@PathVariable("coverletterId") Long coverletterId) {
        log.info("coverletterId......" + coverletterId);
        return coverLetterSectionService.getList(coverletterId);
    }

    @PostMapping(value = "")
    public ResponseEntity<CoverLetterSectionDto> create(
            @PathVariable("coverletterId") Long coverletterId,
            @RequestBody CoverLetterSectionDto coverLetterSectionDto) {
        log.info("create......" + coverLetterSectionDto);

        CoverLetterSectionDto createdSection = coverLetterSectionService.create(coverletterId, coverLetterSectionDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSection);
    }

    @PutMapping(value = "/{sectionId}")
    public Map<String, String> update(
            @PathVariable("coverletterId") Long coverletterId,
            @PathVariable("sectionId") Long sectionId,
            @RequestBody CoverLetterSectionDto coverLetterSectionDto) {
        log.info("update......" + coverLetterSectionDto);

        coverLetterSectionDto.setId(sectionId);
        boolean result = coverLetterSectionService.update(coverletterId, coverLetterSectionDto);

        if (!result) {
            return Map.of("message", "항목을 찾을 수 없습니다.");
        }
        return Map.of("message", "수정이 완료되었습니다.");
    }

    @DeleteMapping(value = "/{sectionId}")
    public Map<String, String> delete(
            @PathVariable("coverletterId") Long coverletterId,
            @PathVariable("sectionId") Long sectionId) {
        log.info("delete...... coverletterId={}, sectionId={}", coverletterId, sectionId);

        boolean result = coverLetterSectionService.delete(coverletterId, sectionId);

        if (!result) {
            return Map.of("message", "section not found");
        }
        return Map.of("message", "section deleted");
    }
}
