import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import MindMapNode from './CustomNode';
import { initialEdges, initialNodes } from '../../data/dummyData';

const nodeTypes = {
  mapNode: MindMapNode,
};

export default function MindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div
      style={{
        height: '600px', // 고정 높이
        width: '900px', // 고정 너비
        border: '1px solid #ddd', // 캔버스 경계 표시
        margin: '0 auto', // 가운데 정렬
      }}
    >
      <ReactFlow
        nodesConnectable={false}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        colorMode="system"
        defaultEdgeOptions={{
          style: { strokeWidth: 2 },
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
