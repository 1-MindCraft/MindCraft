// 수정된 부분 [2026-07-16]: React import 제거
// 이유: 새 메인화면 리디자인 버전 기준으로 통일. Vite의 React 플러그인은
// 자동 JSX 런타임을 사용하므로 JSX만 쓰는 파일에서는 React import가 불필요함.
// before: import React from 'react';
// after: (삭제됨)
import LOGO_SRC from '../../assets/MindCraft-Logo1.png';
import ProfileDropdown from '../common/ProfileDropdown';

// 수정된 부분: onGoToMyPage prop 제거, ProfileDropdown 추가
// 이유: 회원 전용 메인화면 우측 상단의 "마이페이지로 이동" 버튼을
// Dropdown 형식의 Profile 컴포넌트로 교체하기로 결정
function Nav({ isMember, onLoginClick }) {
  return (
    <nav className="nav">
      <a href="#" className="logo">
        <img
          src={LOGO_SRC}
          // 수정된 부분 [2026-07-16]: 로고 alt 텍스트 추가
          // 이유: 접근성(스크린리더) 개선을 위해 빈 alt 대신 서비스명 표기
          // before: alt=""
          // after: alt="MindCraft"
          alt="MindCraft"
          style={{ height: 52, width: 'auto', display: 'block' }}
        />
        <span className="logo-text">
          MIND <span>CRAFT</span>
        </span>
      </a>
      <div className="nav-links">
        {/* 수정된 부분 [2026-07-16]: nav 앵커 링크를 새 메인화면 섹션 id에 맞게 교체
            이유: 리디자인된 Main.jsx의 섹션 id가 #journey(프로세스), #mindmap(마인드맵 기능),
            #features(AI 자소서), #faq(FAQ)로 바뀌어서 기존 앵커(#how, #features)로는
            스크롤 이동이 안 되거나 엉뚱한 섹션으로 이동하는 충돌이 발생함.
            before: <a href="#how">서비스 소개</a>
            before: <a href="#features">사용 방법</a>
            before: <a href="#faq">FAQ</a>
            after: 아래 4개 링크로 교체 */}
        {/* 수정된 부분 [2026-07-20]: "마인드맵"과 "AI 자기소개서" 사이에 링크 2개 추가
            (키워드 추출, 자소서 마스터)
            이유(요청 3-1): "마인드맵 옆에 키워드 추출, 키워드 추출 옆에 자소서 마스터"
            — Main.jsx에 새로 추가된 KeywordFeature(id="keyword")/MasterFeature
            (id="master") 섹션으로 이동할 수 있는 헤더 링크가 필요해짐.
            before: <a href="#mindmap">마인드맵</a>
                    <a href="#features">AI 자기소개서</a>
            after: 아래처럼 마인드맵과 AI 자기소개서 사이에 2개 삽입 */}
        <a href="#journey">서비스 소개</a>
        <a href="#mindmap">마인드맵</a>
        <a href="#keyword">키워드 추출</a>
        <a href="#master">자소서 마스터</a>
        <a href="#features">AI 자기소개서</a>
        <a href="#faq">FAQ</a>
        {/* 수정된 부분: "마이페이지로 이동" 버튼 → ProfileDropdown으로 교체
            이유: 회원일 때 우측 상단에 드롭다운 형식의 프로필을 넣어달라는 요청 */}
        {isMember ? (
          // 수정된 부분 [2026-07-16]: showTheme={false} prop 추가
          // 이유: 새 메인화면은 라이트 전용 디자인이라 테마 토글을 노출하지 않음.
          // ProfileDropdown은 이미 showTheme prop을 지원함(기본값 true) → 충돌 없음 확인.
          // before: <ProfileDropdown showHelp={false} />
          // after: <ProfileDropdown showTheme={false} showHelp={false} />
          <ProfileDropdown showHelp={false} />
        ) : (
          <button className="nav-btn" onClick={onLoginClick}>
            로그인 / 회원가입
          </button>
        )}
      </div>
    </nav>
  );
}

export default Nav;