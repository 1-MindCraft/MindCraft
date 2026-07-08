import React from 'react';
import SAVE_SRC from '../../assets/save.png';
import MindMap from './MindMap';

function MindMapCanvas({ isSaving, onSave, tool }) {
  return (
    <div className="mm-canvas">
      <MindMap tool={tool} />
      <div className="mm-canvas-placeholder">
        {/* <p>마인드맵 캔버스</p>
        <p className="mm-canvas-hint">실제 마인드맵 라이브러리 연동 예정</p> */}
      </div>

      {/* 미니맵 */}
      <div className="mm-minimap">
        <div className="mm-minimap-inner" />
      </div>

      {/* 우하단 저장 버튼 */}
      <button
        className={`mm-canvas-save-btn ${isSaving ? 'saving' : ''}`}
        onClick={onSave}
        disabled={isSaving}
        title="저장"
      >
        {isSaving ? (
          ''
        ) : (
          <img src={SAVE_SRC} alt="저장" className="mm-canvas-save-icon" />
        )}
      </button>
    </div>
  );
}

export default MindMapCanvas;
