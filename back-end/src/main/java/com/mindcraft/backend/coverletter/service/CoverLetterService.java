package com.mindcraft.backend.coverletter.service;

import com.mindcraft.backend.coverletter.dto.CoverLetterDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterSectionDto;
import com.mindcraft.backend.coverletter.entity.CoverLetter;
import com.mindcraft.backend.coverletter.entity.CoverLetterSection;
import org.springframework.beans.BeanUtils;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public interface CoverLetterService {

    default CoverLetter dtoToEntity(CoverLetterDto dto) {
        CoverLetter coverLetter = new CoverLetter();

        /*
            BeanUtil.copyProperties(dto, coverLetter)
            (1) dto 객체의 프로퍼티 값을 coverLetter 객체로 복사합니다.
            (2) 이름과 타입이 같은 필드만 복사합니다.
            (3) DTO → Entity 변환 또는 Entity → DTO 변환 시 자주 사용됩니다.
         */

        BeanUtils.copyProperties(dto, coverLetter);
        return coverLetter;
    }

    // Sections 없이 coverletter 필드만 변환 ( BeanUtils 는 타입이 다른 sections 필드는 건너뜀 )
    default CoverLetterDto entityToDto(CoverLetter entity) {
        CoverLetterDto dto = new CoverLetterDto();
        BeanUtils.copyProperties(entity, dto);
        dto.setSections(Collections.emptyList());
        return dto;
    }

    // sections 목록은 별도로 채워서 반환
    default CoverLetterDto entityToDto(CoverLetter entity, List<CoverLetterSection> sections) {
        CoverLetterDto dto = new CoverLetterDto();
        BeanUtils.copyProperties(entity, dto);

        List<CoverLetterSectionDto> sectionDtoList = sections.stream()
                .map(this::sectionEntityToDto)
                .collect(Collectors.toList());
        dto.setSections(sectionDtoList);

        return dto;
    }

    default CoverLetterSectionDto sectionEntityToDto(CoverLetterSection entity) {
        CoverLetterSectionDto dto = new CoverLetterSectionDto();
        BeanUtils.copyProperties(entity, dto);
        dto.setCoverLetterId(entity.getCoverLetter().getId());
        return dto;
    }

    // 상세조회 : mindmapId를 기준으로 자소서와 항목 목록들을 찾고, 없으면 null 로 반환
    CoverLetterDto getDetail(Long mindmapId);

    // 자소서 생성 : 이미 해당 mindmapId로 생성된 자소서가 있으면 그 데이터롤 가져옴
    // 만약 없으면 새로 만든 뒤 반환 ( 이때 항목은 비어있는 상태 )
    CoverLetterDto insert(CoverLetterDto dto);

    boolean update(CoverLetterDto dto);
}
