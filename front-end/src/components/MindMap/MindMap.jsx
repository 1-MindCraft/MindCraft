import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  // useNodesState,
  // useEdgesState,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import MindMapNode from './MindMapNode';
import { getDescendantIds } from '../../utils/mindmapTree';
import { useRef } from 'react';
// import { getMindMap } from '../../axios/mindMapApi';
import useMindMapStore from '../../zustand/mindMapStore';

const nodeTypes = {
  mapNode: MindMapNode,
};

export default function MindMap() {
  // const [nodes, setNodes, onNodesChange] = useNodesState([]);
  // const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodes = useMindMapStore((state) => state.nodes);
  const edges = useMindMapStore((state) => state.edges);
  const setNodes = useMindMapStore((state) => state.setNodes);
  const setEdges = useMindMapStore((state) => state.setEdges);
  const fetchMindMap = useMindMapStore((state) => state.fetchMindMap);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

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
        setEdges((eds) => [
          ...eds,
          {
            id: `${selectedNode.id}-${newNode.id}`,
            source: selectedNode.id,
            target: newNode.id,
          },
        ]);
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
        setEdges((eds) =>
          eds.filter(
            (ed) =>
              !idsToDelete.includes(ed.source) &&
              !idsToDelete.includes(ed.target)
          )
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, setNodes, setEdges]);

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

  useEffect(() => {
    // const fetchMindMap = async () => {
    //   try {
    //     const rdata = await getMindMap();
    //     const parsedNodes = JSON.parse(rdata.nodes).map((node) => ({
    //       ...node,
    //       type: 'mapNode',
    //     }));

    //     console.log(rdata);

    //     const parsedEdges = parsedNodes
    //       .filter((node) => node.data.parentId)
    //       .map((node) => ({
    //         id: `${node.data.parentId}-${node.id}`,
    //         source: node.data.parentId,
    //         target: node.id,
    //       }));
    //     setNodes(parsedNodes);
    //     setEdges(parsedEdges);
    //   } catch (error) {
    //     console.log('get MindMap 실패: ', error.response?.data || error);
    //     alert(error.response?.data?.error || '마인드맵을 불러오지 못했습니다.');
    //   }
    // };

    // fetchMindMap();

    fetchMindMap().catch(() => {
      alert('마인드맵을 불러오지 못했습니다.');
    });
  }, []);

  return (
    <div
      style={{
        height: '500px', // 고정 높이
        width: '1800px', // 고정 너비
        border: '1px solid #ddd', // 캔버스 경계 표시
        margin: '0 auto', // 가운데 정렬
      }}
    >
      <ReactFlow
        nodesConnectable={false}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDrag={handleNodeDrag}
        onNodeDragStart={handleNodeDragStart}
        fitView
        colorMode="system"
        defaultEdgeOptions={{
          style: { strokeWidth: 2 },
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
