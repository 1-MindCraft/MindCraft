package com.mindcraft.backend.coverletter.controller;

import com.mindcraft.backend.coverletter.dto.CoverLetterRequestDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterResponseDto;
import com.mindcraft.backend.coverletter.service.CoverLetterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/coverletters") // << 주소는 따로 정한게 없어서 API 엔드포인트를 참고해서 coverletters 로 하겠습니다.
@RequiredArgsConstructor
public class CoverLetterController {

    private final CoverLetterService coverLetterService;

    // 자기소개서 생성 API

    @PostMapping
    public ResponseEntity<CoverLetterResponseDto> createCoverLetter(@RequestBody CoverLetterRequestDto requestDto) {
        CoverLetterResponseDto responseDto = coverLetterService.createCoverLetter(requestDto);
        return ResponseEntity.ok(responseDto);
    }
}
