import React from 'react';
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
          alt=""
          style={{ height: 52, width: 'auto', display: 'block' }}
        />
        <span className="logo-text">
          MIND <span>CRAFT</span>
        </span>
      </a>
      <div className="nav-links">
        <a href="#how">서비스 소개</a>
        <a href="#features">사용 방법</a>
        <a href="#faq">FAQ</a>
        {/* 수정된 부분: "마이페이지로 이동" 버튼 → ProfileDropdown으로 교체
            이유: 회원일 때 우측 상단에 드롭다운 형식의 프로필을 넣어달라는 요청 */}
        {isMember ? (
          <ProfileDropdown showTheme={false} showHelp={false} />
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