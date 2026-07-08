package com.mindcraft.backend.coverletter.section.repository;

import com.mindcraft.backend.coverletter.section.entity.CoverLetterSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CoverLetterSectionRepository extends JpaRepository<CoverLetterSection, Long> {

    List<CoverLetterSection> findByCoverLetterIdOrderByIdAsc(Long coverLetterId);

    Optional<CoverLetterSection> findByIdAndCoverLetterId(Long id, Long coverLetterId);
}
