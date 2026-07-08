import React, { useState, useRef } from 'react';
import SocialButtons from '../Login/SocialButtons';
import { register } from '../../axios/userApi';

const validate = {
  name: (v) => {
    if (!v) return '이름을 입력해주세요';
    if (/[^가-힣a-zA-Z0-9\s]/.test(v))
      return '이름에 특수문자를 사용할 수 없어요';
    return '';
  },
  email: (v) => {
    if (!v) return '이메일을 입력해주세요';
    if (!v.includes('@')) return '이메일 형식이 올바르지 않아요 (@가 필요해요)';
    const [, domain] = v.split('@');
    if (!domain || /[^a-zA-Z0-9.\-]/.test(domain))
      return '@ 뒤에는 특수문자를 사용할 수 없어요';
    if (!domain.includes('.')) return '이메일 형식이 올바르지 않아요';
    return '';
  },
  password: (v) => {
    if (!v) return '비밀번호를 입력해주세요';
    if (v.length < 6) return '비밀번호는 6자리 이상이어야 해요';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v))
      return '비밀번호에 특수문자를 1개 이상 포함해야 해요';
    return '';
  },
  passwordConfirm: (v, pw) => {
    if (!v) return '비밀번호 확인을 입력해주세요';
    if (v !== pw) return '비밀번호가 일치하지 않아요';
    return '';
  },
};

function SignupForm({ theme = 'blue', onLoginClick }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    agreed: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const refs = {
    name: useRef(null),
    email: useRef(null),
    password: useRef(null),
    passwordConfirm: useRef(null),
  };

  const handleChange = (field) => (e) => {
    const value = field === 'agreed' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err =
        field === 'passwordConfirm'
          ? validate.passwordConfirm(value, form.password)
          : (validate[field]?.(value) ?? '');
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
    if (field === 'password' && touched.passwordConfirm) {
      setErrors((prev) => ({
        ...prev,
        passwordConfirm: validate.passwordConfirm(form.passwordConfirm, value),
      }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err =
      field === 'passwordConfirm'
        ? validate.passwordConfirm(form.passwordConfirm, form.password)
        : (validate[field]?.(form[field]) ?? '');
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async () => {
    setTouched({
      name: true,
      email: true,
      password: true,
      passwordConfirm: true,
    });
    const newErrors = {
      name: validate.name(form.name),
      email: validate.email(form.email),
      password: validate.password(form.password),
      passwordConfirm: validate.passwordConfirm(
        form.passwordConfirm,
        form.password
      ),
    };
    setErrors(newErrors);

    // 첫 번째 에러 필드에 focus
    const order = ['name', 'email', 'password', 'passwordConfirm'];
    const firstError = order.find((f) => newErrors[f]);
    if (firstError) {
      refs[firstError].current?.focus();
      return;
    }

    if (!form.agreed) {
      alert('이용약관 및 개인정보처리방침에 동의해주세요');
      return;
    }

    const joinData = {
      email: form.email,
      password: form.password,
      name: form.name,
    };

    try {
      const rdata = await register(joinData);
      console.log('register 성공:', rdata);
      // TODO : 안내 모달
      alert('회원가입 성공!');
      onLoginClick();
    } catch (error) {
      console.log('register 실패:', error.response?.data || error);
      alert(error.response?.data?.error || '회원가입 중 오류가 발생했습니다.');
    }
  };

  // 이름: 빨간 테두리만 / 이메일·비밀번호·비밀번호확인: 테두리 + 에러 메시지
  const inputClass = (field) =>
    errors[field] && touched[field]
      ? 'login-input input--error'
      : 'login-input';

  const showMsg = (field) => errors[field] && touched[field];

  return (
    <div className={`login-form signup-form--${theme}`}>
      <h2>회원가입</h2>
      <p className="login-sub">이메일로 간편하게 계정을 만들어보세요</p>

      {/* 이름: 빨간 테두리만 */}
      <label className="login-label" htmlFor="signup-name">
        이름
      </label>
      <div className={inputClass('name')}>
        <input
          ref={refs.name}
          id="signup-name"
          type="text"
          placeholder="이름을 입력하세요"
          value={form.name}
          onChange={handleChange('name')}
          onBlur={handleBlur('name')}
        />
      </div>

      {/* 이메일: 테두리 + 에러 메시지 */}
      <label className="login-label" htmlFor="signup-email">
        이메일
      </label>
      <div className={inputClass('email') + ' has-error-slot'}>
        <input
          ref={refs.email}
          id="signup-email"
          type="text"
          placeholder="이메일을 입력하세요"
          value={form.email}
          onChange={handleChange('email')}
          onBlur={handleBlur('email')}
        />
      </div>
      <p className="signup-error-slot">
        {showMsg('email') ? errors.email : ''}
      </p>

      {/* 비밀번호: 테두리 + 에러 메시지 */}
      <label className="login-label" htmlFor="signup-password">
        비밀번호
      </label>
      <div className={inputClass('password') + ' has-error-slot'}>
        <input
          ref={refs.password}
          id="signup-password"
          type={showPassword ? 'text' : 'password'}
          placeholder="특수문자 포함 6자리 이상"
          value={form.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
        />
        <span
          className="login-input-icon login-input-icon-right"
          onClick={() => setShowPassword((prev) => !prev)}
          role="button"
          tabIndex={0}
        >
          {showPassword ? '◡' : '👁'}
        </span>
      </div>
      <p className="signup-error-slot">
        {showMsg('password') ? errors.password : ''}
      </p>

      {/* 비밀번호 확인: 테두리 + 에러 메시지 */}
      <label className="login-label" htmlFor="signup-password-confirm">
        비밀번호 확인
      </label>
      <div className={inputClass('passwordConfirm') + ' has-error-slot'}>
        <input
          ref={refs.passwordConfirm}
          id="signup-password-confirm"
          type={showPasswordConfirm ? 'text' : 'password'}
          placeholder="비밀번호를 다시 입력하세요"
          value={form.passwordConfirm}
          onChange={handleChange('passwordConfirm')}
          onBlur={handleBlur('passwordConfirm')}
        />
        <span
          className="login-input-icon login-input-icon-right"
          onClick={() => setShowPasswordConfirm((prev) => !prev)}
          role="button"
          tabIndex={0}
        >
          {showPasswordConfirm ? '◡' : '👁'}
        </span>
      </div>
      <p className="signup-error-slot">
        {showMsg('passwordConfirm') ? errors.passwordConfirm : ''}
      </p>

      {/* 약관 동의 */}
      <label className="login-remember">
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={handleChange('agreed')}
        />
        <span>
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="signup-terms-link"
          >
            이용약관
          </a>{' '}
          및{' '}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="signup-terms-link"
          >
            개인정보처리방침
          </a>
          에 동의합니다
        </span>
      </label>

      <button
        className={`login-submit signup-submit--${theme}`}
        onClick={handleSubmit}
      >
        회원가입
      </button>

      <p className="login-signup">
        이미 계정이 있으신가요?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onLoginClick();
          }}
        >
          로그인
        </a>
      </p>

      <div className="login-or">
        <span>소셜 계정으로 간편 가입</span>
      </div>
      <SocialButtons />
    </div>
  );
}

export default SignupForm;
