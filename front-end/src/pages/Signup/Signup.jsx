import React, { useEffect } from 'react';
import SignupSide from '../../components/Signup/SignupSide';
import SignupForm from '../../components/Signup/SignupForm';

/**
 * SignupPage
 * open/onClose/onLoginClick/theme prop을 받아 모달 형태로 표시됩니다.
 * theme: 'blue' (기본, 파란색) | 'green' (초록색)
 */
function SignupPage({ open, onClose, onLoginClick, theme = 'blue' }) {
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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div className="login-modal" role="dialog" aria-modal="true">
        <button className="login-close" onClick={onClose} aria-label="닫기">
          ✕
        </button>
        <SignupSide theme={theme} />
        <SignupForm theme={theme} onLoginClick={onLoginClick} />
      </div>
    </div>
  );
}

export default SignupPage;
