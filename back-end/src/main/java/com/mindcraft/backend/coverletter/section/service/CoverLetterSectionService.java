package com.mindcraft.backend.coverletter.section.service;

import com.mindcraft.backend.coverletter.section.dto.CoverLetterSectionDto;
import com.mindcraft.backend.coverletter.section.entity.CoverLetterSection;
import org.springframework.beans.BeanUtils;

import java.util.List;

public interface CoverLetterSectionService {

    default CoverLetterSectionDto entityToDto(CoverLetterSection entity) {
        CoverLetterSectionDto dto = new CoverLetterSectionDto();
        BeanUtils.copyProperties(entity, dto);
        dto.setCoverLetterId(entity.getCoverLetter().getId());
        return dto;
    }

    List<CoverLetterSectionDto> getList(Long coverLetterId);

    CoverLetterSectionDto create(Long coverLetterId, CoverLetterSectionDto dto);

    boolean update(Long coverLetterId, CoverLetterSectionDto dto);

    boolean delete(Long coverLetterId, Long sectionId);
}
