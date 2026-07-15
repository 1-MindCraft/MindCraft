import React, { useState, useMemo } from 'react';
import { buildTreeFromNodes } from '../../utils/mindmapTree';

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

function NodeTree({ nodes, depth = 0, query = '', onDeleteNode }) {
  const [collapsed, setCollapsed] = useState({});
  const toggle = (id) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <ul className="mm-node-tree" style={{ paddingLeft: depth === 0 ? 0 : '1rem' }}>
      {nodes.map((node) => {
        const isCollapsed = query ? false : (collapsed[node.id] ?? false);
        return (
          <li key={node.id}>
            <div className={`mm-node-item ${node.isRoot ? 'is-root' : ''}`}>
              <div
                className="mm-node-item-main"
                style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: node.children ? 'pointer' : 'default' }}
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
              <button
                className="mm-node-delete-btn"
                title="노드 삭제"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNode?.(node.id);
                }}
              >
                ✕
              </button>
            </div>
            {node.children && !isCollapsed && (
              <NodeTree nodes={node.children} depth={depth + 1} query={query} onDeleteNode={onDeleteNode} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

// nodes: 캔버스(마인드맵)와 동일한 소스(부모-자식 flat 배열, parentId 기반)
// 캔버스에서 노드를 추가/삭제/수정하면 nodes prop이 갱신되고, 트리도 함께 동기화됨
// onDeleteNode: 사이드바에서 노드를 지울 때 호출 (부모를 지우면 자식도 같이 지워짐)
function MindMapSidebar({ open, onToggle, nodes = [], onDeleteNode }) {
  const [search, setSearch] = useState('');

  const treeNodes = useMemo(() => buildTreeFromNodes(nodes), [nodes]);

  const filteredNodes = useMemo(
    () => filterTree(treeNodes, search.trim()),
    [treeNodes, search]
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
            ? <NodeTree nodes={filteredNodes} query={search.trim()} onDeleteNode={onDeleteNode} />
            : <p className="mm-no-result">검색 결과가 없어요</p>
          }
        </div>

        {/* 수정된 부분: "+ 노드 추가" 버튼을 여기서 삭제함
            이유: onClick이 아예 연결되어 있지 않아 눌러도 아무 동작도 안 하던 죽은 버튼이었고,
            삭제해달라는 요청이 있어서 삭제 */}
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