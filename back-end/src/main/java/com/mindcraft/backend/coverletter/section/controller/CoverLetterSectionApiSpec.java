package com.mindcraft.backend.coverletter.section.controller;

import com.mindcraft.backend.coverletter.section.dto.CoverLetterSectionDto;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@Tag(name = "CoverLetterSection", description = "자소서 문항 관련 API")
public interface CoverLetterSectionApiSpec {

    List<CoverLetterSectionDto> getList(@PathVariable("coverletterId") Long coverletterId);

    ResponseEntity<CoverLetterSectionDto> create(
            @PathVariable("coverletterId") Long coverletterId,
            @RequestBody CoverLetterSectionDto coverLetterSectionDto);


    Map<String, String> update(
            @PathVariable("coverletterId") Long coverletterId,
            @PathVariable("sectionId") Long sectionId,
            @RequestBody CoverLetterSectionDto coverLetterSectionDto);

    Map<String, String> delete(
            @PathVariable("coverletterId") Long coverletterId,
            @PathVariable("sectionId") Long sectionId);
}
