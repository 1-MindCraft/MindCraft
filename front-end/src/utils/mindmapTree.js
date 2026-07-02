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
