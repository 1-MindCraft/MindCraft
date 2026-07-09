import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';
import AppHeader from '../../components/common/AppHeader';

import LOGO_SRC from '../../assets/MindCraft-Logo1.png';
import { getMyInfo, updateMyInfo } from '../../axios/userApi';
import { deleteMe } from '../../axios/userApi';
import useLoginStore from '../../zustand/loginState';
import { useLoginActions } from '../../hooks/useLoginActions';
import { removeCookie } from '../../utils/cookieUtil';
import { useModal } from '../../components/common/ModalProvider';

// 목업 데이터 — 실제 API 연동 전까지 화면 구조 확인용
const MOCK_MINDMAPS = [
  { id: 1, title: '프로젝트 매니저 지원', updatedAt: '2026-07-01' },
  { id: 2, title: '백엔드 개발자 지원', updatedAt: '2026-06-24' },
];

const MOCK_COVER_LETTERS = [
  {
    id: 1,
    title: '프로젝트 매니저 지원 자소서',
    chars: 1258,
    updatedAt: '2026-07-01',
  },
  {
    id: 2,
    title: '백엔드 개발자 지원 자소서',
    chars: 980,
    updatedAt: '2026-06-25',
  },
];

const NAV_ITEMS = [
  { key: 'profile', label: '내 프로필' },
  { key: 'mindmaps', label: '내 마인드맵' },
  { key: 'coverletters', label: '내 자기소개서' },
];

function AccountPage() {
  const { alert, confirm } = useModal(); // 수정된 부분: 브라우저 기본 alert()/confirm() 대신 커스텀 모달 사용
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const resetState = useLoginStore((state) => state.resetState);
  const { updateLoginName } = useLoginActions();

  // ── 프로필 상태 (목업) ──
  // const [hasPassword] = useState(false); // 소셜 로그인만 이용 중이라고 가정

  const [myInfo, setMyInfo] = useState({});

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const rdata = await getMyInfo();
        console.log(rdata);
        setMyInfo({
          email: rdata.email,
          name: rdata.name,
          provider: rdata.provider,
        });
      } catch (error) {
        console.log(error.response?.data || error);
        // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
        await alert('회원정보를 가져오는데 실패했습니다.');
      }
    };

    fetchMyInfo();
  }, []);

  // ── 이름 편집 ──
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (isEditingName) {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }
  }, [isEditingName]);

  const confirmName = async () => {
    const trimmed = nameDraft.trim();

    if (!trimmed || trimmed === myInfo.name) {
      // 수정할 필요 없음
      setNameDraft(myInfo.name);
      setIsEditingName(false);
    }

    try {
      const rdata = await updateMyInfo({ name: trimmed });
      console.log('updateMyInfo 성공:', rdata);
      setMyInfo((prev) => ({ ...prev, name: rdata.name }));
    } catch (error) {
      console.log('updateMyInfo 실패:', error.response?.data || error);
      // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
      await alert(error.response?.data || '이름 변경 중 오류가 발생했습니다.');
      setNameDraft(myInfo.name);
    } finally {
      setIsEditingName(false);
    }
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') confirmName();
    if (e.key === 'Escape') {
      setNameDraft(myInfo.name);
      setIsEditingName(false);
    }
  };

  // ── 비밀번호 변경 ──
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordDraft, setPasswordDraft] = useState('');

  const handleSetPassword = () => {
    setIsEditingPassword(true);
  };

  const confirmPassword = async () => {
    const trimmed = passwordDraft.trim();
    if (!trimmed) {
      setIsEditingPassword(false);
      return;
    }

    try {
      // TODO: 현재 비밀번호 확인 모달 완성되면 함께 전달하도록 변경
      await updateMyInfo({ password: trimmed });
      // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
      await alert('비밀번호가 변경되었습니다.');
    } catch (error) {
      console.log(
        'updateMyInfo(password) 실패:',
        error.response?.data || error
      );
      // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
      await alert(
        error.response?.data?.error || '비밀번호 변경 중 오류가 발생했습니다.'
      );
    } finally {
      setPasswordDraft('');
      setIsEditingPassword(false);
    }
  };

  const handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter') confirmPassword();
    if (e.key === 'Escape') {
      setPasswordDraft('');
      setIsEditingPassword(false);
    }
  };

  // ── 계정 삭제 ──
  const [deletePassword, setDeletePassword] = useState('');

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
      await alert('비밀번호를 입력해주세요.');
      return;
    }

    // 수정된 부분: window.confirm() → await confirm() (커스텀 모달로 교체)
    const confirmed = await confirm(
      '계정을 삭제하면 진행한 작업이 모두 삭제되며, 복구할 수 없습니다. 정말 탈퇴하시겠습니까?'
    );
    if (!confirmed) return;

    try {
      await deleteMe(deletePassword);
      removeCookie('user');
      resetState();
      // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
      await alert('탈퇴가 완료되었습니다.');
      navigate('/');
    } catch (error) {
      console.log('deleteMe 실패:', error.response?.data || error);
      // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
      await alert(error.response?.data?.error || '비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="account-page">
      {/* 상단 바 */}
      <AppHeader actionLabel="← 돌아가기" onAction={() => navigate(-1)} />

      {/* 마이 페이지 타이틀 */}
      <div className="account-page-title">마이 페이지</div>
      <div className="account-title-divider" />

      <div className="account-layout">
        {/* 왼쪽: 세로 네비게이션 */}
        <nav className="account-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`account-nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* 세로 구분선 */}
        <div className="account-vertical-divider" />

        {/* 오른쪽: 콘텐츠 */}
        <div className="account-content">
          {/* 내 프로필 */}
          {activeTab === 'profile' && (
            <div className="account-profile">
              {/* 이름 */}
              <div className="account-field">
                <div className="account-field-label">이름</div>
                <div className="account-field-row">
                  {isEditingName ? (
                    <input
                      ref={nameInputRef}
                      className="account-field-input"
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      onBlur={confirmName}
                      onKeyDown={handleNameKeyDown}
                      maxLength={20}
                    />
                  ) : (
                    <span className="account-field-value">{myInfo.name}</span>
                  )}
                  <button
                    className="account-field-btn"
                    onClick={() => {
                      setNameDraft(myInfo.name);
                      setIsEditingName(true);
                    }}
                  >
                    이름 편집
                  </button>
                </div>
              </div>

              <div className="account-field-divider" />

              {/* 이메일 + 가입 방식 */}
              <div className="account-field">
                <div className="account-field-label">이메일</div>
                <div className="account-field-row">
                  <span className="account-field-value">{myInfo.email}</span>
                  <span className="account-field-value account-field-value--muted">
                    (
                    {myInfo.provider === 'LOCAL'
                      ? '이메일 가입'
                      : `${myInfo.provider} 계정`}
                    )
                  </span>
                </div>
              </div>

              <div className="account-field-divider" />

              {/* 비밀번호 */}
              {myInfo.provider === 'LOCAL' && (
                <>
                  <div className="account-field">
                    <div className="account-field-label">비밀번호</div>
                    <div className="account-field-row">
                      {isEditingPassword ? (
                        <input
                          type="password"
                          className="account-field-input"
                          placeholder="새 비밀번호 입력"
                          value={passwordDraft}
                          onChange={(e) => setPasswordDraft(e.target.value)}
                          onKeyDown={handlePasswordKeyDown}
                          autoFocus
                        />
                      ) : (
                        <span className="account-field-value account-field-value--muted">
                          ••••••••
                        </span>
                      )}
                      <button
                        className="account-field-btn"
                        onClick={
                          isEditingPassword
                            ? confirmPassword
                            : handleSetPassword
                        }
                      >
                        {isEditingPassword ? '변경 완료' : '비밀번호 설정'}
                      </button>
                    </div>
                  </div>
                  <div className="account-field-divider" />
                </>
              )}
              {/* 계정 삭제 */}
              <div className="account-field">
                <div className="account-field-label">계정 삭제</div>
                <div className="account-field-row">
                  <span className="account-field-warning">
                    기존 작업한 마인드맵과 자기소개서가 모두 삭제됩니다.
                    <br />
                    작업물과 회원 정보는 삭제한 후 복구할 수 없습니다.
                  </span>
                  <input
                    type="password"
                    className="account-field-input"
                    placeholder="비밀번호 확인 (임시)"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                  <button
                    className="account-field-btn account-field-btn--danger"
                    onClick={handleDeleteAccount}
                  >
                    서비스 탈퇴
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 내 마인드맵 */}
          {activeTab === 'mindmaps' && (
            <div className="account-grid">
              {MOCK_MINDMAPS.map((m) => (
                <div
                  key={m.id}
                  className="account-card"
                  onClick={() => navigate('/mindmap')}
                >
                  <div className="account-card-thumb">🧠</div>
                  <div className="account-card-title">{m.title}</div>
                  <div className="account-card-meta">
                    마지막 수정 {m.updatedAt}
                  </div>
                </div>
              ))}
              <div
                className="account-card account-card--add"
                onClick={() => navigate('/mindmap')}
              >
                <div className="account-card-add-icon">+</div>
                <div className="account-card-add-label">새 마인드맵 만들기</div>
              </div>
            </div>
          )}

          {/* 내 자기소개서 */}
          {activeTab === 'coverletters' && (
            <div className="account-grid">
              {MOCK_COVER_LETTERS.map((c) => (
                <div
                  key={c.id}
                  className="account-card"
                  onClick={() => navigate('/coverletter')}
                >
                  <div className="account-card-thumb">📝</div>
                  <div className="account-card-title">{c.title}</div>
                  <div className="account-card-meta">
                    {c.chars.toLocaleString()}자 · 마지막 수정 {c.updatedAt}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;