import React from 'react';

function CLMindMap() {
  return (
    <div className="cl-mindmap">
      <div className="cl-mindmap-label">마인드맵</div>
      <button className="cl-btn-view-cover">⊞ 자소서 보기</button>

      {/* 실제 마인드맵 라이브러리 연동 예정 */}
      <div className="cl-mindmap-canvas">
        <div className="mm-canvas-placeholder">
          <p>마인드맵 캔버스</p>
          <p className="mm-canvas-hint">마인드맵 라이브러리 연동 예정</p>
        </div>
      </div>

      {/* 미니맵 */}
      <div className="cl-minimap">
        <div className="mm-minimap-inner" />
      </div>
    </div>
  );
}

export default CLMindMap;
