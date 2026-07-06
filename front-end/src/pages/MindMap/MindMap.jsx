import React, { useState, useCallback } from 'react';
import './MindMap.css';

import MindMapHeader from '../../components/MindMap/MindMapHeader';
import MindMapToolbar from '../../components/MindMap/MindMapToolbar';
import MindMapSidebar from '../../components/MindMap/MindMapSidebar';
import MindMapCanvas from '../../components/MindMap/MindMapCanvas';

function MindMapPage({ userName = '사용자' }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    // TODO: 실제 저장 API 호출
    await new Promise((res) => setTimeout(res, 400));
    setLastSaved(new Date());
    setIsSaving(false);
  }, [isSaving]);

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
          <MindMapCanvas
            isSaving={isSaving}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}

export default MindMapPage;