import React, { useState, useMemo } from 'react';

const SAMPLE_NODES = [
  {
    id: 'root', label: '홍길동', isRoot: true,
    children: [
      {
        id: 'basic', label: '기본 정보',
        children: [
          { id: 'b1', label: '이름: 홍길동' },
          { id: 'b2', label: '출생: 1995년' },
          { id: 'b3', label: '거주지: 서울' },
          { id: 'b4', label: '학력: OO대학교' },
        ],
      },
      {
        id: 'hobby', label: '취미',
        children: [
          { id: 'h1', label: '독서' },
          { id: 'h2', label: '운동' },
          { id: 'h3', label: '음악 감상' },
          { id: 'h4', label: '여행' },
        ],
      },
      {
        id: 'value', label: '가치관',
        children: [
          { id: 'v1', label: '성장' },
          { id: 'v2', label: '도전' },
          { id: 'v3', label: '배려' },
          { id: 'v4', label: '정직' },
        ],
      },
      {
        id: 'char', label: '성격',
        children: [
          { id: 'c1', label: '책임감' },
          { id: 'c2', label: '성실함' },
          { id: 'c3', label: '긍정적' },
          { id: 'c4', label: '의사소통' },
        ],
      },
      {
        id: 'exp', label: '경험',
        children: [
          { id: 'e1', label: '대외활동' },
          { id: 'e2', label: '아르바이트' },
          { id: 'e3', label: '협업 경험' },
          { id: 'e4', label: '프로젝트 경험' },
        ],
      },
    ],
  },
];

// 트리에서 검색어에 매칭되는 노드가 있는지 확인 (부모 포함하여 반환)
function filterTree(nodes, query) {
  if (!query) return nodes;
  
  return nodes.reduce((acc, node) => {
    const matchSelf = node.label.includes(query);
    const filteredChildren = node.children ? filterTree(node.children, query) : [];
    if (matchSelf || filteredChildren.length > 0) {
      acc.push({ ...node, children: filteredChildren.length > 0 ? filteredChildren : node.children?.filter(c => c.label.includes(query)) });
    }
    return acc;
  }, []);
}

// 검색어 하이라이트
function Highlight({ text, query }) {
  if (!query) return <span>{text}</span>;
  const idx = text.indexOf(query);
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="mm-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  );
}

function NodeTree({ nodes, depth = 0, query = '', defaultOpen = false }) {
  const [collapsed, setCollapsed] = useState({});
  const toggle = (id) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <ul className="mm-node-tree" style={{ paddingLeft: depth === 0 ? 0 : '1rem' }}>
      {nodes.map((node) => {
        const isCollapsed = query ? false : (collapsed[node.id] ?? false);
        return (
          <li key={node.id}>
            <div
              className={`mm-node-item ${node.isRoot ? 'is-root' : ''}`}
              onClick={() => node.children && toggle(node.id)}
            >
              {node.children && (
                <span className="mm-node-chevron">{isCollapsed ? '▶' : '▼'}</span>
              )}
              {!node.children && <span className="mm-node-dot">•</span>}
              <span className="mm-node-label">
                <Highlight text={node.label} query={query} />
              </span>
            </div>
            {node.children && !isCollapsed && (
              <NodeTree nodes={node.children} depth={depth + 1} query={query} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function MindMapSidebar({ open, onToggle }) {
  const [search, setSearch] = useState('');

  const filteredNodes = useMemo(
    () => filterTree(SAMPLE_NODES, search.trim()),
    [search]
  );

  const hasResult = filteredNodes.length > 0;

  return (
    <>
      {/* 사이드바 패널 */}
      <aside className={`mm-sidebar ${open ? 'open' : 'closed'}`}>
        <div className="mm-sidebar-header">
          <span className="mm-sidebar-title">노드 목록</span>
          <button className="mm-icon-btn" onClick={onToggle} title="닫기">✕</button>
        </div>

        <div className="mm-sidebar-search">
          <input
            type="text"
            placeholder="노드 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mm-sidebar-tree">
          {hasResult
            ? <NodeTree nodes={filteredNodes} query={search.trim()} />
            : <p className="mm-no-result">검색 결과가 없어요</p>
          }
        </div>

        <button className="mm-sidebar-add">+ 노드 추가</button>
      </aside>

      {/* 토글 버튼 */}
      <button
        className={`mm-sidebar-toggle ${open ? 'open' : ''}`}
        onClick={onToggle}
        title={open ? '사이드바 닫기' : '사이드바 열기'}
      >
        {open ? '◀' : '▶'}
      </button>
    </>
  );
}

export default MindMapSidebar;