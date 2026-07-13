import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainPage from './pages/Main/Main';
import MindMapPage from './pages/MindMap/MindMap';
import CoverLetterPage from './pages/CoverLetter/CoverLetter';
import LegalDocumentPage from './pages/Terms/Terms';
import AccountPage from './pages/Account/Account';
import HelpPage from './pages/Help/Help';
import DevNav from './components/common/DevNav';
import ApiTestPage from './pages/ApiTestPage';
import OAuth2CallbackPage from './pages/OAuth2Callback/OAuth2Callback';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        {/* [수정됨 | 2026-07-10]
            마인드맵 화면에 전달하던 고정 사용자 이름 prop을 제거했습니다.
            수정 이유: 로그인 사용자 이름은 Zustand loginState.name을 기준으로 표시됩니다. */}
        <Route path="/mindmap" element={<MindMapPage />} />
        <Route
          path="/coverletter"
          element={<CoverLetterPage userName="프로젝트 매니저 지원" />}
        />
        <Route path="/terms" element={<LegalDocumentPage type="terms" />} />
        <Route path="/privacy" element={<LegalDocumentPage type="privacy" />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />
        <Route path="/test" element={<ApiTestPage />} />
      </Routes>
      <DevNav />
    </>
  );
}

export default App;
