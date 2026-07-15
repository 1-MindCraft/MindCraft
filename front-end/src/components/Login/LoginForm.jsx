import React, { useState } from 'react';
import SocialButtons from './SocialButtons';
import { useLoginActions } from '../../hooks/useLoginActions';
import { useNavigation } from '../../hooks/useNavigation';
import { useModal } from '../common/ModalProvider';

function LoginForm({ onSignupClick }) {
  const [showPassword, setShowPassword] = useState(false);
  const { moveToPath } = useNavigation();
  const { doLogin, doLogout } = useLoginActions();
  const { alert } = useModal(); // 수정된 부분: 브라우저 기본 alert() 대신 커스텀 모달 사용
  // 추가된 부분 [2026-07-15]: 로그인 요청 중복 제출 방지용 state
  // 이유: 로그인 응답을 기다리는 동안 Enter를 한 번 더 누르면(또는 버튼을 다시 누르면)
  // handleSubmit이 두 번 실행돼서 '로그인 성공!' 모달이 2번 뜨는 문제가 있었음
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    return {
      email: savedEmail || '',
      password: '',
      remember: !!savedEmail,
    };
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked // 체크박스인 경우 true 또는 false 저장
          : value, // 일반 입력창인 경우 입력한 값 저장
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 추가된 부분 [2026-07-15]: 이미 로그인 요청이 진행 중이면 중복 제출 무시
    // 이유: Enter 연타나 버튼 연타로 handleSubmit이 겹쳐 실행되면서
    // alert('로그인 성공!')이 두 번 뜨는 문제를 막기 위함
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (formData.remember) {
      localStorage.setItem('rememberedEmail', formData.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    try {
      const rdata = await doLogin(formData);
      console.log('login 성공:', rdata);
      // 수정된 부분: alert() → await alert() (브라우저 기본 alert창 대신 커스텀 모달로 교체)
      await alert('로그인 성공!');
      moveToPath('/mindmap');
    } catch (error) {
      console.log('login 실패:', error.response?.data || error);
      // 수정된 부분: alert() → await alert() (브라우저 기본 alert창 대신 커스텀 모달로 교체)
      await alert('입력 정보를 다시 확인하세요.');
    } finally {
      // 추가된 부분 [2026-07-15]: 요청이 끝나면(성공/실패 상관없이) 다시 제출 가능하도록 원복
      // 이유: 로그인 실패 시 사용자가 다시 시도할 수 있어야 하므로 finally에서 항상 해제
      setIsSubmitting(false);
    }
  };

  // 추가된 부분: <div>를 <form onSubmit={handleSubmit}>로 교체
  // 이유: 비밀번호 입력 후 Enter를 누르면 폼이 제출되어 로그인되게 하려면
  // 실제 <form> 태그가 있어야 브라우저가 Enter를 자동으로 제출로 처리해줌
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>로그인</h2>
      <p className="login-sub">이메일과 비밀번호로 로그인하세요</p>

      <label className="login-label" htmlFor="login-email">
        이메일
      </label>
      <div className="login-input">
        <input
          id="login-email"
          type="email"
          name="email"
          placeholder="이메일을 입력하세요"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <label className="login-label" htmlFor="login-password">
        비밀번호
      </label>
      <div className="login-input">
        <input
          id="login-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleChange}
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
        <input
          type="checkbox"
          name="remember"
          checked={formData.remember}
          onChange={handleChange}
        />
        로그인 상태 유지
      </label>

      {/* 수정된 부분: onClick={handleSubmit} 제거하고 type="submit"으로 변경
          이유: <form onSubmit>이 이제 제출을 처리하므로, onClick까지 남겨두면 중복 호출될 수 있어 제거 */}
      {/* 수정된 부분 [2026-07-15]: disabled={isSubmitting} 추가
          이유: Enter뿐 아니라 버튼을 여러 번 클릭해서 생기는 중복 제출도 함께 막기 위함
          before: <button className="login-submit" type="submit">
          after: */}
      <button className="login-submit" type="submit" disabled={isSubmitting}>
        로그인
      </button>

      {/* 삭제된 부분 [2026-07-15]: '비밀번호 재설정' 관련 링크 블록 전체 제거
          이유: 로그인 모달에 비밀번호 재설정 기능이 없는데 안내 문구/링크만 남아있어서
          불필요하다는 요청으로 삭제함. 참고: login-links/login-divider 클래스는
          SignupForm의 '이미 계정이 있으신가요? 로그인' 부분에서도 재사용 중이라 CSS는 그대로 둠
          before:
          <div className="login-links">
            비밀번호가 기억나지 않으신가요?
            <span className="login-divider">|</span>
            <a href="#">비밀번호 재설정</a>
          </div>
          after: (제거됨) */}

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
    </form>
  );
}

export default LoginForm;