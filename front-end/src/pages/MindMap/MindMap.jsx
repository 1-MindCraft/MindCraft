import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import './MindMap.css';
import useMindMapStore from '../../zustand/mindMapStore';

import MindMapHeader from '../../components/MindMap/MindMapHeader';
import MindMapToolbar from '../../components/MindMap/MindMapToolbar';
import MindMapSidebar from '../../components/MindMap/MindMapSidebar';
import MindMapCanvas from '../../components/MindMap/MindMapCanvas';
import { getDescendantIds } from '../../utils/mindmapTree';
import { useModal } from '../../components/common/ModalProvider';

const HISTORY_DEBOUNCE_MS = 400; // 드래그 등 연속 변경을 하나의 undo 단위로 묶기 위한 대기 시간

function MindMapPage({ userName = '사용자' }) {
  const { alert, confirm } = useModal(); // 수정된 부분: 브라우저 기본 alert()/confirm() 대신 커스텀 모달 사용
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  // 툴바 "드래그/선택" 도구 상태
  const [tool, setTool] = useState('drag');

  const nodes = useMindMapStore((state) => state.nodes);
  const setNodes = useMindMapStore((state) => state.setNodes);
  const saveMindMap = useMindMapStore((state) => state.saveMindMap);
  const fetchMindMap = useMindMapStore((state) => state.fetchMindMap);

  useEffect(() => {
    fetchMindMap().catch(async () => {
      // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
      await alert('마인드맵을 불러오지 못했습니다.');
    });
  }, [fetchMindMap, alert]);

  // ── 실행 취소(undo) / 다시 실행(redo) ──
  // history는 nodes의 스냅샷 배열. 드래그처럼 짧은 시간에 여러 번 바뀌는 경우를 하나로 묶기 위해 디바운스함
  const historyRef = useRef([nodes]);
  const historyIndexRef = useRef(0);
  const skipNextHistoryPushRef = useRef(false); // undo/redo로 인한 변경은 다시 history에 쌓지 않기 위한 플래그
  const historyTimerRef = useRef(null);
  const [, forceRerender] = useState(0); // undo/redo 버튼 활성화 상태 갱신용

  useEffect(() => {
    if (skipNextHistoryPushRef.current) {
      skipNextHistoryPushRef.current = false;
      return;
    }
    if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
    historyTimerRef.current = setTimeout(() => {
      historyRef.current = [
        ...historyRef.current.slice(0, historyIndexRef.current + 1),
        nodes,
      ];
      historyIndexRef.current = historyRef.current.length - 1;
      forceRerender((v) => v + 1);
    }, HISTORY_DEBOUNCE_MS);

    return () => clearTimeout(historyTimerRef.current);
  }, [nodes]);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    skipNextHistoryPushRef.current = true;
    setNodes(historyRef.current[historyIndexRef.current]);
    forceRerender((v) => v + 1);
  }, [setNodes]);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    skipNextHistoryPushRef.current = true;
    setNodes(historyRef.current[historyIndexRef.current]);
    forceRerender((v) => v + 1);
  }, [setNodes]);

  // 사이드바에서 노드 삭제 버튼을 눌렀을 때: 해당 노드 + 모든 자손을 함께 제거
  // (캔버스의 Delete 키 삭제와 동일한 getDescendantIds 로직을 그대로 재사용)
  const handleDeleteNode = useCallback(
    async (nodeId) => {
      const idsToDelete = [nodeId, ...getDescendantIds(nodeId, nodes)];

      // 수정된 부분: confirm() → await confirm() (커스텀 모달로 교체)
      const ok = await confirm(
        `이 노드를 삭제하시겠습니까?\n(총 ${idsToDelete.length} 개의 노드가 삭제됩니다.)`
      );
      if (!ok) {
        return;
      }

      setNodes((prevNodes) =>
        prevNodes.filter((n) => !idsToDelete.includes(n.id))
      );
    },
    [nodes, setNodes, confirm]
  );

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await saveMindMap();
      setLastSaved(new Date());
    } catch (error) {
      console.log('저장 실패: ', error.response?.data || error);
      // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
      await alert(error.response?.data?.error || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, saveMindMap, alert]);

  return (
    <div className="mm-page">
      <MindMapHeader userName={userName} />

      <div className="mm-body">
        <MindMapSidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
          nodes={nodes}
          onDeleteNode={handleDeleteNode}
        />

        <div className="mm-main">
          <ReactFlowProvider>
            <MindMapToolbar
              isSaving={isSaving}
              lastSaved={lastSaved}
              onSave={handleSave}
              tool={tool}
              onToolChange={setTool}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={handleUndo}
              onRedo={handleRedo}
            />
            <MindMapCanvas
              isSaving={isSaving}
              onSave={handleSave}
              tool={tool}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}

export default MindMapPage;