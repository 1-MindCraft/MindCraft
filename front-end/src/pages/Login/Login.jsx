import React, { useEffect } from 'react';
import LoginSide from '../../components/Login/LoginSide';
import LoginForm from '../../components/Login/LoginForm';

/**
 * LoginPage
 * MainPage에서 open/onClose prop을 받아 모달 형태로 표시됩니다.
 */
function LoginPage({ open, onClose, onSignupClick }) {
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

  // 오버레이(어두운 배경) 클릭 시에만 닫힘
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div className="login-modal" role="dialog" aria-modal="true">
        <button className="login-close" onClick={onClose} aria-label="닫기">
          ✕
        </button>
        <LoginSide />
        <LoginForm onSignupClick={onSignupClick} />
      </div>
    </div>
  );
}

export default LoginPage;