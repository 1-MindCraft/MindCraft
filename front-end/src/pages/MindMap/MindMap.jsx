import React, { useState, useCallback } from 'react';
import './MindMap.css';
import useMindMapStore from '../../zustand/mindMapStore';

import MindMapHeader from '../../components/MindMap/MindMapHeader';
import MindMapToolbar from '../../components/MindMap/MindMapToolbar';
import MindMapSidebar from '../../components/MindMap/MindMapSidebar';
import MindMapCanvas from '../../components/MindMap/MindMapCanvas';

function MindMapPage({ userName = '사용자' }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveMindMap = useMindMapStore((state) => state.saveMindMap);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await saveMindMap();
      setLastSaved(new Date());
    } catch (error) {
      console.log('저장 실패: ', error.response?.data || error);
      alert(error.response?.data?.error || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, saveMindMap]);

  return (
    <div className="mm-page">
      <MindMapHeader userName={userName} />

      <div className="mm-body">
        <MindMapSidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="mm-main">
          <MindMapToolbar
            isSaving={isSaving}
            lastSaved={lastSaved}
            onSave={handleSave}
          />
          <MindMapCanvas isSaving={isSaving} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}

export default MindMapPage;
