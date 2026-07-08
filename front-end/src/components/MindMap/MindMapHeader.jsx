import React, { useState, useRef, useEffect } from 'react';
import PENCIL_SRC from '../../assets/pencil.png';
import EXPORT_SRC from '../../assets/export.png';
import ProfileDropdown from '../common/ProfileDropdown';
import AppHeader from '../common/AppHeader';

function MindMapHeader({ userName = '사용자' }) {
  const [title, setTitle] = useState(userName);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleEditConfirm = () => {
    if (!title.trim()) setTitle(userName);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleEditConfirm();
    if (e.key === 'Escape') {
      setTitle(userName);
      setIsEditing(false);
    }
  };

  return (
    <AppHeader
      logoAreaWidth="260px"
      center={
        <div className="mm-doc-title">
          {isEditing ? (
            <input
              ref={inputRef}
              className="mm-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleEditConfirm}
              onKeyDown={handleKeyDown}
              maxLength={30}
            />
          ) : (
            <span className="mm-user-name">{title}</span>
          )}
          <button
            className="mm-icon-btn mm-icon-img-btn"
            title="제목 수정"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            <img src={PENCIL_SRC} alt="편집" className="mm-header-icon" />
          </button>
        </div>
      }
      right={
        <div className="mm-header-right">
          <button className="mm-btn-keyword">
            <span>✦</span> 키워드 추출
          </button>
          <button className="mm-btn-export">
            <img src={EXPORT_SRC} alt="내보내기" className="mm-header-btn-icon" />{' '}
            내보내기
          </button>
          <ProfileDropdown userName={userName} />
        </div>
      }
    />
  );
}

export default MindMapHeader;