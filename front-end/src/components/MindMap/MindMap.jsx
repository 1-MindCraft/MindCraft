import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
} from '@xyflow/react';
import MindMapNode from './MindMapNode';
import { initialNodes as dummyInitialNodes } from '../../data/dummyData';
import { getDescendantIds, buildEdgesFromNodes } from '../../utils/mindmapTree';
import { MindMapNodesProvider } from '../../context/MindMapNodesContext';

const nodeTypes = {
  mapNode: MindMapNode,
};

// initialData: 부모(페이지)가 들고 있는 flat 노드 배열 (dummyData 기반, 사이드바와 공유)
// onNodesUpdate: 노드가 바뀔 때마다 부모로 최신 노드 배열을 올려보내는 콜백 (사이드바 동기화용)
// tool: 'drag'(빈 캔버스를 드래그하면 화면 이동) | 'select'(빈 캔버스를 드래그하면 다중 선택)
export default function MindMap({ initialData, onNodesUpdate, tool = 'drag' }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialData && initialData.length > 0 ? initialData : dummyInitialNodes
  );

  // 캔버스 내부에서 방금 자기 자신이 바꾼 값인지 구분하기 위한 ref
  // (이 ref와 다른 initialData가 들어오면 "바깥(사이드바 등)에서 바뀐 것"으로 간주하고 반영함)
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  // 사이드바처럼 캔버스 바깥에서 nodes가 바뀐 경우, 캔버스 내부 state에도 반영
  useEffect(() => {
    if (initialData && initialData !== nodesRef.current) {
      setNodes(initialData);
    }
  }, [initialData, setNodes]);

  // 엣지는 항상 nodes(parentId)로부터 파생시켜서, nodes와 edges가 서로 어긋나지 않게 함
  const edges = useMemo(() => buildEdgesFromNodes(nodes), [nodes]);

  // 노드가 바뀔 때마다 부모(페이지)로 최신 상태를 올려서 사이드바와 동기화
  useEffect(() => {
    onNodesUpdate?.(nodes);
  }, [nodes, onNodesUpdate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT') return;

      const selectedNode = nodes.find((n) => n.selected);
      if (!selectedNode) return;

      if (e.key === 'Enter') {
        // 노드 추가
        const newNode = {
          id: crypto.randomUUID(),
          position: {
            x: selectedNode.position.x + 100,
            y: selectedNode.position.y + 200,
          },
          data: {
            label: '내용을 입력하세요',
            parentId: selectedNode.id,
            depth: selectedNode.data.depth + 1,
          },
          type: 'mapNode',
        };
        setNodes((nds) => [...nds, newNode]);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const idsToDelete = [
          selectedNode.id,
          ...getDescendantIds(selectedNode.id, nodes),
        ];
        if (
          !confirm(
            `이 노드를 삭제하시겠습니까?\n(총 ${idsToDelete.length} 개의 노드가 삭제됩니다.)`
          )
        )
          return;
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
          defaultEdgeOptions={{
            style: { strokeWidth: 2 },
          }}
        >
          <Background />
        </ReactFlow>
      </MindMapNodesProvider>
    </div>
  );
}