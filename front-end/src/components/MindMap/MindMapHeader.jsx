import React, { useState, useRef, useEffect } from 'react';
import LOGO_SRC from '../../assets/MindCraft-Logo1.png';
import PENCIL_SRC from '../../assets/pencil.png';
import EXPORT_SRC from '../../assets/export.png';
import ProfileDropdown from '../common/ProfileDropdown';
import useMindMapStore from '../../zustand/mindMapStore';

function MindMapHeader({ userName = '사용자' }) {
  // const [title, setTitle] = useState(userName);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);
  const title = useMindMapStore((state) => state.title);
  const setTitle = useMindMapStore((state) => state.setTitle);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleEditConfirm = () => {
    if (!title.trim()) setTitle('이름없는 마인드맵');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleEditConfirm();
    if (e.key === 'Escape') {
      setTitle('이름없는 마인드맵');
      setIsEditing(false);
    }
  };

  return (
    <header className="mm-header">
      {/* 왼쪽: 로고 고정 영역 (사이드바 너비와 맞춤) */}
      <div className="mm-header-logo-area">
        <img src={LOGO_SRC} alt="" className="mm-logo-img" />
        <span className="mm-logo-text">
          MIND <span>CRAFT</span>
        </span>
      </div>

      {/* 구분선 */}
      <div className="mm-header-divider" />

      {/* 이름 + 연필: 구분선 바로 오른쪽 */}
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

      {/* 오른쪽: 키워드 추출 + 내보내기 + 프로필 */}
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
    </header>
  );
}

export default MindMapHeader;
