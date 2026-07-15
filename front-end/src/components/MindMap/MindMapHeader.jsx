import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PENCIL_SRC from '../../assets/pencil.png';
import EXPORT_SRC from '../../assets/export.png';
import ProfileDropdown from '../common/ProfileDropdown';
import AppHeader from '../common/AppHeader';
import useMindMapStore from '../../zustand/mindMapStore';
import { useModal } from '../common/ModalProvider';

function MindMapHeader() {
  const navigate = useNavigate();
  const { alert } = useModal();
  const [isEditing, setIsEditing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const inputRef = useRef(null);
  const title = useMindMapStore((state) => state.title);
  const setTitle = useMindMapStore((state) => state.setTitle);
  const nodes = useMindMapStore((state) => state.nodes);
  const extractKeywords = useMindMapStore((state) => state.extractKeywords);

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

    const handleExtractKeywords = async () => {
    if (extracting) return;

    if (nodes.length === 0) {
      await alert('마인드맵 노드가 없습니다. 먼저 마인드맵을 작성해주세요.');
      return;
    }

    setExtracting(true);
    try {
      await extractKeywords();
      await alert('키워드 추출이 완료되었습니다.\n노드를 클릭하면 키워드를 볼 수 있어요.');
    } catch {
      await alert('키워드 추출 중 오류가 발생했습니다.');
    } finally {
      setExtracting(false);
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
          <button
            className="mm-btn-keyword"
            onClick={handleExtractKeywords}
            disabled={extracting}
          >
            <span>✦</span> {extracting ? '추출 중...' : '키워드 추출'}
          </button>
          <button className="mm-btn-export" onClick={() => navigate('/coverletter')}>
            <img src={EXPORT_SRC} alt="생성하기" className="mm-header-btn-icon" />{' '}
            생성하기
          </button>
          <ProfileDropdown />
        </div>
      }
    />
  );
}

export default MindMapHeader;