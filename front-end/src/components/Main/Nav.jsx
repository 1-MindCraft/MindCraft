import React from 'react';
import LOGO_SRC from '../../assets/MindCraft-Logo1.png';

function Nav({ onLoginClick }) {
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
        <button className="nav-btn" onClick={onLoginClick}>
          로그인 / 회원가입
        </button>
      </div>
    </nav>
  );
}

export default Nav;