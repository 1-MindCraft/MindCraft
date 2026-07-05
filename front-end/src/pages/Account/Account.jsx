import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';
import LOGO_SRC from '../../assets/MindCraft-Logo1.png';


// 목업 데이터 — 실제 API 연동 전까지 화면 구조 확인용
const MOCK_MINDMAPS = [
  { id: 1, title: '프로젝트 매니저 지원', updatedAt: '2026-07-01' },
  { id: 2, title: '백엔드 개발자 지원', updatedAt: '2026-06-24' },
];

const MOCK_COVER_LETTERS = [
  { id: 1, title: '프로젝트 매니저 지원 자소서', chars: 1258, updatedAt: '2026-07-01' },
  { id: 2, title: '백엔드 개발자 지원 자소서', chars: 980, updatedAt: '2026-06-25' },
];

const NAV_ITEMS = [
  { key: 'profile', label: '내 프로필' },
  { key: 'mindmaps', label: '내 마인드맵' },
  { key: 'coverletters', label: '내 자기소개서' },
];

function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  // ── 프로필 상태 (목업) ──
  const [name, setName] = useState('홍길동');
  const [email] = useState('user@example.com');
  const [hasPassword] = useState(false); // 소셜 로그인만 이용 중이라고 가정

  // ── 이름 편집 ──
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(name);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (isEditingName) {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }
  }, [isEditingName]);

  const confirmName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed) setName(trimmed);
    else setNameDraft(name);
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') confirmName();
    if (e.key === 'Escape') { setNameDraft(name); setIsEditingName(false); }
  };

  const handleSetPassword = () => {
    // TODO: 실제 비밀번호 설정 플로우 연동
    alert('비밀번호 설정 화면으로 연결될 예정이에요.');
  };

  const handleDeleteAccount = () => {
    // TODO: 실제 탈퇴 API 연동 + 별도 확인 모달로 교체 권장
    const confirmed = window.confirm(
      '계정을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?'
    );
    if (confirmed) {
      // TODO: 탈퇴 처리 후 로그아웃 및 랜딩 페이지 이동
      navigate('/');
    }
  };

  return (
    <div className="account-page">
      {/* 상단 바 */}
      <header className="account-header">
        <div className="account-header-logo" onClick={() => navigate('/')}>
          <img src={LOGO_SRC} alt="" className="account-logo-img" />
          <span className="account-logo-text">MIND <span>CRAFT</span></span>
        </div>
        <button className="account-back-btn" onClick={() => navigate(-1)}>
          ← 돌아가기
        </button>
      </header>

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
                    <span className="account-field-value">{name}</span>
                  )}
                  <button
                    className="account-field-btn"
                    onClick={() => {
                      setNameDraft(name);
                      setIsEditingName(true);
                    }}
                  >
                    이름 편집
                  </button>
                </div>
              </div>

              <div className="account-field-divider" />

              {/* 이메일 */}
              <div className="account-field">
                <div className="account-field-label">이메일</div>
                <div className="account-field-row">
                  <span className="account-field-value">{email}</span>
                </div>
              </div>

              <div className="account-field-divider" />

              {/* 비밀번호 */}
              <div className="account-field">
                <div className="account-field-label">비밀번호</div>
                <div className="account-field-row">
                  <span className="account-field-value account-field-value--muted">
                    {hasPassword ? '••••••••' : '설정되지 않음'}
                  </span>
                  <button className="account-field-btn" onClick={handleSetPassword}>
                    비밀번호 설정
                  </button>
                </div>
              </div>

              <div className="account-field-divider" />

              {/* 계정 삭제 */}
              <div className="account-field">
                <div className="account-field-label">계정 삭제</div>
                <div className="account-field-row">
                  <span className="account-field-warning">
                    ! 삭제한 후 복구할 수 없습니다. 작업 시 주의하십시오.
                  </span>
                  <button className="account-field-btn account-field-btn--danger" onClick={handleDeleteAccount}>
                    삭제하기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 내 마인드맵 */}
          {activeTab === 'mindmaps' && (
            <div className="account-grid">
              {MOCK_MINDMAPS.map((m) => (
                <div key={m.id} className="account-card" onClick={() => navigate('/mindmap')}>
                  <div className="account-card-thumb">🧠</div>
                  <div className="account-card-title">{m.title}</div>
                  <div className="account-card-meta">마지막 수정 {m.updatedAt}</div>
                </div>
              ))}
              <div className="account-card account-card--add" onClick={() => navigate('/mindmap')}>
                <div className="account-card-add-icon">+</div>
                <div className="account-card-add-label">새 마인드맵 만들기</div>
              </div>
            </div>
          )}

          {/* 내 자기소개서 */}
          {activeTab === 'coverletters' && (
            <div className="account-grid">
              {MOCK_COVER_LETTERS.map((c) => (
                <div key={c.id} className="account-card" onClick={() => navigate('/coverletter')}>
                  <div className="account-card-thumb">📝</div>
                  <div className="account-card-title">{c.title}</div>
                  <div className="account-card-meta">{c.chars.toLocaleString()}자 · 마지막 수정 {c.updatedAt}</div>
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