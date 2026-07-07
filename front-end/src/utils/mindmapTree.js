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

// nodes(parentId 기반 flat 배열)로부터 React Flow 엣지를 파생시켜서 만듦
// (엣지를 별도 state로 관리하지 않고 항상 nodes에서 계산 → nodes와 엣지가 어긋날 일이 없음)
export const buildEdgesFromNodes = (nodes) => {
  return nodes
    .filter((node) => node.data?.parentId)
    .map((node) => ({
      id: `${node.data.parentId}-${node.id}`,
      source: node.data.parentId,
      target: node.id,
    }));
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
