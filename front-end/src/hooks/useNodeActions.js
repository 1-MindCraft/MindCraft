// 노드 관련 이벤트 핸들러 함수모음

// hooks/useNodeActions.js
import { useCallback } from 'react';
import { useMindMapNodes } from '../context/MindMapNodesContext';
import { getDescendantIds, getNewChildPosition } from '../utils/mindmapTree';
import { useModal } from '../components/common/ModalProvider';
import useMindMapStore from '../zustand/mindMapStore';

export function useNodeActions(id, data, position) {
  // useReactFlow() 대신, 캔버스가 실제로 들고 있는 외부 nodes state를 직접 갱신
  // (사이드바와 항상 같은 데이터를 보게 하기 위함)
  const { setNodes, getNodes } = useMindMapNodes();
  const { confirm } = useModal(); // 수정된 부분: 브라우저 기본 confirm() 대신 커스텀 모달 사용
  const clearNodes = useMindMapStore((state) => state.clearNodes);
  
  const handleLabelChange = useCallback(
    (label) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const handleAddNode = useCallback(() => {
    const nodes = getNodes();  // 현재 전체 노드 (형제 수 세기용)
    const position2 = getNewChildPosition(id, position, nodes);

    const newNode = {
      id: crypto.randomUUID(),
      position: position2,
      data: {
        label: '더블 클릭 후 내용을 입력하세요',
        parentId: id,
        depth: data.depth + 1,
        ...(data.color ? { color: data.color } : {}),
      },
      type: 'mapNode',
    };
    setNodes((nds) => [...nds, newNode]);
  }, [id, data.depth, data.color, position, getNodes, setNodes]);

  const handleDeleteNode = useCallback(async () => {
    // 루트(depth 0)면 개별삭제 막고 전체삭제로 전환
    if (data.depth === 0) {
      const nodes = getNodes();
      const ok = await confirm(
        `최상위 노드는 삭제할 수 없습니다.\n대신 루트를 제외한 모든 노드를 삭제할까요?\n(총 ${nodes.length - 1}개)`
      );
      if (ok) clearNodes();
      return;
    }

    const nodes = getNodes();
    const idsToDelete = [id, ...getDescendantIds(id, nodes)];
    const ok = await confirm(
      `이 노드를 삭제하시겠습니까?\n(총 ${idsToDelete.length} 개의 노드가 삭제됩니다.)`
    );
    if (!ok) return false;
    setNodes((nodes) => nodes.filter((node) => !idsToDelete.includes(node.id)));
  }, [id, data.depth, setNodes, getNodes, confirm, clearNodes]);

  return { handleLabelChange, handleAddNode, handleDeleteNode };
}