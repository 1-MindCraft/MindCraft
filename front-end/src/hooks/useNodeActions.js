// 노드 관련 이벤트 핸들러 함수모음

// hooks/useNodeActions.js
import { useCallback } from 'react';
import { useMindMapNodes } from '../context/MindMapNodesContext';
import { getDescendantIds } from '../utils/mindmapTree';
import { useModal } from '../components/common/ModalProvider';

export function useNodeActions(id, data, position) {
  // useReactFlow() 대신, 캔버스가 실제로 들고 있는 외부 nodes state를 직접 갱신
  // (사이드바와 항상 같은 데이터를 보게 하기 위함)
  const { setNodes, getNodes } = useMindMapNodes();
  const { confirm } = useModal(); // 수정된 부분: 브라우저 기본 confirm() 대신 커스텀 모달 사용

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

    // 엣지는 nodes(parentId)에서 자동으로 파생되므로 별도로 추가하지 않음
    setNodes((nds) => [...nds, newNode]);
  }, [id, data.depth, position.x, position.y, setNodes]);

  const handleDeleteNode = useCallback(async () => {
    const nodes = getNodes();
    const idsToDelete = [id, ...getDescendantIds(id, nodes)];

    // 수정된 부분: confirm() → await confirm() (커스텀 모달로 교체)
    const ok = await confirm(
      `이 노드를 삭제하시겠습니까?\n(총 ${idsToDelete.length} 개의 노드가 삭제됩니다.)`
    );
    if (!ok) {
      return false;
    }

    setNodes((nodes) => nodes.filter((node) => !idsToDelete.includes(node.id)));
  }, [id, setNodes, getNodes, confirm]);

  return { handleLabelChange, handleAddNode, handleDeleteNode };
}