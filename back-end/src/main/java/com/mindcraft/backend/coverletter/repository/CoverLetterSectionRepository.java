package com.mindcraft.backend.coverletter.repository;

import com.mindcraft.backend.coverletter.entity.CoverLetterSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoverLetterSectionRepository extends JpaRepository<CoverLetterSection, Long> {

    List<CoverLetterSection> findByCoverLetterIdOrderByIdAsc(Long coverLetterId);
}
