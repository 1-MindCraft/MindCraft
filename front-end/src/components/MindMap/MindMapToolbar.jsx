import React from 'react';
import { useReactFlow, useViewport } from '@xyflow/react';
import HAND_SRC from '../../assets/hand-tool.png';
import SAVE_SRC from '../../assets/save.png';

function MindMapToolbar({
  isSaving,
  lastSaved,
  onSave,
  tool,
  onToolChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) {
  // 실제 캔버스 확대/축소를 제어 (ReactFlowProvider 하위에서만 동작)
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { zoom } = useViewport();
  const zoomPercent = Math.round(zoom * 100);

  const savedTime = lastSaved
    ? lastSaved.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  return (
    <div className="mm-toolbar">
      {/* ── 왼쪽 고정: 저장 + 저장됨 ── */}
      <div className="mm-toolbar-left">
        <button
          className={`mm-btn-save-toolbar ${isSaving ? 'saving' : ''}`}
          onClick={onSave}
          disabled={isSaving}
          title="저장"
        >
          {isSaving ? (
            <span></span>
          ) : (
            <img src={SAVE_SRC} alt="저장" className="mm-tool-icon" />
          )}
          {isSaving ? '저장 중...' : '저장'}
        </button>

        <div className="mm-toolbar-divider" />

        {savedTime && !isSaving && (
          <span className="mm-toolbar-saved">
            <span className="mm-save-icon">✓</span> 저장됨
          </span>
        )}
      </div>

      {/* ── 중앙: 도구 / undo/redo / 줌 ── */}
      <div className="mm-toolbar-center">
        <div className="mm-toolbar-group">
          <button
            className={`mm-tool-btn mm-tool-img-btn ${tool === 'drag' ? 'active' : ''}`}
            onClick={() => onToolChange('drag')}
            title="드래그 (공간 이동)"
          >
            <img src={HAND_SRC} alt="드래그" className="mm-tool-icon" />
          </button>
          <button
            className={`mm-tool-btn mm-tool-img-btn ${tool === 'select' ? 'active' : ''}`}
            onClick={() => onToolChange('select')}
            title="선택 (드래그로 여러 노드 선택)"
          >
            <svg
              className="mm-tool-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              fill="currentColor"
            >
              <path d="M14.78 5a1 1 0 00-.69.28L15 6.28 36.69 27.59l-9.38.81a1 1 0 00-.77 1.53L32.78 43.5l-2.56 1.16-6-13.84a1 1 0 00-1.6-.34L16 36.69V8.28l20.69 19.31-9.38.81z" />
            </svg>
          </button>
          {/* undo/redo: 드래그 도구 바로 옆 */}
          <button
            className="mm-icon-btn"
            title="실행 취소"
            onClick={onUndo}
            disabled={!canUndo}
          >
            ↩
          </button>
          <button
            className="mm-icon-btn"
            title="다시 실행"
            onClick={onRedo}
            disabled={!canRedo}
          >
            ↪
          </button>
        </div>

        <div className="mm-toolbar-divider" />

        <div className="mm-toolbar-group">
          <button
            className="mm-tool-btn"
            onClick={() => zoomOut({ duration: 200 })}
            title="축소"
          >
            −
          </button>
          <span className="mm-zoom-label">{zoomPercent}%</span>
          <button
            className="mm-tool-btn"
            onClick={() => zoomIn({ duration: 200 })}
            title="확대"
          >
            +
          </button>
          <button
            className="mm-tool-btn"
            onClick={() => fitView({ duration: 300 })}
            title="화면에 맞추기"
          >
            ⛶
          </button>
        </div>
        {/* 수정된 부분: "테마 ▾" 버튼과 그 앞 구분선을 여기서 삭제함
            이유: 아직 미완성 기능이라 보류 중이었는데, 나중에 추가하는 방식으로 논의를 결정해서 삭제 */}
      </div>
    </div>
  );
}

export default MindMapToolbar;
