package com.mindcraft.backend.coverletter.service;

import com.mindcraft.backend.coverletter.dto.CoverLetterSectionDto;
import com.mindcraft.backend.coverletter.entity.CoverLetterSection;
import com.mindcraft.backend.coverletter.repository.CoverLetterSectionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CoverLetterSectionServiceImpl implements CoverLetterSectionService {

    private final CoverLetterSectionRepository coverLetterSectionRepository;

    @Override
    public List<CoverLetterSectionDto> getList(Long coverLetterId) {
        return coverLetterSectionRepository.findByCoverLetterIdOrderByIdAsc(coverLetterId)
                .stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean update(CoverLetterSectionDto dto) {

        Optional<CoverLetterSection> result = coverLetterSectionRepository.findById(dto.getId());
        if (result.isPresent()) {
            CoverLetterSection section = result.get();

            if (dto.getAnswer() != null) {
                section.setAnswer(dto.getAnswer());
            }

            if (dto.getSourceNode() != null) {
                section.setSourceNode(dto.getSourceNode());
            }

            if (dto.getWritingStyle() != null) {
                section.setWritingStyle(dto.getWritingStyle());
            }

            if (dto.getMaxChars() != null) {
                section.setMaxChars(dto.getMaxChars());
            }

            if (dto.getAllowCreativity() != null) {
                section.setAllowCreativity(dto.getAllowCreativity());
            }

            return true;
        }
        return false;
    }
}
