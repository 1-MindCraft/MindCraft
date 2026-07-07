import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PENCIL_SRC from '../../assets/pencil.png';
import PDF_SRC from '../../assets/pdf.png';
import DOCX_SRC from '../../assets/docx.png';
import ProfileDropdown from '../common/ProfileDropdown';
import AppHeader from '../common/AppHeader';

// title/onTitleChange가 내려오면(자소서 생성 요청과 제목을 공유해야 하는 경우) 그걸 그대로 사용하고,
// 안 내려오면(단독으로 쓰는 경우) 기존처럼 내부 상태로 동작
function CLHeader({ userName = '프로젝트 매니저 지원', onBackToMindMap, title, onTitleChange }) {
  const [internalTitle, setInternalTitle] = useState(userName);
  const isControlled = title !== undefined && onTitleChange !== undefined;
  const currentTitle = isControlled ? title : internalTitle;
  const setTitle = isControlled ? onTitleChange : setInternalTitle;

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
    if (!currentTitle.trim()) setTitle(userName);
    setIsEditing(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirm();
    if (e.key === 'Escape') {
      setTitle(userName);
      setIsEditing(false);
    }
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
    <AppHeader
      logoAreaWidth="260px"
      center={
        <div className="cl-doc-title">
          {isEditing ? (
            <input
              ref={inputRef}
              className="mm-title-input"
              value={currentTitle}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleConfirm}
              onKeyDown={handleKeyDown}
              maxLength={40}
            />
          ) : (
            <span className="mm-user-name">{currentTitle}</span>
          )}
          <button
            className="mm-icon-btn mm-icon-img-btn"
            onClick={() => setIsEditing((p) => !p)}
          >
            <img
              src={PENCIL_SRC}
              alt="편집"
              style={{
                width: '14px',
                height: '14px',
                objectFit: 'contain',
                display: 'block',
                opacity: 0.55,
              }}
            />
          </button>
        </div>
      }
      right={
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
          <ProfileDropdown userName="마인드크래프트 회원" />
        </div>
      }
    />
  );
}

export default CLHeader;