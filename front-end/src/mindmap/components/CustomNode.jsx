import { useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';

const MindMapNode = ({ data }) => {
  const onChange = useCallback((e) => {
    console.log(e.target.value);
  });

  return (
    <div className="bg-blue-500 rounded-xl px-4 py-2 shadow-md border border-gray-200">
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, top: '50%', left: '50%' }}
      />
      <input value={data.label} onChange={onChange} />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ opacity: 0, top: '50%', left: '50%' }}
      />
    </div>
  );
};

export default MindMapNode;
