import React from 'react';
import LOGO_SRC from '../../assets/MindCraft-Logo1.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <img
          src={LOGO_SRC}
          alt=""
          style={{ height: 30, width: 'auto', display: 'block' }}
        />
        <span className="logo-text">
          MIND <span>CRAFT</span>
        </span>
      </div>
      <span>© 2025 MindCraft Team · SIAT 팀 프로젝트</span>
    </footer>
  );
}

export default Footer;
