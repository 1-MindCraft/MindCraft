// 노드 관련 이벤트 핸들러 함수모음

// hooks/useNodeActions.js
import { useCallback } from 'react';
import { useMindMapNodes } from '../context/MindMapNodesContext';
import { getDescendantIds } from '../utils/mindmapTree';

export function useNodeActions(id, data, position) {
  // useReactFlow() 대신, 캔버스가 실제로 들고 있는 외부 nodes state를 직접 갱신
  // (사이드바와 항상 같은 데이터를 보게 하기 위함)
  const { setNodes, getNodes } = useMindMapNodes();

  const handleLabelChange = useCallback(
    (newLabel) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const handleAddNode = useCallback(() => {
    const siblings = getNodes().filter((node) => node.data.parentId === id);
    const siblingIndex = siblings.length;

    const SPACING = 160; // 형제간 간격

    const offsetX =
      (siblingIndex - Math.floor(siblingIndex / 2)) *
      SPACING *
      (siblingIndex % 2 === 0 ? 1 : -1);

    const newNode = {
      id: crypto.randomUUID(),
      position: {
        x: position.x + offsetX,
        y: position.y + 150,
      },
      data: {
        label: '더블 클릭 후 내용을 입력하세요',
        parentId: id,
        depth: data.depth + 1,
      },
      type: 'mapNode',
    };

    // 엣지는 nodes(parentId)에서 자동으로 파생되므로 별도로 추가하지 않음
    setNodes((nds) => [...nds, newNode]);
  }, [id, data.depth, position.x, position.y, setNodes]);

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
  }, [id, setNodes, getNodes]);

  return { handleLabelChange, handleAddNode, handleDeleteNode };
}
