import React, { useState } from 'react';
import './MainPage.css';

import Nav from './components/Nav';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import FeatureSection from './components/FeatureSection';
import Faq from './components/Faq';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import TopButton from './components/TopButton';
import FloatingCta from './components/FloatingCta';
import LoginPage from '../LoginPage/LoginPage';
import SignupPage from '../SignupPage/SignupPage';

import useScrollButtons from './hooks/useScrollButtons';

const mindmapEditorFeatures = [
  {
    title: '자유로운 노드 연결',
    desc: '경험과 스킬을 노드로 연결해 나만의 역량 지도를 그려보세요.',
  },
  {
    title: '자동 저장 & 히스토리',
    desc: '작성 중인 마인드맵은 실시간으로 저장되어 언제든 이어서 작업할 수 있습니다.',
  },
  {
    title: '직무별 템플릿 제공',
    desc: '개발, 디자인, 마케팅 등 직무별 추천 구조로 빠르게 시작할 수 있습니다.',
  },
];

const aiGenerationFeatures = [
  {
    title: '자기소개서 문항 자동 생성',
    desc: '지원 회사와 직무를 입력하면 관련 자소서 문항과 답변 초안을 자동으로 작성합니다.',
  },
  {
    title: '산업 트렌드 반영',
    desc: 'AI가 직무 역량을 효과적으로 어필하는 표현으로 다듬어 완성도를 높여줍니다.',
  },
  {
    title: '다양한 포맷 내보내기',
    desc: 'PDF, Word 등 다양한 형식으로 즉시 다운로드하거나 링크로 공유하세요.',
  },
];

function MainPage() {
  const { showTopBtn, showFloatCta } = useScrollButtons({
    threshold: 0.5,
    bottomOffset: 80,
  });

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openLogin = () => { setIsLoginOpen(true); setIsSignupOpen(false); };
  const openSignup = () => { setIsSignupOpen(true); setIsLoginOpen(false); };
  const closeAll = () => { setIsLoginOpen(false); setIsSignupOpen(false); };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mindcraft-page">
      <Nav onLoginClick={openLogin} />
      <Hero onStartClick={openLogin} />
      <HowItWorks />

      {/* 마인드맵 에디터 */}
      <FeatureSection
        id="features"
        sectionClassName="feature-section"
        label="Core Feature"
        title="직관적인 마인드맵 에디터"
        sub="드래그 앤 드롭으로 경험을 정리하면 AI가 알아서 이력서 형태로 변환합니다."
        mediaLabel="마인드맵 에디터 화면 GIF"
        mediaHint="권장: 800×600 · 루프 GIF 또는 스크린샷"
        items={mindmapEditorFeatures}
      />

      {/* AI 이력서 생성 */}
      <FeatureSection
        sectionClassName="section"
        reverse
        label="AI Generation"
        title="개인화 AI 이력서 생성"
        sub="단순 템플릿이 아닌, 나만의 경험 데이터를 기반으로 한 진짜 맞춤 이력서."
        mediaLabel="AI 이력서 생성 화면 GIF"
        mediaHint="권장: 800×600 · 루프 GIF 또는 스크린샷"
        items={aiGenerationFeatures}
      />

      <Faq />
      <FinalCta onClick={openLogin} />
      <Footer />

      <FloatingCta visible={showFloatCta} onClick={openLogin} />
      <TopButton visible={showTopBtn} onClick={scrollToTop} />

      <LoginPage
        open={isLoginOpen}
        onClose={closeAll}
        onSignupClick={openSignup}
      />
      <SignupPage
        open={isSignupOpen}
        onClose={closeAll}
        onLoginClick={openLogin}
        theme="blue"
      />
    </div>
  );
}

export default MainPage;