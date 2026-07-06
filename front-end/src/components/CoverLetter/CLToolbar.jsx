import React, { useState } from 'react';
import HAND_SRC from '../../assets/hand-tool.png';

const COLORS = [
  { id: 'blue',   hex: '#6c63ff' },
  { id: 'green',  hex: '#22c55e' },
  { id: 'purple', hex: '#a855f7' },
  { id: 'orange', hex: '#f97316' },
  { id: 'pink',   hex: '#ec4899' },
  { id: 'gray',   hex: '#94a3b8' },
];

function CLToolbar({ onSettingsToggle, settingsOpen }) {
  const [tool, setTool] = useState('drag');
  const [zoom, setZoom] = useState(100);
  const [activeColor, setActiveColor] = useState('blue');
  const handleZoom = (d) => setZoom((p) => Math.min(200, Math.max(25, p + d)));

  return (
    <div className="cl-toolbar">
      {/* 중앙: 도구 / undo/redo / 줌 / 색상 / 테마 */}
      <div className="cl-toolbar-center">
        <div className="mm-toolbar-group">
          <button
            className={`mm-tool-btn mm-tool-img-btn ${tool === 'drag' ? 'active' : ''}`}
            onClick={() => setTool('drag')} title="드래그"
          >
            <img src={HAND_SRC} alt="드래그" style={{ width: '18px', height: '18px', objectFit: 'contain', display: 'block', opacity: tool === 'drag' ? 1 : 0.6 }} />
          </button>
          <button
            className={`mm-tool-btn mm-tool-img-btn ${tool === 'select' ? 'active' : ''}`}
            onClick={() => setTool('select')} title="선택"
          >
            <svg className="mm-tool-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="currentColor">
              <path d="M14.78 5a1 1 0 00-.69.28L15 6.28 36.69 27.59l-9.38.81a1 1 0 00-.77 1.53L32.78 43.5l-2.56 1.16-6-13.84a1 1 0 00-1.6-.34L16 36.69V8.28l20.69 19.31-9.38.81z"/>
            </svg>
          </button>
          <button className="mm-icon-btn" title="실행 취소">↩</button>
          <button className="mm-icon-btn" title="다시 실행">↪</button>
        </div>

        <div className="mm-toolbar-divider" />

        <div className="mm-toolbar-group">
          <button className="mm-tool-btn" onClick={() => handleZoom(-10)}>−</button>
          <span className="mm-zoom-label">{zoom}%</span>
          <button className="mm-tool-btn" onClick={() => handleZoom(10)}>+</button>
          <button className="mm-tool-btn" title="화면에 맞추기">⛶</button>
        </div>

        <div className="mm-toolbar-divider" />

        <div className="mm-toolbar-group">
          {COLORS.map((c) => (
            <button
              key={c.id}
              className={`mm-color-dot ${activeColor === c.id ? 'active' : ''}`}
              style={{ background: c.hex }}
              onClick={() => setActiveColor(c.id)}
            />
          ))}
        </div>

        <div className="mm-toolbar-divider" />

        <div className="mm-toolbar-group">
          <button className="mm-tool-btn mm-btn-theme">테마 ▾</button>
        </div>
      </div>

      {/* 오른쪽: 생성 설정 버튼 */}
      <div className="cl-toolbar-right">
        <div className="mm-toolbar-divider" />
        <button
          className={`cl-btn-settings ${settingsOpen ? 'active' : ''}`}
          onClick={onSettingsToggle}
        >
          ✦ 생성 설정
        </button>
      </div>
    </div>
  );
}

export default CLToolbar;