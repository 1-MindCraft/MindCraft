package com.mindcraft.backend.coverletter.section.mapper;

import com.mindcraft.backend.coverletter.section.dto.AiNodeDto;
import com.mindcraft.backend.coverletter.section.dto.ReactNode;

import java.util.List;

/*
 * React 원본 노드 → FastAPI 노드 평탄화 (anti-corruption layer).
 *
 * React: { id, data: { label, parentId, depth }, position, type }
 * FastAPI: { id, topic, parentId, keywords }
 *
 * - data.label  → topic  (중첩 풀고 이름 변경)
 * - data.parentId → parentId
 * - position, type, depth 는 버림
 */
public class NodeFlattener {

    // 인스턴스 만들 일 없는 유틸 클래스 → 생성자 막기
    private NodeFlattener() {
    }

    /** React 노드 하나를 FastAPI 노드로 변환 */
    public static AiNodeDto flatten(ReactNode node) {
        return new AiNodeDto(
                node.id(),
                node.data().label(),      // label → topic
                node.data().parentId(),
                null                       // keywords (v1 미사용)
        );
    }

    /** React 노드 리스트를 FastAPI 노드 리스트로 변환 */
    public static List<AiNodeDto> flatten(List<ReactNode> nodes) {
        return nodes.stream()
                .map(NodeFlattener::flatten)
                .toList();
    }
}