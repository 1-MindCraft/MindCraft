import React, { useState } from 'react';
import SocialButtons from './SocialButtons';

function LoginForm({ onSignupClick }) {
  const [showPassword, setShowPassword] = useState(false);

  

  return (
    <div className="login-form">
      <h2>로그인</h2>
      <p className="login-sub">이메일과 비밀번호로 로그인하세요</p>

      <label className="login-label" htmlFor="login-email">
        이메일
      </label>
      <div className="login-input">
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
        <input
          id="login-password"
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호를 입력하세요"
        />
        <span
          className="login-input-icon login-input-icon-right"
          onClick={() => setShowPassword((prev) => !prev)}
          role="button"
          tabIndex={0}
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
        >
          {showPassword ? '◡' : '👁'}
        </span>
      </div>

      <label className="login-remember">
        <input type="checkbox" />
        로그인 상태 유지
      </label>

      <button className="login-submit">로그인</button>

      <div className="login-links">
        비밀번호가 기억나지 않으신가요?
        <span className="login-divider">|</span>
        <a href="#">비밀번호 재설정</a>
      </div>

      <div className="login-or">
        <span>소셜 계정으로 간편 로그인</span>
      </div>

      <SocialButtons />

      <p className="login-signup">
        아직 계정이 없으신가요?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSignupClick();
          }}
        >
          회원가입 ›
        </a>
      </p>
    </div>
  );
}

export default LoginForm;