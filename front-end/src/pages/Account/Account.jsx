import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';
import AppHeader from '../../components/common/AppHeader';
import Modal from '../../components/common/Modal';

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
  const { alert, confirm, promptPassword } = useModal(); // 수정된 부분: promptPassword 추가 (탈퇴 흐름에 필요)
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

  // 수정된 부분: 이름 변경 섹션/비밀번호 변경 섹션용 입력값 state와 제출 핸들러를 전부 제거하고 open/close만 남김
  // 이유: 순서 흐름상 버튼 + 빈 껍데기만 만들었음
  // before:
  //   const [nameEditValue, setNameEditValue] = useState('');
  //   const [nameEditPassword, setNameEditPassword] = useState('');
  //   const [newPassword, setNewPassword] = useState('');
  //   const [currentPassword, setCurrentPassword] = useState('');
  //   const [confirmNewPassword, setConfirmNewPassword] = useState('');
  //   const openInfoModal = () => { setNameEditValue(myInfo.name || ''); ...; setInfoModalOpen(true); };
  //   const closeInfoModal = () => { setInfoModalOpen(false); setNameEditValue(''); ...; };
  //   const handleNameEditSubmit = async () => { ... await updateMyInfo({ name: trimmed }); ... };
  //   const handlePasswordChangeSubmit = async () => { ... await updateMyInfo({ password: newPassword, currentPassword }); ... };
  // after:
  // 추가된 부분: 정보 수정 모달 열림 여부
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // 추가된 부분: 정보 수정 모달 열기/닫기 (지금은 빈 모달이라 입력값 초기화할 게 없음)
  const openInfoModal = () => setInfoModalOpen(true);
  const closeInfoModal = () => setInfoModalOpen(false);

  // 추가된 부분: 이름 변경 섹션 입력값
  const [nameEditValue, setNameEditValue] = useState('');
  const [nameEditPassword, setNameEditPassword] = useState('');

  // 추가된 부분: [ 이름 변경 ] 버튼 — 이름 변경 요청, 성공하면 알림 모달
  const handleNameEditSubmit = async () => {
    const trimmed = nameEditValue.trim();
    if (!trimmed) {
      await alert('이름을 입력해주세요.');
      return;
    }
    if (!nameEditPassword.trim()) {
      await alert('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const rdata = await updateMyInfo({ name: trimmed });
      setMyInfo((prev) => ({ ...prev, name: rdata.name }));
      updateLoginName?.(rdata.name);
      setNameEditValue('');
      setNameEditPassword('');
      await alert('이름 수정이 완료되었습니다.');
    } catch (error) {
      console.log('이름 수정 실패:', error.response?.data || error);
      await alert(error.response?.data?.error || '이름 수정 중 오류가 발생했습니다.');
    }
  };

  // 추가된 부분: 비밀번호 변경 섹션 입력값
  const [currentPasswordForChange, setCurrentPasswordForChange] = useState('');
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [confirmNewPasswordValue, setConfirmNewPasswordValue] = useState('');

  // 추가된 부분: [ 비밀번호 변경 ] 버튼 — 비밀번호 변경 요청, 성공하면 알림 모달
  const handlePasswordChangeSubmit = async () => {
    if (
      !currentPasswordForChange.trim() ||
      !newPasswordValue.trim() ||
      !confirmNewPasswordValue.trim()
    ) {
      await alert('모든 항목을 입력해주세요.');
      return;
    }
    if (newPasswordValue !== confirmNewPasswordValue) {
      await alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      await updateMyInfo({
        password: newPasswordValue,
        currentPassword: currentPasswordForChange,
      });
      setCurrentPasswordForChange('');
      setNewPasswordValue('');
      setConfirmNewPasswordValue('');
      await alert('비밀번호 변경이 완료되었습니다.');
    } catch (error) {
      console.log('비밀번호 변경 실패:', error.response?.data || error);
      await alert(
        error.response?.data?.error || '비밀번호 변경 중 오류가 발생했습니다.'
      );
    }
  };

  // 추가된 부분: [ 탈퇴하기 ] 버튼 — 비밀번호 입력 프롬프트 모달, 탈퇴 요청, 성공하면 알림 모달
   const handleDeleteAccount = async () => {
    const password = await promptPassword('현재 비밀번호를 입력해주세요.');
    if (password === null) return; // 취소 → 아무 반응 없이 조용히 종료
    if (!password.trim()) {
      await alert('비밀번호를 입력해주세요.');
      return;
    }

    try {
      await deleteMe(password);
      removeCookie('user');
      resetState();
      await alert('탈퇴가 처리가 완료되었습니다.');
      navigate('/');
    } catch (error) {
      console.log('deleteMe 실패:', error.response?.data || error);
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
                  <span className="account-field-value">{myInfo.name}</span>
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
                      <span className="account-field-value account-field-value--muted">
                        ••••••••
                      </span>
                    </div>
                  </div>

                  {/* 추가된 부분: [ 정보 수정 ] 버튼 — 비밀번호 항목 바로 아래 신설 */}
                  <div className="account-field">
                    <div className="account-field-row">
                      <button className="account-field-btn" onClick={openInfoModal}>
                        정보 수정
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
                  <button
                    className="account-field-btn account-field-btn--danger"
                    onClick={handleDeleteAccount}
                  >
                    탈퇴하기
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

      {/* 추가된 부분: 정보 수정 모달 (로그인 모달과 같은 Modal 컴포넌트 재사용) */}
      {/* 수정된 부분: 모달 안 내용(이름 변경/비밀번호 변경 두 섹션)을 전부 제거하고 빈 모달만 남김
          이유: 버튼 + 빈 모달이 열리는 것까지만 부탁하신 거라, 입력창/제출 버튼은 아직 안 넣음
          before:
            <Modal ...>
              이름 변경 섹션 — input(이름), input(비밀번호 확인), button
              비밀번호 변경 섹션 — input(새 비밀번호), input(현재 비밀번호), input(비밀번호 확인), button
              공통 [ 취소 ] 버튼
            </Modal>
          after: */}
      <Modal open={infoModalOpen} onClose={closeInfoModal} title="정보 수정">
        {/* 이름 변경 섹션 */}
        <div className="account-field-label" style={{ marginBottom: '0.4rem' }}>
          이름 변경
        </div>
        <input
          className="modal-input"
          style={{ marginTop: 0 }}
          placeholder="새로운 이름"
          value={nameEditValue}
          onChange={(e) => setNameEditValue(e.target.value)}
          maxLength={20}
        />
        <input
          type="password"
          className="modal-input"
          placeholder="비밀번호 확인"
          value={nameEditPassword}
          onChange={(e) => setNameEditPassword(e.target.value)}
        />
        <button
          className="modal-btn modal-btn--primary"
          style={{ display: 'block', margin: '0.6rem auto 0' }}
          onClick={handleNameEditSubmit}
        >
          이름 변경
        </button>

        <div className="account-field-divider" style={{ margin: '1.2rem 0' }} />

        {/* 비밀번호 변경 섹션 */}
        <div className="account-field-label" style={{ marginBottom: '0.4rem' }}>
          비밀번호 변경
        </div>
        <input
          type="password"
          className="modal-input"
          style={{ marginTop: 0 }}
          placeholder="현재 비밀번호"
          value={currentPasswordForChange}
          onChange={(e) => setCurrentPasswordForChange(e.target.value)}
        />
        <input
          type="password"
          className="modal-input"
          placeholder="새로운 비밀번호"
          value={newPasswordValue}
          onChange={(e) => setNewPasswordValue(e.target.value)}
        />
        <input
          type="password"
          className="modal-input"
          placeholder="새 비밀번호 확인"
          value={confirmNewPasswordValue}
          onChange={(e) => setConfirmNewPasswordValue(e.target.value)}
        />
        <button
          className="modal-btn modal-btn--primary"
          style={{ display: 'block', margin: '0.6rem auto 0' }}
          onClick={handlePasswordChangeSubmit}
        >
          비밀번호 변경
        </button>
      </Modal>
    </div>
  );
}

export default AccountPage;