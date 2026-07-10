package com.mindcraft.backend.coverletter.mapper;

import com.mindcraft.backend.coverletter.dto.CoverLetterDetailDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterRequestDto;
import com.mindcraft.backend.coverletter.dto.CoverLetterSummaryDto;
import com.mindcraft.backend.coverletter.entity.CoverLetter;
import com.mindcraft.backend.coverletter.section.dto.CoverLetterSectionDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CoverLetterMapper {

    @Mapping(target = "mindMap", ignore = true)
    CoverLetter coverLetterRequestDtoToCoverLetter(CoverLetterRequestDto coverLetterRequestDto);

    @Mapping(target = "mindMapId", source = "mindMap.id")
    CoverLetterSummaryDto coverLetterToCoverLetterSummaryDto(CoverLetter coverLetter);

    @Mapping(target = "mindMapId", source = "coverLetter.mindMap.id")
    CoverLetterDetailDto coverLetterToCoverLetterDetailDto(CoverLetter coverLetter, List<CoverLetterSectionDto> sections);
}
