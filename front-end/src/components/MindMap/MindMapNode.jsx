import { useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useNodeActions } from '../../hooks/useNodeActions';
import { nodeStyle, chipColors, DEFAULT_NODE_COLOR, NODE_COLOR_OPTIONS } from '../../utils/nodeColor';
import './MindMapNode.css';

const MindMapNode = (props) => {
  const { id, data, selected } = props;
  const position = { x: props.positionAbsoluteX, y: props.positionAbsoluteY };
  const [isEditing, setIsEditing] = useState(false);
  const [labelDraft, setLabelDraft] = useState(data.label);
  const inputRef = useRef(null);

  // 색 없어도 기본 파랑으로 nodeStyle 적용 (모든 노드 테두리+틴트 통일)
  const customStyle = nodeStyle(data.color || DEFAULT_NODE_COLOR, data.depth);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const isRoot = data.depth === 0;
  const depthClass = data.depth <= 2 ? `depth-${data.depth}` : 'depth-default';

  const {
    handleLabelChange,
    handleColorChange,
    handleAddNode,
    handleDeleteNode,
  } = useNodeActions(id, data, position);

  const startEditing = () => {
    setLabelDraft(data.label);
    setIsEditing(true);
  };

  const finishEditing = () => {
    const trimmed = labelDraft.trim();
    handleLabelChange(trimmed || data.label);
    setIsEditing(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') finishEditing();
    else if (e.key === 'Escape') {
      setLabelDraft(data.label);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`mm-map-node ${depthClass} ${isRoot ? 'is-root' : ''} ${selected ? 'selected' : ''}`}
      style={customStyle}
    >
      <Handle type="target" position={Position.Top} className="mm-node-handle"
        style={{ opacity: 0, top: '50%', left: '50%' }}
      />

      <div className="mm-node-main">
        <div className="mm-node-content">
          {isEditing ? (
            <input
              ref={inputRef}
              value={labelDraft}
              onChange={(e) => setLabelDraft(e.target.value)}
              onBlur={finishEditing}
              onKeyDown={handleInputKeyDown}
              maxLength={50}
              className="mm-node-input nodrag"
              style={{ color: customStyle.color }}
            />
          ) : (
            <div
              onDoubleClick={startEditing}
              className="mm-node-label"
              style={{ color: customStyle.color }}
            >
              {data.label}
            </div>
          )}

          {data.keywords?.length > 0 && (
            <div className="mm-node-keywords" aria-label="AI 추출 키워드">
              {data.keywords.map((kw) => {
                const chipStyle = chipColors(data.color || DEFAULT_NODE_COLOR, data.depth);
                return (
                  <span key={kw} className="mm-node-keyword-chip" style={chipStyle}>
                    {kw}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="mm-node-handle"
        style={{ opacity: 0, top: '50%', left: '50%' }}
      />

      {/* 노드 팝오버 — selected일 때 CSS로 표시됨 (바깥클릭=selected 해제로 자동 닫힘) */}
      <div
        className="mm-node-toolbar nodrag nopan"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="mm-node-action-btn mm-node-action-delete nodrag"
          onClick={handleDeleteNode}
          aria-label="노드 삭제"
          title="노드 삭제"
        >
          {/* 휴지통 아이콘 (인라인 SVG — lucide 대체) */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          </svg>
        </button>

        <span className="mm-node-toolbar-divider" aria-hidden="true" />

        <div className="mm-node-color-swatches" aria-label="노드 색상">
          {NODE_COLOR_OPTIONS.map((color) => {
            const isDefault = color.value === null;
            const isActive = isDefault ? !data.color : data.color === color.value;
            return (
              <button
                key={color.label}
                type="button"
                className={`mm-node-color-swatch ${isDefault ? 'is-default' : ''} ${isActive ? 'is-active' : ''}`}
                style={color.value ? { '--swatch-color': color.value } : undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorChange(color.value);
                }}
                aria-label={`${color.label}으로 변경`}
                aria-pressed={isActive}
                title={color.label}
              />
            );
          })}
        </div>

        <span className="mm-node-toolbar-divider" aria-hidden="true" />

        <button
          type="button"
          className="mm-node-action-btn mm-node-action-add nodrag"
          onClick={handleAddNode}
          aria-label="자식 노드 추가"
          title="자식 노드 추가"
        >
          {/* + 아이콘 (인라인 SVG) */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MindMapNode;