import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PENCIL_SRC from '../../assets/pencil.png';
import EXPORT_SRC from '../../assets/export.png';
import ProfileDropdown from '../common/ProfileDropdown';
import AppHeader from '../common/AppHeader';
import useMindMapStore from '../../zustand/mindMapStore';

function MindMapHeader({ userName = '사용자' }) {
  const navigate = useNavigate();
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
            // 추가된 부분: onDoubleClick 추가
            // 이유: 기존엔 펜 아이콘 클릭으로만 편집모드에 들어갈 수 있었는데,
            // 제목을 더블클릭해도 똑같이 편집모드로 들어가게 해달라는 요청이 있어서 추가
            <span
              className="mm-user-name"
              onDoubleClick={() => setIsEditing(true)}
              title="더블클릭해서 제목 수정"
            >
              {title}
            </span>
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
          <button className="mm-btn-export" onClick={() => navigate('/coverletter')}>
            <img src={EXPORT_SRC} alt="생성하기" className="mm-header-btn-icon" />{' '}
            생성하기
          </button>
          <ProfileDropdown userName={userName} />
        </div>
      }
    />
  );
}

export default MindMapHeader;