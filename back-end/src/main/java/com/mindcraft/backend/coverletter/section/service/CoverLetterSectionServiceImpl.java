package com.mindcraft.backend.coverletter.section.service;

import com.mindcraft.backend.coverletter.entity.CoverLetter;
import com.mindcraft.backend.coverletter.repository.CoverLetterRepository;
import com.mindcraft.backend.coverletter.section.dto.CoverLetterSectionDto;
import com.mindcraft.backend.coverletter.section.entity.CoverLetterSection;
import com.mindcraft.backend.coverletter.section.repository.CoverLetterSectionRepository;
import com.mindcraft.backend.global.exception.CoverLetterNotFoundException;
import com.mindcraft.backend.global.exception.CoverLetterSectionNotFoundException;
import com.mindcraft.backend.global.exception.InvalidCoverLetterSectionException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CoverLetterSectionServiceImpl implements CoverLetterSectionService {

    private static final int DEFAULT_MAX_CHARS = 500;

    private final CoverLetterRepository coverLetterRepository;
    private final CoverLetterSectionRepository coverLetterSectionRepository;
    private final AiCoverLetterService aiCoverLetterService;

    @Override
    public List<CoverLetterSectionDto> getList(Long coverLetterId) {
        return coverLetterSectionRepository.findByCoverLetterIdOrderByIdAsc(coverLetterId)
                .stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CoverLetterSectionDto create(Long coverLetterId, CoverLetterSectionDto dto) {
        validateCreateRequest(dto);

        CoverLetter coverLetter = coverLetterRepository.findById(coverLetterId)
                .orElseThrow(() -> new CoverLetterNotFoundException("cover letter not found"));

        int maxChars = dto.getMaxChars() != null ? dto.getMaxChars() : DEFAULT_MAX_CHARS;
        boolean allowCreativity = Boolean.TRUE.equals(dto.getAllowCreativity());

        // v1 임시: 회사명 없으면 기본값 치환 (v2에서 NOT NULL + 프론트 필수입력으로 전환 예정)
        String companyName = coverLetter.getCompanyName();
        if (companyName == null || companyName.isBlank()) {
            companyName = "지원 회사";
        }

        String answer = aiCoverLetterService.generateAnswer(
                coverLetterId,
                companyName,
                coverLetter.getCompanyIdeal(),
                coverLetter.getJobDescription(),
                dto.getQuestion(),
                dto.getWritingStyle(),
                maxChars,
                allowCreativity,
                dto.getSourceNode()
        );

        CoverLetterSection section = new CoverLetterSection();
        section.setCoverLetter(coverLetter);
        section.setQuestion(dto.getQuestion());
        section.setAnswer(answer);
        section.setSourceNode(dto.getSourceNode());
        section.setWritingStyle(dto.getWritingStyle());
        section.setMaxChars(maxChars);
        section.setAllowCreativity(allowCreativity);

        CoverLetterSection savedSection = coverLetterSectionRepository.save(section);
        return entityToDto(savedSection);
    }

    @Override
    @Transactional
    public boolean update(Long coverLetterId, CoverLetterSectionDto dto) {
        CoverLetterSection section = coverLetterSectionRepository.findByIdAndCoverLetterId(dto.getId(), coverLetterId)
                .orElseThrow(() -> new CoverLetterSectionNotFoundException("section not found"));

        if (dto.getQuestion() != null) {
            section.setQuestion(dto.getQuestion());
        }

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

    @Override
    @Transactional
    public boolean delete(Long coverLetterId, Long sectionId) {
        CoverLetterSection section = coverLetterSectionRepository.findByIdAndCoverLetterId(sectionId, coverLetterId)
                .orElseThrow(() -> new CoverLetterSectionNotFoundException("section not found"));

        coverLetterSectionRepository.delete(section);
        return true;
    }

    private void validateCreateRequest(CoverLetterSectionDto dto) {
        if (dto.getQuestion() == null || dto.getQuestion().isBlank()) {
            throw new InvalidCoverLetterSectionException("question is required");
        }

        if (dto.getSourceNode() == null || dto.getSourceNode().isEmpty()) {
            throw new InvalidCoverLetterSectionException("source_node must contain at least one node");
        }
    }
}
