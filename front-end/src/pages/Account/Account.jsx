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
import { getCoverLetterList } from '../../axios/coverLetterApi';

// 목업 데이터 — 실제 API 연동 전까지 화면 구조 확인용
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

  // 수정된 부분: 이름 변경/비밀번호 변경 섹션용 입력값 state와 제출 핸들러를 전부 제거하고 open/close만 남김
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
  // 수정된 부분 [2026-07-14]: 정보 수정 모달(하나로 통합) 대신 이름 변경 모달 / 비밀번호 변경 모달을 각각 분리
  // before:
  //   const [infoModalOpen, setInfoModalOpen] = useState(false);
  //   const openInfoModal = () => setInfoModalOpen(true);
  //   const closeInfoModal = () => setInfoModalOpen(false);
  // after:
  // 추가된 부분 [2026-07-14]: 이름 변경 모달 / 비밀번호 변경 모달을 각각 따로 열고 닫음
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const openNameModal = () => setNameModalOpen(true);
  const closeNameModal = () => setNameModalOpen(false);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const openPasswordModal = () => setPasswordModalOpen(true);
  const closePasswordModal = () => setPasswordModalOpen(false);

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
      const rdata = await updateMyInfo({
        name: trimmed,
        currentPassword: nameEditPassword,
      });
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

    // 추가된 부분 [2026-07-15]: 탈퇴 전 한 번 더 확인하는 모달
    // 이유: 비밀번호만 입력하면 바로 탈퇴가 처리돼서, 실수로 탈퇴되는 걸 막기 위해
    // "정말로 탈퇴하시겠습니까?" 확인 단계를 추가함. 새로운 모달을 따로 만들 필요 없이
    // 공통 빈 모달(Modal.jsx)을 그대로 쓰는 ModalProvider의 confirm()을 재사용하고,
    // 버튼 텍스트만 '예'/'아니오'로 지정함
    const reallyWithdraw = await confirm(
      '정말로 탈퇴하시겠습니까?\n ※ 회원 탈퇴 시 작성하신 모든 데이터는 삭제되며 복구할 수 없습니다. ※',
      { confirmText: '예', cancelText: '아니오' }
    );
    // 추가된 부분 [2026-07-15]: [아니오] 선택 시 아무것도 바꾸지 않고 취소 안내만 띄운 뒤 종료
    // 이유: 요청대로 탈퇴 취소 시에는 데이터 변경 없이 모달만 닫혀야 함
    if (!reallyWithdraw) {
      await alert('탈퇴 처리가 취소되었습니다.');
      return;
    }

    try {
      await deleteMe(password);
      removeCookie('user');
      resetState();
      await alert('탈퇴 처리가 완료되었습니다.');
      navigate('/');
    } catch (error) {
      console.log('deleteMe 실패:', error.response?.data || error);
      await alert(error.response?.data?.error || '비밀번호가 일치하지 않습니다.');
    }
  };

  // 추가된 부분: 내 자기소개서 동기화(Allfind) — 자소서 목록 state + 동기화 트리거
  // 이유: 마인드맵 섹션을 없애는 대신, 자소서 목록은 "내 자기소개서" 탭을 열 때마다
  // 자동으로 서버에서 전체 조회(Allfind)해서 최신 상태로 맞추는 방식으로 하기로 함
  const [coverLetters, setCoverLetters] = useState(MOCK_COVER_LETTERS);
  const [syncingCoverLetters, setSyncingCoverLetters] = useState(false);

  // 추가된 부분: activeTab이 'coverletters'로 바뀔 때마다 자동으로 동기화
  useEffect(() => {
    if (activeTab !== 'coverletters') return;

    const syncCoverLetters = async () => {
      setSyncingCoverLetters(true);
      try {
        const list = await getCoverLetterList();
        setCoverLetters(
          list.map((c) => ({
            id: c.id,
            title: c.title || '(제목 없음)',
            chars: (c.sections || []).reduce(
              (sum, s) => sum + (s.answer?.length || 0),
              0
            ),
            updatedAt: c.updatedAt || '',
          }))
        );
      } catch (error) {
        console.log('자소서 동기화 실패:', error.response?.data || error);
        await alert('자소서 동기화 중 오류가 발생했습니다.');
      } finally {
        setSyncingCoverLetters(false);
      }
    };

    syncCoverLetters();
  }, [activeTab]);

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
                  {/* 수정된 부분 [2026-07-14]: [ 이름 변경 ] 버튼 재배치 — 이름 필드 옆
                      before: <span>{myInfo.name}</span> (버튼 없음, 정보 수정 버튼이 비밀번호 밑에 있었음)
                      after: */}
                  <button className="account-field-btn" onClick={openNameModal}>
                    이름 변경
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
                      <span className="account-field-value account-field-value--muted">
                        ••••••••
                      </span>
                      {/* 수정된 부분 [2026-07-14]: [ 정보 수정 ] 버튼을 [ 비밀번호 변경 ] 버튼으로 교체하고 비밀번호 필드 옆으로 재배치
                          before: <span>••••••••</span> (버튼 없음, [정보 수정]은 이 필드 아래 별도 블록에 있었음)
                          after: */}
                      <button className="account-field-btn" onClick={openPasswordModal}>
                        비밀번호 변경
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

          {/* 내 자기소개서 */}
          {activeTab === 'coverletters' && (
            <div>
              {/* 수정된 부분: 버튼 없이, 동기화 중일 때만 안내 문구 표시 */}
              {syncingCoverLetters && (
                <div className="account-field" style={{ marginBottom: '1rem' }}>
                  <div className="account-field-row">
                    <span className="account-field-value account-field-value--muted">
                      자기소개서 동기화 중...
                    </span>
                  </div>
                </div>
              )}

              <div className="account-grid">
                {coverLetters.map((c) => (
                  <div
                    key={c.id}
                    className="account-card"
                    onClick={() => navigate('/coverletter')}
                  >
                    <div className="account-card-thumb">📝</div>
                    <div className="account-card-title">{c.title}</div>
                    <div className="account-card-meta">
                      {/* 수정된 부분 [2026-07-15]: 글자수(자) 텍스트 제거
                          이유: 마이페이지 자기소개서 카드에 뜨는 "NN자" 표시가 불필요하다는 요청으로 삭제.
                          글자수 앞에 붙던 " · " 구분자도 같이 제거해서 updatedAt만 있을 때
                          맨 앞에 어색한 " · "가 남지 않도록 함
                          before: {c.chars.toLocaleString()}자{c.updatedAt ? ` · 마지막 수정 ${c.updatedAt}` : ''}
                          after: */}
                      {c.updatedAt ? `마지막 수정 ${c.updatedAt}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 수정된 부분 [2026-07-14]: 정보 수정 모달(하나, 안에 두 섹션) → 이름 변경 모달 / 비밀번호 변경 모달(각각 독립)로 분리
          before:
            <Modal open={infoModalOpen} title="정보 수정">
              이름 변경 섹션...
              구분선
              비밀번호 변경 섹션...
            </Modal>
          after: */}
      {/* 추가된 부분 [2026-07-14]: 이름 변경 모달 (기존 정보 수정 모달에서 이름 변경 섹션만 분리) */}
      <Modal open={nameModalOpen} onClose={closeNameModal} title="이름 변경">
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
      </Modal>

      {/* 추가된 부분 [2026-07-14]: 비밀번호 변경 모달 (기존 정보 수정 모달에서 비밀번호 변경 섹션만 분리) */}
      <Modal open={passwordModalOpen} onClose={closePasswordModal} title="비밀번호 변경">
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