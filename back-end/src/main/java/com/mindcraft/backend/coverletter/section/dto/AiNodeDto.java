package com.mindcraft.backend.coverletter.section.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * FastAPI로 보내는 평탄화된 노드.
 * FastAPI의 MindMapNode 스키마와 1:1 (topic/parentId).
 */
public record AiNodeDto(
        String id,
        String topic,

        @JsonProperty("parentId")
        String parentId,

        List<String> keywords   // v2 대비, v1에선 null
) {
}