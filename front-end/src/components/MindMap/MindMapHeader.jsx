import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PENCIL_SRC from '../../assets/pencil.png';
// 추가된 부분 [2026-07-15]: 다크모드용 흰색 아이콘 import
// 이유: 기존 pencil.png가 어두운 색이라 다크모드 배경에서 아이콘이 안 보이는
// 문제가 있어서, 다크모드일 때는 흰색 버전 아이콘으로 바꿔 보여주기 위해 추가함
import PENCIL_WHITE_SRC from '../../assets/pencil-white.png';
import ProfileDropdown from '../common/ProfileDropdown';
import AppHeader from '../common/AppHeader';
import useMindMapStore from '../../zustand/mindMapStore';
// 추가된 부분 [2026-07-15]: 현재 테마(라이트/다크)를 알아내기 위한 useTheme 훅 import
// 이유: 테마에 따라 아이콘 이미지를 다르게(라이트=어두운 아이콘, 다크=흰색 아이콘) 보여주려면
// 현재 테마 값이 필요함
import { useTheme } from '../../context/ThemeContext';

// 삭제된 부분 [2026-07-15]: [ 키워드 추출 ] / [ 생성하기 ] 버튼과 그에 딸린 로직(extracting state,
// handleExtractKeywords, 추출중 오버레이, useModal/extractKeywords/nodes, TextShimmerWave,
// EXPORT_SRC/EXPORT_WHITE_SRC import 등) 전부 MindMapToolbar.jsx로 이동
// 이유: "헤더에 있는 키워드 추출과 생성하기 버튼을 툴바로 위치 변경"해달라는 요청.
// 이 컴포넌트(MindMapHeader)에는 더 이상 이 버튼들이 필요 없어서 관련 코드를 전부 제거함
function MindMapHeader() {
  const navigate = useNavigate();
  // 추가된 부분 [2026-07-15]: 현재 테마 값
  const { theme } = useTheme();
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

  // 수정된 부분 [2026-07-15]: return을 다시 <AppHeader ... /> 하나만 반환하도록 되돌림
  // 이유: 키워드 추출 중 오버레이가 MindMapToolbar.jsx로 옮겨가면서, 이 컴포넌트에서
  // Fragment로 여러 엘리먼트를 감쌀 필요가 없어짐
  // before: return (\n    <>\n    <AppHeader ... />\n    {extracting && (...)}\n    </>\n  );
  // after:
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
            {/* 수정된 부분 [2026-07-15]: src를 테마에 따라 조건부로 선택
                이유: 다크모드에서 연필 아이콘이 안 보이는 문제 수정
                before: <img src={PENCIL_SRC} alt="편집" className="mm-header-icon" />
                after: */}
            <img
              src={theme === 'dark' ? PENCIL_WHITE_SRC : PENCIL_SRC}
              alt="편집"
              className="mm-header-icon"
            />
          </button>
        </div>
      }
      right={
        // 수정된 부분 [2026-07-15]: [ 키워드 추출 ]/[ 생성하기 ] 버튼 제거, ProfileDropdown만 남김
        // 이유: 두 버튼이 툴바로 이동했으므로 헤더 오른쪽엔 프로필 드롭다운만 남으면 됨
        // before:
        //   <div className="mm-header-right">
        //     <button className="mm-btn-keyword" ...>키워드 추출</button>
        //     <button className="mm-btn-export" ...>생성하기</button>
        //     <ProfileDropdown />
        //   </div>
        // after:
        <div className="mm-header-right">
          <ProfileDropdown />
        </div>
      }
    />
  );
}

export default MindMapHeader;