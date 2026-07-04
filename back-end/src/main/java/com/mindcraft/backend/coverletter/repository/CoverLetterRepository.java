package com.mindcraft.backend.coverletter.repository;

import com.mindcraft.backend.coverletter.entity.CoverLetter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CoverLetterRepository extends JpaRepository<CoverLetter, Long> {

    // Version 1 때는 mindmap : coverletter 가 1 : 1 이라고 했으니까 mindmapId로 단건 조회 설정
    Optional<CoverLetter> findByMindmapId(Long mindmapId);
}
