import React, { useEffect } from 'react';
import LOGO_SRC from '../image/MindCraft-Logo1.png';

function LoginModal({ open, onClose }) {
  // ESC 키로 닫기 + 모달이 열려있는 동안 배경 스크롤 막기
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  // 오버레이(어두운 배경) 클릭 시에만 닫히고, 모달 내부 클릭은 무시
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div className="login-modal" role="dialog" aria-modal="true">
        <button
          className="login-close"
          onClick={onClose}
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 왼쪽: 로고 패널 */}
        <div className="login-side">
          <img src={LOGO_SRC} alt="" className="login-side-logo" />
          <span className="login-side-text">
            MIND <span>CRAFT</span>
          </span>
        </div>

        {/* 오른쪽: 로그인 폼 */}
        <div className="login-form">
          <h2>로그인</h2>
          <p className="login-sub">이메일과 비밀번호로 로그인하세요</p>

          <label className="login-label" htmlFor="login-email">
            이메일
          </label>
          <div className="login-input">
            <span className="login-input-icon"></span>
            <input
              id="login-email"
              type="email"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <label className="login-label" htmlFor="login-password">
            비밀번호
          </label>
          <div className="login-input">
            <span className="login-input-icon"></span>
            <input
              id="login-password"
              type="password"
              placeholder="비밀번호를 입력하세요"
            />
            <span className="login-input-icon login-input-icon-right">
              👁
            </span>
          </div>

          <label className="login-remember">
            <input type="checkbox" />
            로그인 상태 유지
          </label>

          <button className="login-submit">로그인</button>

          <div className="login-links">
            <a href="#">아이디 찾기</a>
            <span className="login-divider">|</span>
            <a href="#">비밀번호 찾기</a>
          </div>

          <div className="login-or">
            <span>소셜 계정으로 간편 로그인</span>
          </div>

          <div className="login-social">
            <button className="login-social-btn">
              <span className="social-icon google-icon">G</span>
              구글
            </button>
            <button className="login-social-btn login-social-kakao">
              <span className="social-icon kakao-icon">KAKAO</span>
              카카오
            </button>
            <button className="login-social-btn">
              <span className="social-icon naver-icon">N</span>
              네이버
            </button>
          </div>

          <p className="login-signup">
            아직 계정이 없으신가요? <a href="#">회원가입 ›</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
