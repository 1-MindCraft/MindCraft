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

      {/* 수정된 부분: 미니맵 div를 여기서 삭제함
          이유: 실제 React Flow MiniMap이 아니라 아무 기능도 없는 장식용 빈 박스였고,
          불필요하니 제거해달라는 요청이 있어서 삭제 (아래 저장 버튼은 그대로 유지) */}

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