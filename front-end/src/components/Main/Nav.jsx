import React from 'react';
import LOGO_SRC from '../../assets/MindCraft-Logo1.png';

// 수정된 부분: onLogout prop을 onGoToMyPage로 이름 변경
// 이유: 이제 로그아웃이 아니라 마이페이지 이동 기능으로 바뀌어서 prop 이름도 그에 맞게 변경
function Nav({ isMember, onLoginClick, onGoToMyPage }) {
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
        {/* 수정된 부분: 회원일 때 "로그아웃" 대신 "마이페이지로 이동"으로 변경
            이유: 로그아웃 기능은 MindMap/CoverLetter 헤더 드롭다운에 이미 있어서,
            메인 화면 헤더 버튼은 마이페이지로 이동하는 용도로 바꾸기로 결정함 */}
        {isMember ? (
          <button className="nav-btn" onClick={onGoToMyPage}>
            마이페이지로 이동
          </button>
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