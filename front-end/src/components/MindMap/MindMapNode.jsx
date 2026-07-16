import { useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useNodeActions } from '../../hooks/useNodeActions';
import { nodeStyle, chipColors, nodeDefaultTextColor, DEFAULT_NODE_COLOR } from '../../utils/nodeColor';

import './MindMapNode.css';

const MindMapNode = (props) => {
  const { id, data, selected } = props;
  const position = { x: props.positionAbsoluteX, y: props.positionAbsoluteY };
  const [isEditing, setIsEditing] = useState(false);
  const [labelDraft, setLabelDraft] = useState(data.label);
  const inputRef = useRef(null);
  const customStyle = nodeStyle(data.color || DEFAULT_NODE_COLOR, data.depth);

  // 편집 모드로 들어가는 순간(더블클릭) input에 실제로 포커스를 줌
  // (이게 없으면 input은 화면에 보이기만 하고, 실제 키보드 입력은 다른 곳으로 감)
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const isRoot = data.depth === 0;
  const depthClass = data.depth <= 2 ? `depth-${data.depth}` : 'depth-default';

  const { handleLabelChange, handleAddNode, handleDeleteNode } = useNodeActions(
    id,
    data,
    position
  );

  const startEditing = () => {
    setLabelDraft(data.label);
    setIsEditing(true);
  };

  const finishEditing = () => {
    const trimmed = labelDraft.trim();
    handleLabelChange(trimmed || data.label);
    setIsEditing(false);
  };

  return (
    <div
      className={`mm-map-node ${depthClass} ${isRoot ? 'is-root' : ''} ${selected ? 'selected' : ''}`}
      style={customStyle}   // background + border + color 통째로
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, top: '50%', left: '50%' }}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          value={labelDraft}
          onChange={(e) => setLabelDraft(e.target.value)}
          onBlur={finishEditing}
          onKeyDown={(e) => e.key === 'Enter' && finishEditing()}
          onFocus={(e) => e.target.select()}
          maxLength={50}
          className="mm-node-input nodrag"
          style={{
            width: `${Math.max(labelDraft.length * 1.8, 3)}ch`,
            color: customStyle.color,
          }}
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

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, top: '50%', left: '50%' }}
      />

      {data.keywords?.length > 0 && (
        <div className="mm-node-keywords">
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

      <div className="mm-node-actions-wrap">
        <div className="mm-node-actions">
          <button className="mm-node-action-btn" onClick={handleDeleteNode}>
            -
          </button>
          <button className="mm-node-action-btn" onClick={handleAddNode}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};



export default MindMapNode;
