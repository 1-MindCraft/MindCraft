import React, { useState, useCallback } from 'react';
import './MindMapPage.css';

import MindMapHeader from '../components/MindMapPage/MindMapHeader';
import MindMapToolbar from '../components/MindMapPage/MindMapToolbar';
import MindMapSidebar from '../components/MindMapPage/MindMapSidebar';
import MindMapCanvas from '../components/MindMapPage/MindMapCanvas';

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