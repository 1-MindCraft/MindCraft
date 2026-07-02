import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import MindMapPage from './pages/MindMapPage';
import CoverLetterPage from './pages/CoverLetterPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import AccountPage from './pages/AccountPage';
import HelpPage from './pages/HelpPage';
import DevNav from './components/common/DevNav';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/mindmap" element={<MindMapPage userName="홍길동" />} />
        <Route
          path="/coverletter"
          element={<CoverLetterPage userName="프로젝트 매니저 지원" />}
        />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
      <DevNav />
    </>
  );
}

export default App;