import React, { useEffect, useMemo } from 'react';
// 추가된 부분: useEffect(마운트 시 마인드맵 조회), useMemo(엣지 재계산 최적화)에 필요해서 추가

import { ReactFlow, Background } from '@xyflow/react';
// 추가된 부분: 플레이스홀더 대신 실제 마인드맵 캔버스를 그리기 위해 React Flow 자체를 새로 불러옴

import useMindMapStore from '../../zustand/mindMapStore';
// 추가된 부분: 마인드맵 편집 화면과 같은 데이터(별도 API 호출 없이)를 그대로 읽어오기 위해 추가

import { buildEdgesFromNodes } from '../../utils/mindmapTree';
// 추가된 부분: nodes만 있고 엣지 정보가 따로 없어서, 노드 배열로부터 엣지를 계산해내는 함수가 필요해서 추가

import CLMindMapNode from './CLMindMapNode';
// 추가된 부분: 편집 기능이 있는 MindMapNode를 그대로 쓰면 실수로 편집이 가능해지므로,
// 읽기 전용 전용 노드 컴포넌트를 새로 만들어서 추가

// 추가된 부분: mapNode 타입일 때 CLMindMapNode(읽기 전용 노드)로 렌더링하도록 등록.
// 편집 화면(components/MindMap/MindMap.jsx)의 nodeTypes와 키 이름("mapNode")은
// 반드시 똑같아야 함 — DB에서 내려오는 노드 데이터의 type 값이 'mapNode'로 고정되어 있기 때문
const nodeTypes = { mapNode: CLMindMapNode };

function CLMindMap({ selectedNodeIds, contextNodeIds }) {
  // 추가된 부분: 마인드맵 편집 화면(MindMapPage)이 쓰는 것과 완전히 같은
  // zustand store를 그대로 구독함. 별도 API 호출/상태를 새로 안 만듦.
  const nodes = useMindMapStore((state) => state.nodes);
  const mindMapId = useMindMapStore((state) => state.mindMapId);
  const fetchMindMap = useMindMapStore((state) => state.fetchMindMap);

  // 추가된 부분: 그럴 가능성은 절대 없을거지만 사용자가 /mindmap을 거치지 않고 /coverletter로 바로 들어왔을 수도 있음.
  // 그 경우 store가 비어있는 초기값(mindMapId: null, nodes: [])이라서,
  // 여기서 한 번 조회해서 채워줌. (반대로 /mindmap을 이미 거쳐서 mindMapId가
  // 있는 상태라면 여기서 또 fetch하지 않음 — 편집 중이던 내용을 덮어쓰지 않기 위함)
  useEffect(() => {
    fetchMindMap().catch((err) => console.error('마인드맵 조회 실패:', err));
    // 마운트 시 한 번만 확인하면 되므로 의도적으로 deps를 비워둠
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 추가된 부분: 엣지(부모-자식 연결선)는 nodes의 parentId로부터 매번 새로 계산함.
  // 편집 화면과 똑같은 유틸(buildEdgesFromNodes)을 그대로 재사용해서,
  // "엣지를 그리는 규칙"이 두 화면에서 절대 어긋나지 않도록 함
  const edges = useMemo(() => buildEdgesFromNodes(nodes), [nodes]);

  // 추가: RAG 선별 결과를 노드 data에 주입
  // selected = 직접 선별(네온) / context = 조상(보통) / 나머지 = dim
  const highlightedNodes = useMemo(() => {
    const selectedSet = new Set(selectedNodeIds ?? []);
    const contextSet = new Set(contextNodeIds ?? []);
    const hasResult = selectedSet.size > 0 || contextSet.size > 0;

    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        highlight: !hasResult
          ? undefined              // RAG 결과 없으면 전체 정상 표시
          : selectedSet.has(node.id)
          ? 'selected'
          : contextSet.has(node.id)
          ? 'context'
          : 'dimmed',
      },
    }));
  }, [nodes, selectedNodeIds, contextNodeIds]);

  return (
    <div className="cl-mindmap">
      <div className="cl-mindmap-label">마인드맵</div>

      <div className="cl-mindmap-canvas">
        {/* 추가된 부분: 원래는 이 자리에 "마인드맵 라이브러리 연동 예정" 플레이스홀더만 있었음.
            이제 nodes가 있으면 실제 React Flow를, 없으면 기존 플레이스홀더를 보여주도록 분기함 */}
        {nodes.length > 0 ? (
          // 추가된 부분: 아래 ReactFlow 블록 전체
          // React Flow는 부모 요소의 실제 픽셀 크기를 기준으로 렌더링하므로,
          // width/height를 100%로 명시해서 .cl-mindmap-canvas(flex:1) 영역을 꽉 채움
          <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
              nodes={highlightedNodes}
              edges={edges}
              nodeTypes={nodeTypes}
              // 읽기 전용이라 실제로 상태를 바꿀 필요는 없지만, React Flow가
              // "nodes를 받았는데 onNodesChange가 없다"는 콘솔 경고를 띄우는 걸
              // 막기 위한 빈 함수. (nodesDraggable 등이 꺼져 있어 실제로 호출될 일은 없음)
              onNodesChange={() => {}}
              // 이 세 줄이 "읽기 전용"의 핵심: 드래그로 위치 이동 불가,
              // 노드끼리 새 연결선 생성 불가, 클릭으로 선택(하이라이트)도 불가
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              fitView
              fitViewOptions={{ maxZoom: 1 }} // 노드가 몇 개 안 될 때 지나치게 확대되는 것 방지
              colorMode="light" // 편집 화면과 통일 (OS 다크모드 설정에 안 흔들리게)
            >
              <Background />
            </ReactFlow>
          </div>
        ) : (
          // 기존 그대로: 마인드맵을 아직 안 만들었거나 조회에 실패한 경우의 대체 화면
          // (문구만 "노드가 없어요..."로 살짝 바뀜, 원래는 "마인드맵 라이브러리 연동 예정"이었음)
          <div className="mm-canvas-placeholder">
            <p>마인드맵 캔버스</p>
            <p className="mm-canvas-hint">
              노드가 없어요. 먼저 마인드맵을 작성해보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CLMindMap;