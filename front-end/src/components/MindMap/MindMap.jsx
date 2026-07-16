import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { ReactFlow, Background, applyNodeChanges } from '@xyflow/react';
import MindMapNode from './MindMapNode';
import { getDescendantIds, buildEdgesFromNodes, getNewChildPosition } from '../../utils/mindmapTree';
import { MindMapNodesProvider } from '../../context/MindMapNodesContext';
import useMindMapStore from '../../zustand/mindMapStore';
import { useModal } from '../common/ModalProvider';

const nodeTypes = {
  mapNode: MindMapNode,
};

// initialData: 부모(페이지)가 들고 있는 flat 노드 배열 (dummyData 기반, 사이드바와 공유)
// onNodesUpdate: 노드가 바뀔 때마다 부모로 최신 노드 배열을 올려보내는 콜백 (사이드바 동기화용)
// tool: 'drag'(빈 캔버스를 드래그하면 화면 이동) | 'select'(빈 캔버스를 드래그하면 다중 선택)
export default function MindMap({ tool = 'drag' }) {
  const { confirm } = useModal(); // 수정된 부분: 브라우저 기본 confirm() 대신 커스텀 모달 사용
  const nodes = useMindMapStore((state) => state.nodes);
  const setNodes = useMindMapStore((state) => state.setNodes);
  const edges = useMemo(() => buildEdgesFromNodes(nodes), [nodes]);
  const fetchMindMap = useMindMapStore((state) => state.fetchMindMap);
  const clearNodes = useMindMapStore((state) => state.clearNodes);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (document.activeElement.tagName === 'INPUT') return;

      const selectedNode = nodes.find((n) => n.selected);
      if (!selectedNode) return;

      if (e.key === 'Enter') {
        // 수정된 부분 [2026-07-16]: 고정 위치 대신 형제 수 기반 배치
        const newNode = {
          id: crypto.randomUUID(),
          position: getNewChildPosition(selectedNode.id, selectedNode.position, nodes),
          data: {
            label: '내용을 입력하세요',
            parentId: selectedNode.id,
            depth: selectedNode.data.depth + 1,
            ...(selectedNode.data.color ? { color: selectedNode.data.color } : {}),
          },
          type: 'mapNode',
        };
        setNodes((nds) => [...nds, newNode]);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // 추가: 루트(depth 0) 삭제 시도 → 개별삭제 대신 "전체 삭제" 트리거
        if (selectedNode.data.depth === 0) {
          const ok = await confirm(
            `최상위 노드는 삭제할 수 없습니다.\n대신 루트를 제외한 모든 노드를 삭제할까요?\n(총 ${nodes.length - 1}개)`
          );
          if (ok) clearNodes();  // 스토어 clearNodes 필요 — 아래 주의
          return;
        }
        const idsToDelete = [
          selectedNode.id,
          ...getDescendantIds(selectedNode.id, nodes),
        ];
        const ok = await confirm(
          `이 노드를 삭제하시겠습니까?\n(총 ${idsToDelete.length} 개의 노드가 삭제됩니다.)`
        );
        if (!ok) return;
        setNodes((nds) => nds.filter((n) => !idsToDelete.includes(n.id)));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, setNodes]);

  // 드래그 시작 시점의 부모 position 저장
  const dragStartPositionRef = useRef(null);

  const handleNodeDragStart = (e, node) => {
    dragStartPositionRef.current = { ...node.position };
  };

  const handleNodeDrag = (e, node) => {
    if (!dragStartPositionRef.current) return; // null이면 안함(안움직이면)

    const movedX = node.position.x - dragStartPositionRef.current.x;
    const movedY = node.position.y - dragStartPositionRef.current.y;

    // 자손 ids 목록
    const childrenIds = getDescendantIds(node.id, nodes);

    // 자손 노드들의 id 업데이트
    setNodes((nodes) =>
      nodes.map((node) => {
        if (childrenIds.includes(node.id)) {
          return {
            ...node,
            position: {
              x: node.position.x + movedX,
              y: node.position.y + movedY,
            },

          };
        }
        return node;
      })
    );

    dragStartPositionRef.current = { ...node.position };
  };

  return (
    <div
      style={{
        height: '100%', // 부모(.mm-canvas)를 꽉 채움
        width: '100%',
      }}
    >
      <MindMapNodesProvider setNodes={setNodes} nodes={nodes}>
<ReactFlow
          nodesConnectable={false}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeDrag={handleNodeDrag}
          onNodeDragStart={handleNodeDragStart}
          fitView
          fitViewOptions={{ maxZoom: 1 }}
          colorMode="light"
          panOnDrag={tool === 'select' ? [1, 2] : true}
          selectionOnDrag={tool === 'select'}
          deleteKeyCode={null}
          defaultEdgeOptions={{
            style: { strokeWidth: 2 },
          }}
        >
          {/* <Background /> */}
        </ReactFlow>
      </MindMapNodesProvider>
    </div>
  );
}
