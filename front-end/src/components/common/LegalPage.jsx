import React from 'react';
import AppHeader from './AppHeader';
import './LegalPage.css';

// 이용약관 / 개인정보처리방침 페이지가 쓰는 공통 레이아웃.
// 두 페이지 모두 "로고 + 닫기 버튼 헤더 + 제목 + 본문" 구조가 완전히 똑같아서
// 이 컴포넌트 하나로 합치고, 각 페이지는 title과 본문(children)만 넘겨줌.
function LegalPage({ title, children }) {
  return (
    <div className="legal-page">
      <AppHeader actionLabel="닫기 ✕" onAction={() => window.close()} />

      <main className="legal-body">
        <h1 className="legal-title">{title}</h1>
        {children}
      </main>
    </div>
  );
}

export default LegalPage;
