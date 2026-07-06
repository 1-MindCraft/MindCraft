package com.mindcraft.backend.coverletter.section.dto;

/**
 * React 노드의 data 필드 (중첩 구조).
 * 여기서 label(→topic), parentId만 평탄화에 사용. depth는 무시.
 */
public record ReactNodeData(
        String label,
        String parentId,
        Integer depth
) {
}