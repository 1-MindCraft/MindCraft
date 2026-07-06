package com.mindcraft.backend.coverletter.service;

import com.mindcraft.backend.coverletter.dto.CoverLetterDto;
import com.mindcraft.backend.coverletter.entity.CoverLetter;
import com.mindcraft.backend.coverletter.entity.CoverLetterSection;
import com.mindcraft.backend.coverletter.repository.CoverLetterRepository;
import com.mindcraft.backend.coverletter.repository.CoverLetterSectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CoverLetterServiceImpl implements CoverLetterService {

    private final CoverLetterRepository coverLetterRepository;
    private final CoverLetterSectionRepository coverLetterSectionRepository;

    @Override
    public CoverLetterDto getDetail(Long mindmapId) {
        Optional<CoverLetter> result = coverLetterRepository.findByMindmapId(mindmapId);
        if (result.isPresent()) {
            CoverLetter coverLetter = result.get();
            List<CoverLetterSection> sections =
                    coverLetterSectionRepository.findByCoverLetterIdOrderByIdAsc(coverLetter.getId());
            return entityToDto(coverLetter, sections);
        }
        return null;
    }

    @Override
    @Transactional
    public CoverLetterDto insert(CoverLetterDto dto) {

        // 이미 마인드맵으로 생성된 자소서가 있다면, 새로 만들지 않고 기존 데이터를 그대로 반환
        Optional<CoverLetter> existing = coverLetterRepository.findByMindmapId(dto.getMindmapId());
        if (existing.isPresent()) {
            CoverLetter coverLetter = existing.get();
            List<CoverLetterSection> sections =
                    coverLetterSectionRepository.findByCoverLetterIdOrderByIdAsc(coverLetter.getId());
            log.info("이미 생성된 자소서가 있어 기존 데이터를 반환합니다. mindmapId = " + dto.getMindmapId());
            return entityToDto(coverLetter, sections);
        }

        // title은 자동으로 "자기소개서 초안"이 채워짐
        // 항목 (coverletter_section)은 비어있는 상태가 됨
        CoverLetter coverLetter = dtoToEntity(dto);
        coverLetterRepository.save(coverLetter);
        log.info("insert 후 coverLetter = " + coverLetter);

        return entityToDto(coverLetter, List.of());
    }

    @Override
    @Transactional
    public boolean update(CoverLetterDto dto) {

        Optional<CoverLetter> result = coverLetterRepository.findById(dto.getId());
        if (result.isPresent()) {
            CoverLetter coverLetter = result.get();

            if (dto.getTitle() != null) {
                coverLetter.setTitle(dto.getTitle());
            }

            if (dto.getCompanyName() != null) {
                coverLetter.setCompanyName(dto.getCompanyName());
            }

            if (dto.getCompanyIdeal() != null) {
                coverLetter.setCompanyIdeal(dto.getCompanyIdeal());
            }

            if (dto.getJobDescription() != null) {
                coverLetter.setJobDescription(dto.getJobDescription());
            }
            return true;
        }
        return false;
    }
}
