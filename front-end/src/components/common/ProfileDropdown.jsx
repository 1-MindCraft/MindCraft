import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './ProfileDropdown.css';

function ProfileDropdown({ userName = '사용자' }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // ESC로 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    // TODO: 실제 인증 붙으면 여기서 토큰/세션 초기화 로직 추가
    navigate('/');
  };

  return (
    <div className="profile-dropdown-wrap" ref={wrapperRef}>
      <button
        className="mm-avatar profile-dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span>👤</span>
      </button>

      {open && (
        <div className="profile-dropdown-menu">
          <div className="profile-dropdown-user">
            <span className="profile-dropdown-user-avatar">👤</span>
            <span className="profile-dropdown-user-name">{userName}</span>
          </div>

          <div className="profile-dropdown-divider" />

          {/* 1. 계정 설정 */}
          <button
            className="profile-dropdown-item"
            onClick={() => goTo('/account')}
          >
            <span className="profile-dropdown-icon">⚙</span>
            <span>마이 페이지</span>
          </button>

          {/* 2. 테마 설정 */}
          <div className="profile-dropdown-item profile-dropdown-item--static">
            <span>테마 설정</span>
          </div>
          <div className="profile-theme-options">
            <button
              className={`profile-theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              라이트 모드
            </button>
            <button
              className={`profile-theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              다크 모드
            </button>
          </div>

          <div className="profile-dropdown-divider" />

          {/* 3. 도움말 */}
          <button
            className="profile-dropdown-item"
            onClick={() => goTo('/help')}
          >
            <span>도움말</span>
          </button>

          <div className="profile-dropdown-divider" />

          {/* 4. 로그아웃 */}
          <button
            className="profile-dropdown-item profile-dropdown-item--danger"
            onClick={handleLogout}
          >
            <span className="profile-dropdown-icon">↪</span>
            <span>로그아웃</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
