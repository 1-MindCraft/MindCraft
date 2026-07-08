package com.mindcraft.backend.mindmap.repository;

import com.mindcraft.backend.mindmap.entity.MindMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MindMapRepository extends JpaRepository<MindMap, Long> {

    @Query("SELECT m FROM MindMap m WHERE m.user.id = :userId")
    Optional<MindMap> findByUserId(@Param("userId") Long userId);
}
