package com.mindcraft.backend.coverletter.service;

import com.mindcraft.backend.coverletter.dto.CoverLetterSectionDto;
import com.mindcraft.backend.coverletter.entity.CoverLetterSection;
import org.springframework.beans.BeanUtils;

import java.util.List;

public interface CoverLetterSectionService {

    default CoverLetterSectionDto entityToDto (CoverLetterSection entity) {
        CoverLetterSectionDto dto = new CoverLetterSectionDto();
        BeanUtils.copyProperties(entity, dto);
        dto.setCoverLetterId(entity.getCoverLetter().getId());
        return dto;
    }

    // 데이터를 통해 읽어온 특정 자소서에 속한 항목들을 순서대로 반환
    List<CoverLetterSectionDto> getList(Long coverLetterId);

    // 항목 답변 수정에 대해서 - 성공하면 true, 실패하면 false
    boolean update (CoverLetterSectionDto dto);
}
