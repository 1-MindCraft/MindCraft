import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainPage from './MainPage/MainPage';
import MindMapPage from './MindMapPage/MindMapPage';
import CoverLetterPage from './CoverLetterPage/CoverLetterPage';
import TermsPage from './TermsPage/TermsPage';
import PrivacyPage from './PrivacyPage/PrivacyPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/mindmap" element={<MindMapPage userName="홍길동" />} />
      <Route
        path="/coverletter"
        element={<CoverLetterPage userName="프로젝트 매니저 지원" />}
      />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
    </Routes>
  );
}

export default App;