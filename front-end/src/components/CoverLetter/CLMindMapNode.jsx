// 추가된 부분: 이 파일 전체가 새로 추가된 파일입니다 (원래는 없었음)
// 이유: 기존 MindMapNode.jsx를 그대로 재사용하면 편집(더블클릭)/추가·삭제(+,- 버튼) 기능까지
// 같이 따라오는데, CoverLetter 페이지는 "보기만" 해야 해서 그 기능들이 아예 없는
// 별도의 읽기 전용 노드 컴포넌트가 필요했습니다.
import React from 'react';
import { Handle, Position } from '@xyflow/react';

//   유틸을 공유하므로 편집/자소서 두 화면의 색 규칙이 항상 일치함
import { nodeBackground, nodeTextColor } from '../../utils/nodeColor';
import '../MindMap/MindMapNode.css';


// CLMindMapNode
// CoverLetter 페이지 왼쪽 마인드맵 미리보기 패널에서 쓰는 "읽기 전용" 노드입니다.
//
// components/MindMap/MindMapNode.jsx(편집 화면용 노드)와 다른 점:
// - 더블클릭해도 편집 모드로 안 들어감 (input이 아예 없음)
// - 호버해도 +(자식 추가) / -(삭제) 버튼이 안 뜸 (그런 버튼 자체가 없음)
// - useNodeActions 같은 노드를 바꾸는 훅을 전혀 안 씀 
// 이 파일만 봐서는 nodes 데이터를 바꿀 방법이 없다는 걸 코드로 보장하는 셈입니다.
//
// 즉 같은 모양으로 보여주기만 하는 순수 표시용 컴포넌트라서, 이름도 일부러
// MindMapNode가 아니라 CLMindMapNode(CL = CoverLetter)로 구분했습니다.

function CLMindMapNode({ data }) {
  // depth 0(뿌리) 여부 — 뿌리 노드는 MindMapNode.css의 .is-root 스타일(더 큰 폰트/여백)을 받음
  const isRoot = data.depth === 0;

  // depth별 배경색 클래스. 0~2단계까지는 depth-0/1/2, 그보다 깊으면 depth-default로 통일
  // (MindMapNode.css에 정의된 것과 동일한 규칙 — 편집 화면과 색이 똑같이 보이게 하기 위함)
  const depthClass = data.depth <= 2 ? `depth-${data.depth}` : 'depth-default';

    // 추가: RAG 하이라이트 (selected → 네온, context → 보통, dimmed → 흐리게)
  const highlightClass = data.highlight ? `hl-${data.highlight}` : '';

  const customStyle = data.color
    ? {
        background: nodeBackground(data.color, data.depth),
        color: nodeTextColor(data.color, data.depth),
      }
    : undefined;

  return (
    // className 조합은 편집 화면의 MindMapNode.jsx와 동일하게 맞춰서,
    // 같은 MindMapNode.css를 그대로 재사용해도 스타일이 어긋나지 않게 함
    <div
      className={`mm-map-node ${depthClass} ${isRoot ? 'is-root' : ''} ${highlightClass}`}
      style={customStyle ? { background: customStyle.background } : undefined}
    >
      {/* Handle: React Flow가 엣지(부모-자식 연결선)를 그리기 위한 연결점.
          opacity: 0으로 화면엔 안 보이게 하되, 엣지 계산 자체는 정상 동작하게 둠 */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />

      {/* 라벨만 표시 — 클릭/더블클릭 핸들러 자체가 없어서 눌러도 아무 일도 안 일어남 */}
      <div
        className="mm-node-label"
        style={customStyle ? { color: customStyle.color } : undefined}
      >
        {data.label}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

export default CLMindMapNode;