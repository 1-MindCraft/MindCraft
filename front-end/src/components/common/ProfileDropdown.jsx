import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './ProfileDropdown.css';
import { useLoginActions } from '../../hooks/useLoginActions';
import { useNavigation } from '../../hooks/useNavigation';
import useLoginState from '../../hooks/useLoginState';

// 추가된 부분: showTheme prop 추가
// 이유: 메인화면에서는 테마 설정을 숨기고, MindMap/CoverLetter 헤더에서는 그대로 보이게 하기 위해 추가됨

// 추가된 부분: showHelp prop 추가
// 이유: 메인화면에서는 도움말이 중복(이미 사용방법 섹션이 있음)이라 숨기고, 다른 화면에서는 그대로 보이게 하기 위해 추가됨
function ProfileDropdown({ showTheme = true, showHelp = true }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { doLogout } = useLoginActions();
  const { moveToMain } = useNavigation();

  // [추가됨 | 2026-07-10]
  // Zustand의 loginState.js에 저장된 로그인 사용자 이름을 직접 조회합니다.
  // 추가 이유: 부모 컴포넌트가 고정 문자열을 prop으로 전달하던 구조를 제거하고,
  // 로그인 상태가 변경되면 Dropdown 이름도 자동으로 다시 렌더링되도록 하기 위함입니다.
  const { name } = useLoginState();
  const displayName = name?.trim() || '사용자';

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
    doLogout();
    moveToMain();
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
            <span className="profile-dropdown-user-name">{displayName}</span>
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

          {/* 수정된 부분: 테마 설정 블록을 showTheme prop으로 조건부 렌더링
              이유: 메인화면에선 showTheme={false}로 숨기고, 기존 헤더에선 기본값 true라 그대로 보임 */}
          {/* 2. 테마 설정 — showTheme={false}면 숨김 */}
          {showTheme && (
            <>
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
            </>
          )}

          {/* 수정된 부분: 도움말 블록을 showHelp prop으로 조건부 렌더링
              이유: 메인화면에선 showHelp={false}로 숨기고, 다른 화면에선 기본값 true라 그대로 보임 */}
          {/* 3. 도움말 — showHelp={false}면 숨김 */}
          {showHelp && (
            <>
              <button
                className="profile-dropdown-item"
                onClick={() => goTo('/help')}
              >
                <span>도움말</span>
              </button>

              <div className="profile-dropdown-divider" />
            </>
          )}

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