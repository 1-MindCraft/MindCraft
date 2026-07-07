import React, { createContext, useContext, useRef } from 'react';

// MindMapNode(개별 노드) 안에서 노드를 추가/삭제/수정할 때,
// React Flow 내부 스토어(useReactFlow)가 아니라 캔버스가 실제로 들고 있는
// 외부 nodes state(=사이드바와 동기화되는 단일 소스)를 직접 갱신하기 위한 컨텍스트
const MindMapNodesContext = createContext(null);

// setNodes: useNodesState의 그 setNodes 그대로 전달
export function MindMapNodesProvider({ setNodes, nodes, children }) {
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes; // 렌더될 때마다 최신 nodes를 ref에 반영 (핸들러에서 최신값 참조용)

  const value = {
    setNodes,
    getNodes: () => nodesRef.current,
  };

  return (
    <MindMapNodesContext.Provider value={value}>
      {children}
    </MindMapNodesContext.Provider>
  );
}

export function useMindMapNodes() {
  const ctx = useContext(MindMapNodesContext);
  if (!ctx) {
    throw new Error(
      'useMindMapNodes은 MindMapNodesProvider 내부에서만 사용할 수 있어요'
    );
  }
  return ctx;
}
