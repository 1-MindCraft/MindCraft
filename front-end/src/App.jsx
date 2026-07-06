import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainPage from './pages/Main/Main';
import MindMapPage from './pages/MindMap/MindMap';
import CoverLetterPage from './pages/CoverLetter/CoverLetter';
import TermsPage from './pages/Terms/Terms';
import PrivacyPage from './pages/Privacy/Privacy';
import AccountPage from './pages/Account/Account';
import HelpPage from './pages/Help/Help';
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