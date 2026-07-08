package com.mindcraft.backend.coverletter.service;

import com.mindcraft.backend.coverletter.dto.CoverLetterDto;
import com.mindcraft.backend.coverletter.entity.CoverLetter;
import com.mindcraft.backend.coverletter.section.dto.CoverLetterSectionDto;
import com.mindcraft.backend.coverletter.section.entity.CoverLetterSection;
import org.springframework.beans.BeanUtils;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface CoverLetterService {

    default CoverLetterDto entityToDto(CoverLetter entity) {
        CoverLetterDto dto = new CoverLetterDto();

        /*
            BeanUtil.copyProperties(dto, coverLetter)
            (1) dto 객체의 프로퍼티 값을 coverLetter 객체로 복사합니다.
            (2) 이름과 타입이 같은 필드만 복사합니다.
            (3) DTO → Entity 변환 또는 Entity → DTO 변환 시 자주 사용됩니다.
         */

        BeanUtils.copyProperties(entity, dto);

        // user(FK)는 이름과 타입이 달라서 BeanUtils가 옮기지 못하니 직접 채워줌
        dto.setUserId(entity.getUser().getId());
        dto.setSections(Collections.emptyList());
        return dto;
    }

    // Sections 없이 coverletter 필드만 변환 ( BeanUtils 는 타입이 다른 sections 필드는 건너뜀 )
    default CoverLetterDto entityToDto(CoverLetter entity, List<CoverLetterSection> sections) {
        CoverLetterDto dto = new CoverLetterDto();
        BeanUtils.copyProperties(entity, dto);
        dto.setUserId(entity.getUser().getId());

        List<CoverLetterSectionDto> sectionDtoList = sections.stream()
                .map(this::sectionEntityToDto)
                .collect(Collectors.toList());
        dto.setSections(sectionDtoList);
        return dto;
    }

    // sections 목록은 별도로 채워서 반환
    default CoverLetterSectionDto sectionEntityToDto(CoverLetterSection entity) {
        CoverLetterSectionDto dto = new CoverLetterSectionDto();
        BeanUtils.copyProperties(entity, dto);
        dto.setCoverLetterId(entity.getCoverLetter().getId());
        return dto;
    }

    /*
     * (API 문서 반영) GET /coverletters
     * mindmapId를 URL에 넣지 않고, userId로 그 사용자의 mindmap을 먼저 찾은 뒤
     * 그 mindmap에 속한 coverletter를 조회/생성한다.
     *
     * user : mindmap = 1:1, mindmap : coverletter = 1:1 이므로,
     * 결국 userId 하나만 알아도 그 사람의 자소서까지 정확히 하나로 도달할 수 있다.
     * (mindmap 패키지의 MindMapController.getMindMap()이 이미 이 방식 — id 없이
     *  로그인한 사용자 기준으로만 동작 — 을 쓰고 있어서 그대로 맞췄다.)
     *
     * 지금은 로그인/JWT가 없어서 userId를 그대로 파라미터로 받지만,
     * 나중에 @AuthenticationPrincipal이 붙으면 그 자리를 대체하면 된다.
     */
    CoverLetterDto getOrCreate(Long userId);


    // 상세조회 ( API 문서 : GET /coverletters/{id} )
    // coverletter 자신의 id로 자소서 + 항목 목록을 찾음 없으면 Optional.empty()
    // Optional.empty() : 컨트롤러에서 404 ( { "error": "문서를 찾을 수 없습니다." } ) 로 응답할 때 사용

    Optional<CoverLetterDto> findById(Long id);

    // 수정 (Put) 은 coverletter 자신의 id로 대상을 찾음
    // GET ( getOrCreate )에서 자소서의 id를 응답으로 받아둔 상태
    boolean update(CoverLetterDto dto);
}
