import React from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO_SRC from '../../assets/MindCraft-Logo1.png';
import './AppHeader.css';

// 모든 페이지가 공유하는 헤더 뼈대.
//
// - logoAreaWidth: MindMap/CoverLetter처럼 아래 사이드바와 폭을 맞춰야 할 때만 지정 (예: "260px").
//   지정하면 로고 영역이 그 폭으로 고정되고, 헤더 좌측 여백이 사라져 사이드바와 나란히 맞춰짐.
// - center: 로고 오른쪽에 넣을 내용 (예: 문서 제목 편집 영역). 넣으면 구분선도 함께 표시됨.
// - right: 오른쪽 끝에 넣을 커스텀 내용 (버튼 여러 개, 프로필 드롭다운 등).
// - actionLabel/onAction: right 없이 버튼 하나만 필요한 단순한 페이지(Account/Help/Terms/Privacy)용 shortcut.
//
// 로고를 누르면 항상 메인 화면('/')으로 이동.
function AppHeader({ logoAreaWidth, center, right, actionLabel, onAction }) {
  const navigate = useNavigate();

  return (
    <header
      className={`app-header ${logoAreaWidth ? 'app-header--sidebar-aligned' : ''}`}
    >
      <div
        className={`app-header-logo ${logoAreaWidth ? 'app-header-logo--fixed' : ''}`}
        style={logoAreaWidth ? { width: logoAreaWidth } : undefined}
        onClick={() => navigate('/')}
      >
        <img src={LOGO_SRC} alt="" className="app-header-logo-img" />
        <span className="app-header-logo-text">
          MIND <span>CRAFT</span>
        </span>
      </div>

      {center && (
        <>
          <div className="app-header-divider" />
          <div className="app-header-center">{center}</div>
        </>
      )}

      <div className="app-header-right">
        {right
          ? right
          : actionLabel && (
              <button className="app-header-action-btn" onClick={onAction}>
                {actionLabel}
              </button>
            )}
      </div>
    </header>
  );
}

export default AppHeader;
