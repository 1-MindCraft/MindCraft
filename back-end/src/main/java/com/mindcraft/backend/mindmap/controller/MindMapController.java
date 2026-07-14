package com.mindcraft.backend.mindmap.controller;

import com.mindcraft.backend.mindmap.dto.AiKeywordResponse;
import com.mindcraft.backend.mindmap.dto.KeywordExtractRequestDto;
import com.mindcraft.backend.mindmap.dto.MindMapSaveDto;
import com.mindcraft.backend.mindmap.entity.MindMap;
import com.mindcraft.backend.mindmap.mapper.MindMapMapper;
import com.mindcraft.backend.mindmap.service.AiKeywordService;
import com.mindcraft.backend.mindmap.service.MindMapService;
import com.mindcraft.backend.user.dto.UserSecurityDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mindmaps")
@RequiredArgsConstructor
public class MindMapController {

    private final MindMapService mindMapService;
    private final MindMapMapper mindMapMapper;
    private final AiKeywordService aiKeywordService;

    @GetMapping
    public ResponseEntity getMindMap(
            @AuthenticationPrincipal UserSecurityDto userSecurityDto) {
        long userId = userSecurityDto.getId();

        MindMap mindMap = mindMapService.getOrCreateMindMap(userId);
        return new ResponseEntity<>(
                mindMapMapper.mindMapToMindMapResponseDto(mindMap),
                HttpStatus.OK
        );
    }

    @PostMapping("/keywords")
    public ResponseEntity<AiKeywordResponse> extractKeywords(
            @RequestBody KeywordExtractRequestDto dto
    ){
        return new ResponseEntity<>(
                aiKeywordService.extractKeywords(dto.getNodes()),
                HttpStatus.OK
        );
    }

    @PutMapping
    public ResponseEntity saveMindMap(
            @AuthenticationPrincipal UserSecurityDto userSecurityDto,
            @RequestBody MindMapSaveDto mindMapSaveDto
            ) {
        long userId = userSecurityDto.getId();
        MindMap mindMap = mindMapMapper.mindMapSaveDtoToMindMap(mindMapSaveDto);
        MindMap savedMindMap = mindMapService.saveMindMap(mindMap, userId);

        return new ResponseEntity<>(
                mindMapMapper.mindMapToMindMapResponseDto(savedMindMap),
                HttpStatus.OK
        );
    }
}
