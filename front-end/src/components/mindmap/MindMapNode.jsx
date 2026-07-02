import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useNodeActions } from '../../hooks/useNodeActions';
import {
  DEPTH_COLORS,
  DEPTH_TEXT_COLORS,
  DEPTH_RING_COLORS,
  DEFAULT_BG_COLOR,
  DEFAULT_TEXT_COLOR,
  DEFAULT_RING_COLOR,
} from '../../constants/nodeColor';

const MindMapNode = (props) => {
  const { id, data, selected } = props;
  const position = { x: props.positionAbsoluteX, y: props.positionAbsoluteY };
  const [isEditing, setIsEditing] = useState(false);

  const bgColor = DEPTH_COLORS[data.depth] || DEFAULT_BG_COLOR;
  const textColor = DEPTH_TEXT_COLORS[data.depth] || DEFAULT_TEXT_COLOR;
  const ringColor = DEPTH_RING_COLORS[data.depth] || DEFAULT_RING_COLOR;
  const isRoot = data.depth === 0;

  const { handleLabelChange, handleAddNode, handleDeleteNode } = useNodeActions(
    id,
    data,
    position
  );

  return (
    <div
      className={`${bgColor} rounded-2xl ${isRoot ? 'px-8 py-6' : 'px-6 py-3'} shadow-md group relative flex flex-col items-center transition-all duration-200 ${selected ? `ring-4 ${ringColor}` : `ring-0 hover:ring-4 ${ringColor}`}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, top: '50%', left: '50%' }}
      />

      {isEditing ? (
        <input
          value={data.label}
          onChange={handleLabelChange}
          onBlur={() => setIsEditing(false)}
          onFocus={(e) => e.target.select()}
          style={{ width: `${Math.max(data.label.length * 1.8, 3)}ch` }}
          className={`text-center bg-transparent outline-none nodrag ${textColor} ${isRoot ? 'text-2xl font-semibold' : 'text-base'}`}
        />
      ) : (
        <div
          onDoubleClick={() => setIsEditing(true)}
          className={`text-center ${textColor} ${isRoot ? 'text-2xl font-semibold' : 'text-base'}`}
        >
          {data.label}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, top: '50%', left: '50%' }}
      />

      <div className="max-h-0 group-hover:max-h-8 overflow-hidden transition-all duration-300 ease-out w-full">
        <div className="flex justify-between w-full pt-1">
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity delay-100 w-6 h-6 flex items-center justify-center rounded-full bg-white/30 text-sm leading-none"
            onClick={handleDeleteNode}
          >
            -
          </button>
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity delay-100 w-6 h-6 flex items-center justify-center rounded-full bg-white/30 text-sm leading-none"
            onClick={handleAddNode}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default MindMapNode;
