import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO_SRC from '../../MainPage/image/MindCraft-Logo1.png';
import PENCIL_SRC from '../../MindMapPage/image/pencil.png';
import PDF_SRC from '../image/pdf.png';
import DOCX_SRC from '../image/docx.png';

function CLHeader({ userName = '프로젝트 매니저 지원', onBackToMindMap }) {
  const [title, setTitle] = useState(userName);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    if (!title.trim()) setTitle(userName);
    setIsEditing(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirm();
    if (e.key === 'Escape') { setTitle(userName); setIsEditing(false); }
  };

  // onBackToMindMap이 없으면 기본적으로 마인드맵 편집 경로로 이동
  const handleBack = () => {
    if (onBackToMindMap) {
      onBackToMindMap();
    } else {
      navigate('/mindmap');
    }
  };

  return (
    <header className="cl-header">
      {/* 왼쪽: 로고 고정 영역 */}
      <div className="cl-header-logo">
        <img src={LOGO_SRC} alt="" style={{ height: '32px', width: 'auto', display: 'block' }} />
        <span className="mm-logo-text">MIND <span>CRAFT</span></span>
      </div>

      <div className="mm-header-divider" />

      {/* 이름 + 연필 */}
      <div className="cl-doc-title">
        {isEditing ? (
          <input
            ref={inputRef}
            className="mm-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleConfirm}
            onKeyDown={handleKeyDown}
            maxLength={40}
          />
        ) : (
          <span className="mm-user-name">{title}</span>
        )}
        <button className="mm-icon-btn mm-icon-img-btn" onClick={() => setIsEditing((p) => !p)}>
          <img src={PENCIL_SRC} alt="편집" style={{ width: '14px', height: '14px', objectFit: 'contain', display: 'block', opacity: 0.55 }} />
        </button>
      </div>

      {/* 가운데: 여백 */}
      <div className="cl-header-center" />

      {/* 오른쪽: 마인드맵으로 돌아가기 + PDF + DOCX + 프로필 */}
      <div className="cl-header-right">
        <button className="cl-btn-back" onClick={handleBack}>
          ← 마인드맵 편집으로 돌아가기
        </button>
        <button className="cl-btn-pdf">
          <img src={PDF_SRC} alt="PDF" className="cl-file-icon" /> PDF
        </button>
        <button className="cl-btn-docx">
          <img src={DOCX_SRC} alt="DOCX" className="cl-file-icon" /> DOCX
        </button>
        <div className="mm-avatar"><span>👤</span></div>
      </div>
    </header>
  );
}

export default CLHeader;