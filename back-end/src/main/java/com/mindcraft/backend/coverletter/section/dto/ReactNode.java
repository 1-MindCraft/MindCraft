package com.mindcraft.backend.coverletter.section.dto;

/**
 * { id, position, data: { label, parentId, depth } }
 * 평탄화에서 id + data.label + data.parentId만 뽑아 AiNodeDto로 변환.
 */
public record ReactNode(
        String id,
        ReactNodeData data
) {
}