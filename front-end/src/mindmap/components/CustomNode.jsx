import { lazy, useCallback, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { getDescendantIds } from '../../utils/mindmapTree';
import {
  DEPTH_COLORS,
  DEPTH_TEXT_COLORS,
  DEPTH_RING_COLORS,
  DEFAULT_BG_COLOR,
  DEFAULT_TEXT_COLOR,
  DEFAULT_RING_COLOR,
} from '../../constants/nodeColor';

const MindMapNode = (props) => {
  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();
  const { id, data, selected } = props;

  const bgColor = DEPTH_COLORS[data.depth] || DEFAULT_BG_COLOR;
  const textColor = DEPTH_TEXT_COLORS[data.depth] || DEFAULT_TEXT_COLOR;
  const ringColor = DEPTH_RING_COLORS[data.depth] || DEFAULT_RING_COLOR;

  const [isEditing, setIsEditing] = useState(false);

  const onChange = useCallback(
    (e) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, label: e.target.value } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const handleAddNode = useCallback(() => {
    // 버튼 클릭 시
    console.log(id);

    // 새로운 노드 객체를 만들고
    const newNode = {
      id: crypto.randomUUID(),
      position: {
        x: props.positionAbsoluteX + 100,
        y: props.positionAbsoluteY + 200,
      },
      data: {
        label: '내용을 입력하세요',
        parentId: id,
        depth: data.depth + 1,
      },
      type: 'mapNode',
      selected: true,
    };
    console.log(newNode);

    // 기존의 노드에 새 노드 합치기 + 선택 해제
    setNodes((nodes) => [...nodes, newNode]);

    // 새로운 엣지를 만들고
    const newEdge = {
      id: `${id}-${newNode.id}`,
      source: `${id}`,
      target: `${newNode.id}`,
    };

    // 기존의 엣지에 새 엣지 합치기
    setEdges((edges) => [...edges, newEdge]);
  }, [id, setNodes, setEdges]);

  // 노드 삭제 이벤트
  const handleDeleteNode = useCallback(() => {
    const nodes = getNodes();

    // 1. getDescendantIds(id, nodes) → 자손 id 배열 (개수 = .length)
    // 2. idsToDelete = [id, ...자손id들]
    const idsToDelete = [id, ...getDescendantIds(id, nodes)];
    console.log(idsToDelete);

    // 3. confirm 메시지에 자손 개수 사용
    if (
      !confirm(
        `이 노드를 삭제하시겠습니까?\n(총 ${idsToDelete.length} 개의 노드가 삭제됩니다.)`
      )
    ) {
      return false;
    }

    // 4. 수락하면 setNodes(nodes.filter(n => !idsToDelete.includes(n.id)))
    setNodes((nodes) => nodes.filter((node) => !idsToDelete.includes(node.id)));

    // 5. edges도 마찬가지로 source/target이 idsToDelete에 포함되면 제거
    setEdges((edges) =>
      edges.filter(
        (edge) =>
          !(
            idsToDelete.includes(edge.source) ||
            idsToDelete.includes(edge.target)
          )
      )
    );
  }, [id, setNodes, setEdges, getNodes]);

  const isRoot = data.depth === 0;

  useEffect(() => {
    if (!selected || isEditing) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleAddNode();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteNode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, handleAddNode, handleDeleteNode, isEditing]);

  return (
    <div
      className={`${bgColor} rounded-2xl ${isRoot ? 'px-8 py-6' : 'px-6 py-3'} shadow-md group relative flex flex-col items-center ring-0 hover:ring-4 ${ringColor} transition-all duration-200 ${selected ? `ring-4 ${ringColor}` : `ring-0 hover:ring-4 ${ringColor}`}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, top: '50%', left: '50%' }}
      />
      {isEditing ? (
        <input
          value={data.label}
          onChange={onChange}
          onBlur={() => setIsEditing(false)} // 다른 곳 클릭하면 수정 종료
          autoFocus // 입력 모드 진입 시 자동 focus
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
