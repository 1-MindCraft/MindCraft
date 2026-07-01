// 노드 관련 이벤트 핸들러 함수모음

// hooks/useNodeActions.js
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { getDescendantIds } from '../utils/mindmapTree';

export function useNodeActions(id, data, position) {
  const { setNodes, setEdges, getNodes } = useReactFlow();

  const handleLabelChange = useCallback(
    (e) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: e.target.value } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const handleAddNode = useCallback(() => {
    const newNode = {
      id: crypto.randomUUID(),
      position: {
        x: position.x + 100,
        y: position.y + 200,
      },
      data: {
        label: '더블 클릭 후 내용을 입력하세요',
        parentId: id,
        depth: data.depth + 1,
      },
      type: 'mapNode',
    };

    setNodes((nds) => [...nds, newNode]);

    const newEdge = {
      id: `${id}-${newNode.id}`,
      source: `${id}`,
      target: `${newNode.id}`,
    };
    setEdges((edges) => [...edges, newEdge]);
  }, [id, data.depth, position.x, position.y, setNodes, setEdges]);

  const handleDeleteNode = useCallback(() => {
    const nodes = getNodes();
    const idsToDelete = [id, ...getDescendantIds(id, nodes)];

    if (
      !confirm(
        `이 노드를 삭제하시겠습니까?\n(총 ${idsToDelete.length} 개의 노드가 삭제됩니다.)`
      )
    ) {
      return false;
    }

    setNodes((nodes) => nodes.filter((node) => !idsToDelete.includes(node.id)));
    setEdges((edges) =>
      edges.filter(
        (edge) =>
          !(
            idsToDelete.includes(edge.source) ||
            idsToDelete.includes(edge.target)
          )
      )
    );
  }, [id, setNodes, setEdges, getNodes]);

  return { handleLabelChange, handleAddNode, handleDeleteNode };
}
