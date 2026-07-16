import { nodeBackground } from './nodeColor';

// 마인드맵 노드 트리 순회 함수
// 자손 id 배열 구하기
export const getDescendantIds = (id, nodes) => {
  // parentId가 id와 같은거 찾기
  const children = nodes.filter((node) => node.data.parentId === id);
  // 찾은 배열에 계속 더해가야함
  return children.reduce(
    (ids, child) => [...ids, child.id, ...getDescendantIds(child.id, nodes)],
    []
  );
};

// 새 자식 노드의 위치 계산
// 부모의 기존 자식 수를 세서, 부모 아래에 좌우로 번갈아 펼쳐 배치함
// (0번째=부모 바로 아래, 1번째=오른쪽, 2번째=왼쪽, 3번째=더 오른쪽...)
export const getNewChildPosition = (parentId, parentPosition, nodes) => {
  const siblingCount = nodes.filter((n) => n.data?.parentId === parentId).length;
  const SPREAD = 220; // 형제 간 좌우 간격(px)
  const DOWN = 180;   // 부모로부터 아래 거리(px)

  // 순번을 좌우 번갈아 오프셋으로 변환: 0->0, 1->+1, 2->-1, 3->+2, 4->-2 ...
  const step = Math.ceil(siblingCount / 2);
  const dir = siblingCount % 2 === 0 ? 1 : -1;
  const offsetX = siblingCount === 0 ? 0 : dir * step * SPREAD;

  return {
    x: parentPosition.x + offsetX,
    y: parentPosition.y + DOWN,
  };
};

// nodes(parentId 기반 flat 배열)로부터 React Flow 엣지를 파생시켜서 만듦
// (엣지를 별도 state로 관리하지 않고 항상 nodes에서 계산 → nodes와 엣지가 어긋날 일이 없음)
export const buildEdgesFromNodes = (nodes) => {
  return nodes
    .filter((node) => node.data?.parentId)
    .map((node) => {
      // 엣지 색 = 자식(타겟) 노드의 색
      // 이유: 노드와 그 노드로 들어오는 연결선을 같은 색으로 -> 색 바꿔도 연결 파악 쉬움
      // 노드 배경색과 똑같은 규칙으로 계산해서 색을 맞춤
      const color = node.data?.color;
      const stroke = color ? nodeBackground(color, node.data?.depth ?? 0) : null;

      return {
        id: `${node.data.parentId}-${node.id}`,
        source: node.data.parentId,
        target: node.id,
        // color 있을 때만 style 추가, 없으면 React Flow 기본 회색 선 유지
        ...(stroke ? { style: { stroke, strokeWidth: 2 } } : {}),
      };
    });
};

// flat 노드 배열(parentId 기반)을 사이드바에서 쓰는 부모-자식 중첩 트리
// ({ id, label, isRoot, children }) 형태로 변환
export const buildTreeFromNodes = (nodes) => {
  const nodeMap = new Map();

  nodes.forEach((node) => {
    nodeMap.set(node.id, {
      id: node.id,
      label: node.data?.label ?? '',
      isRoot: node.data?.parentId === null || node.data?.parentId === undefined,
      children: [],
    });
  });

  

  const roots = [];

  nodes.forEach((node) => {
    const treeNode = nodeMap.get(node.id);
    const parentId = node.data?.parentId;
    if (parentId != null && nodeMap.has(parentId)) {
      nodeMap.get(parentId).children.push(treeNode);
    } else {
      roots.push(treeNode);
    }
  });

  // 자식이 없는 노드는 children을 지워서, 사이드바 트리 렌더링(리프 노드 처리) 방식과 그대로 호환되게 함
  const stripEmptyChildren = (node) => {
    if (node.children.length === 0) {
      delete node.children;
    } else {
      node.children.forEach(stripEmptyChildren);
    }
    return node;
  };

  return roots.map(stripEmptyChildren);
};