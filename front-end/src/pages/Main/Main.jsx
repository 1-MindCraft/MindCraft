// ═══════════════════════════════════════════════════════════════
// 수정된 부분 [2026-07-16]: 메인화면(MainPage) 전면 리디자인 교체
// 이유: 기존 섹션 컴포넌트 조합(Hero/HowItWorks/FeatureSection/Faq/FinalCta/Footer)
// 방식에서 "스크롤 여정(Journey Line)" 기반의 새 디자인으로 전면 교체.
// 새 섹션들은 이 파일 안의 내부 컴포넌트로 정의됨.
//
// [기존에서 제거된 import — 다른 곳에서 사용되지 않음을 grep으로 확인, 파일 자체는 보존]
// before: import Hero from '../../components/Main/Hero';
// before: import HowItWorks from '../../components/Main/HowItWorks';
// before: import FeatureSection from '../../components/Main/FeatureSection';
// before: import Faq from '../../components/Main/Faq';
// before: import FinalCta from '../../components/Main/FinalCta';
// before: import Footer from '../../components/Main/Footer';
// after: (전부 삭제 — Hero/Process/Feature/FAQ/Footer를 이 파일 내부 컴포넌트로 대체)
//
// [유지된 기존 로직 — 충돌 없음 확인]
// - Nav (components/Main/Nav) : isMember / onLoginClick prop 그대로 사용
// - TopButton / FloatingCta : visible / onClick / ctaLabel prop 그대로 사용
// - LoginPage / SignupPage 모달 : open / onClose / onSignupClick / onLoginClick / theme 그대로
// - getCookie('user') 기반 회원 판별 + 회원이면 /mindmap 바로 이동 로직 그대로
// ═══════════════════════════════════════════════════════════════
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 추가된 부분 [2026-07-16]: lucide-react 아이콘 import
// 이유: 새 디자인의 섹션/카드/버튼 아이콘을 lucide-react로 통일.
// ※ 주의: 현재 src 어디에서도 lucide-react를 쓰지 않았음 → package.json에 없다면
//    `npm install lucide-react` 를 먼저 실행해야 함 (미설치 시 빌드 에러).
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Download,
  FileText,
  MousePointer2,
  Move,
  Network,
  PenLine,
  Play,
  Plus,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import './Main.css';
// 추가된 부분 [2026-07-16]: MainExperience.css import
// 이유: 리디자인 전용 스타일 시트. 반드시 Main.css '다음'에 import해야
// 같은 특이도(.mc-page ... vs .mindcraft-page ...)에서 새 스타일이 우선 적용됨.
import './MainExperience.css';

import Nav from '../../components/Main/Nav';
import TopButton from '../../components/Main/TopButton';
import FloatingCta from '../../components/Main/FloatingCta';
import LoginPage from '../Login/Login';
import SignupPage from '../Signup/Signup';
// 수정된 부분: removeCookie import 삭제 (이유: handleLogout 함수를 없애면서 더 이상 여기서 안 씀)
import { getCookie } from '../../utils/cookieUtil';
import useScrollButtons from '../../hooks/useScrollButtons';

// 추가된 부분 [2026-07-16]: 프로세스 3단계 데이터
// 이유: 기존 data/steps.js(HowItWorks용) 대신 새 디자인 전용 단계 데이터를 파일 내에 정의
const processSteps = [
  {
    number: '01',
    icon: PenLine,
    eyebrow: 'CAPTURE',
    title: '경험을 꺼내 적어요',
    description: '프로젝트, 수상, 동아리까지. 떠오르는 경험을 짧은 키워드로 남겨보세요.',
    color: 'violet',
  },
  {
    number: '02',
    icon: Network,
    eyebrow: 'CONNECT',
    title: '맥락을 연결해요',
    description: '경험과 역량을 노드로 이어 나만의 커리어 지도를 완성해요.',
    color: 'blue',
  },
  {
    number: '03',
    icon: WandSparkles,
    eyebrow: 'CRAFT',
    title: 'AI가 문장으로 만들어요',
    description: '지원 직무에 꼭 맞는 자기소개서 초안을 단 몇 분 만에 만들어요.',
    color: 'mint',
  },
];

// 추가된 부분 [2026-07-16]: FAQ 데이터
// 이유: 기존 data/faqs.js(Faq 컴포넌트용) 대신 새 디자인 전용 FAQ를 파일 내에 정의
const faqs = [
  ['마인드맵은 처음인데 어렵지 않나요?', '빈 캔버스에서 막막하지 않도록 경험별 질문과 예시 노드를 제공해요. 클릭과 드래그만으로 누구나 쉽게 시작할 수 있습니다.'],
  ['작성한 내용은 자동으로 저장되나요?', '네. 작성 중인 노드와 문서는 자동 저장되어 언제든 이어서 작업할 수 있습니다.'],
  ['생성한 자기소개서를 수정할 수 있나요?', '물론이에요. AI 초안을 바탕으로 문장을 직접 다듬고, 원하는 항목만 다시 생성할 수 있습니다.'],
];

// 추가된 부분 [2026-07-16]: useScrollJourney 훅
// 이유: 스크롤 진행도에 따라 여정 라인(SVG path)의 진행 표시와
// 글로우 포인트 위치를 rAF(requestAnimationFrame)로 갱신하기 위한 훅
//
// 수정된 부분 [2026-07-16]: 점의 이동 기준을 "전체 경로 진행률"에서
// "실제로 스크롤한 픽셀 거리" 기준으로 변경
// 이유: 기존 방식은 약 2개 화면을 스크롤하는 동안 3개 화면 높이의 경로를
// 전부 이동해, 점이 스크롤보다 빠르게 앞질러 간 뒤 일찍 사라지는 문제가 있었음.
//
// 변경 결과
// - 점은 스크롤 거리와 거의 같은 속도로 이동함.
// - DOT_SCROLL_SPEED(1.5)를 적용해 점이 스크롤보다 약 50% 앞서 이동하도록 조정됨.
// - 경로 끝에 도착해도 바로 사라지지 않고, 스토리 영역이 화면 위로
//   빠져나가는 마지막 구간에서만 천천히 사라짐.
function useScrollJourney() {
  const storyRef = useRef(null);
  const pathRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const story = storyRef.current;
    const path = pathRef.current;
    const glow = glowRef.current;
    if (!story || !path || !glow) return undefined;

    // 추가된 부분 [2026-07-16]: 점이 스크롤보다 아주 조금만 먼저 이동하도록 설정
    // 이유: 1보다 크게 설정하면 점이 스크롤을 살짝 선행하지만 혼자 빠르게 달아나지 않음.
    const DOT_SCROLL_SPEED = 1.5;
    // 추가된 부분 [2026-07-16]: 시작점이 화면 최상단에 잘리지 않도록 약간 아래에서 시작
    const DOT_START_OFFSET_PX = 100;
    const PATH_VIEWBOX_HEIGHT = 3000;
    const PATH_SAMPLE_COUNT = 700;

    let frame = null;
    let storyHeight = Math.max(story.offsetHeight, 1);
    let targetProgress = 0;
    let displayProgress = 0;
    let targetOpacity = 0;

    const pathLength = path.getTotalLength();

    // 추가된 부분 [2026-07-16]: 경로를 미리 여러 지점으로 나눠 저장
    // 이유: 단순히 경로 길이 비율을 쓰면 곡선이 크게 휘는 부분에서 점의 세로 속도가
    // 달라질 수 있으므로, 목표 세로 위치와 가장 가까운 경로 지점을 찾아 사용함.
    const pathSamples = Array.from({ length: PATH_SAMPLE_COUNT + 1 }, (_, index) => {
      const length = pathLength * (index / PATH_SAMPLE_COUNT);
      const point = path.getPointAtLength(length);
      return { length, y: point.y };
    });

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const findProgressByY = (targetY) => {
      let nearest = pathSamples[0];
      let nearestDistance = Math.abs(nearest.y - targetY);

      for (let index = 1; index < pathSamples.length; index += 1) {
        const sample = pathSamples[index];
        const distance = Math.abs(sample.y - targetY);
        if (distance < nearestDistance) {
          nearest = sample;
          nearestDistance = distance;
        }
      }

      return nearest.length / pathLength;
    };

    const measure = () => {
      storyHeight = Math.max(story.offsetHeight, 1);
    };

    const animate = () => {
      // 수정된 부분 [2026-07-16]: 즉시 순간이동하지 않고 목표 위치를 부드럽게 따라감
      // 이유: 느린 스크롤에서도 점이 튀지 않으면서, 지나치게 늦게 끌려오지 않도록 0.24 적용.
      displayProgress += (targetProgress - displayProgress) * 0.24;

      if (Math.abs(targetProgress - displayProgress) < 0.0003) {
        displayProgress = targetProgress;
      }

      story.style.setProperty('--journey-progress', displayProgress);

      const point = path.getPointAtLength(pathLength * displayProgress);
      glow.setAttribute('cx', point.x);
      glow.setAttribute('cy', point.y);
      glow.style.opacity = String(targetOpacity);

      if (Math.abs(targetProgress - displayProgress) > 0.0003) {
        frame = window.requestAnimationFrame(animate);
      } else {
        frame = null;
      }
    };

    const onScroll = () => {
      const rect = story.getBoundingClientRect();
      const scrolledInsideStory = Math.max(-rect.top, 0);

      // 수정된 부분 [2026-07-16]: 첫 구간은 1.5배 속도를 유지하고,
      // AI CRAFTING 구간부터는 남은 스크롤 거리에 맞춰 속도를 낮춤.
      // 이유: 첫 번째 MIND MAP 화면에서는 점이 원하는 위치까지 빠르게 와야 하지만,
      // 같은 1.5배 속도를 끝까지 유지하면 AI CRAFTING에서 점이 먼저 끝나버렸음.
      const maxScrollableDistance = Math.max(
        storyHeight - window.innerHeight,
        1,
      );

      // 전체 스크롤 거리의 52%까지는 기존 1.5배 속도를 그대로 사용함.
      // 이 지점 이후부터 마지막 스크롤 위치까지 남은 경로를 균등하게 나눠 이동함.
      const aiSlowdownStart = maxScrollableDistance * 0.52;
      const fastSectionEndY = clamp(
        aiSlowdownStart * DOT_SCROLL_SPEED + DOT_START_OFFSET_PX,
        0,
        storyHeight,
      );

      let dotLocalY;

      if (scrolledInsideStory <= aiSlowdownStart) {
        dotLocalY = scrolledInsideStory * DOT_SCROLL_SPEED + DOT_START_OFFSET_PX;
      } else {
        const remainingScrollDistance = Math.max(
          maxScrollableDistance - aiSlowdownStart,
          1,
        );
        const aiSectionProgress = clamp(
          (scrolledInsideStory - aiSlowdownStart) / remainingScrollDistance,
          0,
          1,
        );

        // 수정된 부분 [2026-07-16]: AI CRAFTING 구간에서는 초반 이동량을 더 줄이고,
        // 마지막 스크롤에 가까워질수록 남은 경로를 따라잡도록 ease-in 보간을 적용함.
        // 이유: ease-out은 AI 구간 초반부터 점이 빠르게 이동해 스크롤보다 먼저 끝나는 문제가 있었음.
        // before: 1 - ((1 - aiSectionProgress) ** 1.15)
        // after: aiSectionProgress ** 2.15
        const easedAiProgress = aiSectionProgress ** 2.15;
        dotLocalY = fastSectionEndY
          + (storyHeight - fastSectionEndY) * easedAiProgress;
      }

      dotLocalY = clamp(dotLocalY, 0, storyHeight);
      const targetPathY = (dotLocalY / storyHeight) * PATH_VIEWBOX_HEIGHT;
      targetProgress = findProgressByY(targetPathY);

      // 수정된 부분 [2026-07-16]: 진행률이 95%를 넘었다는 이유로 점을 지우지 않음
      // 이유: 점이 먼저 끝에 도착하더라도 스토리 영역이 화면에 남아 있는 동안 유지함.
      const fadeIn = clamp(scrolledInsideStory / 140, 0, 1);
      const fadeOut = clamp(rect.bottom / 180, 0, 1);
      targetOpacity = Math.min(fadeIn, fadeOut);

      if (!frame) frame = window.requestAnimationFrame(animate);
    };

    const handleResize = () => {
      measure();
      onScroll();
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(story);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { storyRef, pathRef, glowRef };
}

// 추가된 부분 [2026-07-16]: useReveal 훅
// 이유: [data-reveal] 요소가 뷰포트에 들어오면 is-visible 클래스를 붙여
// 등장 애니메이션을 트리거 (IntersectionObserver 사용)
function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.01 }, // 뷰포트에 1%만 들어와도 등장 처리
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

// 추가된 부분 [2026-07-16]: MiniMindMap 컴포넌트
// 이유: 히어로/데모/클로징 섹션에서 재사용되는 장식용 미니 마인드맵 목업
function MiniMindMap({ compact = false }) {
  return (
    <div className={`mc-mini-map${compact ? ' is-compact' : ''}`} aria-hidden="true">
      <svg className="mc-mini-map-lines" viewBox="0 0 640 380" preserveAspectRatio="none">
        <path d="M320 190 C245 190 240 82 155 82" />
        <path d="M320 190 C405 190 410 82 500 82" />
        <path d="M320 190 C245 190 235 300 145 300" />
        <path d="M320 190 C410 190 420 300 515 300" />
      </svg>
      <div className="mc-map-node mc-map-node-main"><Sparkles size={16} /> 나의 경험</div>
      <div className="mc-map-node mc-map-node-a"><BriefcaseBusiness size={15} /> 프로젝트</div>
      <div className="mc-map-node mc-map-node-b">Java · React</div>
      <div className="mc-map-node mc-map-node-c">문제 해결</div>
      <div className="mc-map-node mc-map-node-d">협업 경험</div>
      {!compact && <div className="mc-map-cursor"><MousePointer2 size={19} fill="currentColor" /><span>나</span></div>}
    </div>
  );
}

// 추가된 부분 [2026-07-16]: Hero 컴포넌트 (내부 정의)
// 이유: 기존 components/Main/Hero.jsx를 대체하는 리디자인 히어로.
// onStartClick / ctaLabel prop 인터페이스는 기존과 동일하게 유지해 충돌 방지.
function Hero({ onStartClick, ctaLabel }) {
  return (
    <header className="mc-hero" id="top">
      <div className="mc-hero-orb mc-orb-one" />
      <div className="mc-hero-orb mc-orb-two" />
      <div className="mc-hero-inner">
        <div className="mc-hero-copy" data-reveal>
          <div className="mc-pill"><Sparkles size={14} /> 생각을 연결하면, 가능성이 보여요</div>
          <h1>흩어진 내 경험을<br /><span>하나의 이야기</span>로.</h1>
          <p>마인드맵으로 경험을 연결하고, AI로 나만의 자기소개서를 완성하세요. 막막했던 시작이 선명해집니다.</p>
          <div className="mc-hero-actions">
            <button className="mc-primary-btn" onClick={onStartClick}>{ctaLabel}<ArrowRight size={18} /></button>
            <a className="mc-text-link" href="#journey"><Play size={15} fill="currentColor" /> 어떻게 작동하나요?</a>
          </div>
          <div className="mc-trust-row">
            <span className="mc-avatar-stack"><i>민</i><i>수</i><i>지</i></span>
            <span><b>500+</b> 취업 준비생의 생각이 연결되는 중</span>
          </div>
        </div>

        <div className="mc-hero-visual" data-reveal>
          <div className="mc-window-shadow" />
          <div className="mc-product-window">
            <div className="mc-window-top">
              <span className="mc-window-dots"><i /><i /><i /></span>
              <span>나의 커리어 마인드맵</span>
              <span className="mc-live"><i /> 저장됨</span>
            </div>
            <div className="mc-window-body">
              <aside className="mc-window-tools"><Move size={17} /><MousePointer2 size={17} /><Plus size={17} /></aside>
              <MiniMindMap />
            </div>
          </div>
          <div className="mc-floating-note mc-note-top"><Check size={15} /> 경험 연결 완료</div>
          <div className="mc-floating-note mc-note-bottom"><BrainCircuit size={17} /><span><b>AI 분석 중</b><small>나만의 강점 발견</small></span></div>
        </div>
      </div>
      <a className="mc-scroll-cue" href="#journey"><span>SCROLL TO EXPLORE</span><i><ChevronDown size={17} /></i></a>
    </header>
  );
}

// 추가된 부분 [2026-07-16]: ProcessSection 컴포넌트 (내부 정의)
// 이유: 기존 HowItWorks 섹션 대체. Nav의 "#journey" 앵커가 이 섹션의 id와 연결됨.
function ProcessSection() {
  return (
    <section className="mc-story-panel mc-process" id="journey">
      <div className="mc-panel-inner" data-reveal>
        <div className="mc-section-heading">
          <span>ONE SIMPLE FLOW</span>
          <h2>생각에서 합격에 가까운 문장까지</h2>
          <p>복잡한 기능 대신, 경험에 집중할 수 있는 세 단계만 남겼어요.</p>
        </div>
        <div className="mc-process-grid">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article className={`mc-process-card mc-card-${step.color}`} key={step.number} style={{ '--card-delay': `${index * 120}ms` }}>
                <div className="mc-card-top"><span>{step.number}</span><Icon size={23} /></div>
                <small>{step.eyebrow}</small>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className="mc-card-sketch" aria-hidden="true">
                  {index === 0 && <><i className="mc-line-long" /><i className="mc-line-short" /><PenLine size={29} /></>}
                  {index === 1 && <><i /><i /><i /><svg viewBox="0 0 180 55"><path d="M25 28 C55 2 75 50 95 28 S135 5 158 28" /></svg></>}
                  {index === 2 && <><Sparkles size={22} /><i className="mc-ai-line" /><Check size={22} /></>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 추가된 부분 [2026-07-16]: MindMapFeature 컴포넌트 (내부 정의)
// 이유: 기존 FeatureSection(마인드맵 에디터) 대체. Nav의 "#mindmap" 앵커와 연결됨.
function MindMapFeature() {
  return (
    <section className="mc-story-panel mc-feature-panel" id="mindmap">
      <div className="mc-panel-inner mc-feature-layout" data-reveal>
        <div className="mc-feature-copy">
          <span className="mc-feature-index">01 · MIND MAP</span>
          <h2>머릿속 경험을<br />눈에 보이게 연결해요</h2>
          <p>정해진 양식에 나를 끼워 맞추지 마세요. 자유롭게 노드를 만들고 연결하다 보면 나만의 강점과 이야기가 자연스럽게 드러납니다.</p>
          <ul>
            <li><Check size={16} /> 드래그 한 번으로 자유로운 노드 연결</li>
            <li><Check size={16} /> 질문 가이드로 막힘없이 경험 정리</li>
            <li><Check size={16} /> 작성하는 순간마다 안전하게 자동 저장</li>
          </ul>
          <a className="mc-inline-btn" href="#features">AI 기능까지 이어보기 <ArrowRight size={17} /></a>
        </div>
        <div className="mc-demo-frame">
          <div className="mc-demo-caption"><span><i /> LIVE DEMO</span><small>마우스로 노드를 연결해 보세요</small></div>
          <div className="mc-demo-canvas"><MiniMindMap /></div>
          <div className="mc-demo-toast"><Check size={16} /> 새로운 연결에서 '문제 해결력'을 발견했어요</div>
        </div>
      </div>
    </section>
  );
}

// 추가된 부분 [2026-07-16]: AiFeature 컴포넌트 (내부 정의)
// 이유: 기존 FeatureSection(AI 이력서 생성) 대체. Nav의 "#features" 앵커와 연결됨.
function AiFeature() {
  return (
    <section className="mc-story-panel mc-feature-panel mc-ai-panel" id="features">
      <div className="mc-panel-inner mc-feature-layout mc-feature-reverse" data-reveal>
        <div className="mc-feature-copy">
          <span className="mc-feature-index">02 · AI CRAFTING</span>
          <h2>연결된 경험이<br />설득력 있는 문장이 돼요</h2>
          <p>AI가 단순히 문장을 채우는 것이 아니라, 마인드맵 속 맥락을 읽고 지원 직무에 꼭 맞는 나만의 자기소개서를 만들어요.</p>
          <div className="mc-metric-row">
            <div><b>3분</b><span>첫 초안 완성</span></div>
            <div><b>맥락 기반</b><span>개인화 문장</span></div>
            <div><b>언제든</b><span>수정·재생성</span></div>
          </div>
          <a className="mc-inline-btn" href="#faq">자주 묻는 질문 보기 <ArrowRight size={17} /></a>
        </div>
        <div className="mc-document-demo">
          <div className="mc-document-toolbar">
            <span><FileText size={16} /> 자기소개서 초안</span>
            <div><button aria-label="다운로드"><Download size={15} /></button><button>내보내기</button></div>
          </div>
          <div className="mc-document-content">
            <span className="mc-doc-label">지원 동기 및 입사 후 포부</span>
            <h3>연결을 통해 더 나은 답을 찾는<br />개발자 김민지입니다.</h3>
            <p>팀 프로젝트에서 사용자의 불편을 발견하고, 데이터를 기반으로 문제의 원인을 좁혀나갔습니다. <mark>서로 다른 의견을 하나의 목표로 연결한 경험</mark>은 협업의 가치를 배우는 계기가 되었습니다.</p>
            <p className="mc-typing-line">이 경험을 바탕으로, 사용자와 기술을 연결하는...</p>
            <div className="mc-ai-status"><span><Sparkles size={15} /> MindCraft AI가 작성하고 있어요</span><i><i /></i></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 추가된 부분 [2026-07-16]: JourneyLine 컴포넌트 (내부 정의)
// 이유: 스크롤 스토리 구간을 관통하는 여정 라인 SVG.
// useScrollJourney 훅의 pathRef/glowRef와 연결되어 진행도가 시각화됨.
function JourneyLine({ pathRef, glowRef }) {
  return (
    <svg className="mc-journey-line" viewBox="0 0 1200 3000" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="journeyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset=".5" stopColor="#4f7cff" />
          <stop offset="1" stopColor="#28c7aa" />
        </linearGradient>
        <filter id="journeyGlow" x="-200%" y="-200%" width="400%" height="400%"><feGaussianBlur stdDeviation="11" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path className="mc-path-ghost" d="M600 0 C600 210 315 170 315 460 C315 650 875 580 875 960 C875 1240 360 1170 360 1540 C360 1810 830 1770 830 2110 C830 2410 600 2450 600 3000" />
      <path ref={pathRef} className="mc-path-progress" pathLength="1" d="M600 0 C600 210 315 170 315 460 C315 650 875 580 875 960 C875 1240 360 1170 360 1540 C360 1810 830 1770 830 2110 C830 2410 600 2450 600 3000" />
      <circle ref={glowRef} className="mc-path-glow" r="9" cx="600" cy="0" />
      <g className="mc-path-landmarks">
        <circle cx="315" cy="460" r="14" /><circle cx="315" cy="460" r="5" />
        <circle cx="360" cy="1540" r="14" /><circle cx="360" cy="1540" r="5" />
        <circle cx="830" cy="2110" r="14" /><circle cx="830" cy="2110" r="5" />
      </g>
    </svg>
  );
}

// 추가된 부분 [2026-07-16]: ClosingSection 컴포넌트 (내부 정의)
// 이유: 기존 FinalCta + Faq + Footer 세 컴포넌트를 대체하는 마무리 구역.
// FAQ 아코디언 상태(openFaq)를 이 컴포넌트가 자체 관리함.
function ClosingSection({ onStartClick, ctaLabel }) {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <>
      <section className="mc-closing" data-reveal>
        <div className="mc-community-strip">
          {['취업 준비', '프로젝트 정리', '직무 탐색', '자기소개서', '면접 준비'].map((label, index) => <span key={label}><i>{['민', '준', '서', '윤', '하'][index]}</i>{label}</span>)}
        </div>
        <div className="mc-final-card">
          <span><Sparkles size={15} /> YOUR STORY STARTS HERE</span>
          <h2>당신의 경험은 이미<br />충분히 좋은 이야기예요.</h2>
          <p>MindCraft와 함께 흩어진 조각을 연결해 보세요.</p>
          <button className="mc-primary-btn mc-primary-light" onClick={onStartClick}>{ctaLabel}<ArrowRight size={18} /></button>
          <div className="mc-final-map" aria-hidden="true"><MiniMindMap compact /></div>
        </div>
      </section>

      <section className="mc-faq" id="faq">
        <div className="mc-faq-heading"><span>FAQ</span><h2>궁금한 점이 있나요?</h2></div>
        <div className="mc-faq-list">
          {faqs.map(([question, answer], index) => (
            <article className={openFaq === index ? 'is-open' : ''} key={question}>
              <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{question}</span><Plus size={19} /></button>
              <div><p>{answer}</p></div>
            </article>
          ))}
        </div>
      </section>

      <footer className="mc-footer">
        <a href="#top"><Network size={23} /><b>MIND <span>CRAFT</span></b></a>
        <p>생각을 연결해, 나만의 가능성을 발견하세요.</p>
        <span>© 2026 MindCraft Team</span>
      </footer>
    </>
  );
}

function MainPage() {
  const navigate = useNavigate();
  // 추가된 부분 [2026-07-16]: useScrollJourney 훅 연결
  // 이유: 스크롤 스토리 구간(ref)과 여정 라인 SVG(pathRef/glowRef)를 묶어 진행도 표시
  const { storyRef, pathRef, glowRef } = useScrollJourney();
  // 수정된 부분 [2026-07-16]: useScrollButtons 파라미터 조정
  // 이유: 새 페이지는 스크롤 길이가 훨씬 길어짐. 플로팅 CTA가 마지막 FinalCta/FAQ/푸터
  // 구역(약 520px)과 겹치지 않도록 bottomOffset을 크게 늘리고, 탑 버튼 노출 시점도 소폭 앞당김.
  // before: useScrollButtons({ threshold: 0.5, bottomOffset: 80 })
  // after: useScrollButtons({ threshold: 0.45, bottomOffset: 520 })
  const { showTopBtn, showFloatCta } = useScrollButtons({ threshold: 0.45, bottomOffset: 520 });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // 추가된 부분 [2026-07-16]: 등장 애니메이션 훅 실행
  useReveal();

  const openLogin = () => { setIsLoginOpen(true); setIsSignupOpen(false); };
  const openSignup = () => { setIsSignupOpen(true); setIsLoginOpen(false); };
  const closeAll = () => { setIsLoginOpen(false); setIsSignupOpen(false); };
  // 회원 여부: 쿠키에 로그인 정보(accessToken 등)가 있으면 회원으로 간주 (기존 로직 유지)
  const isMember = Boolean(getCookie('user'));
  // 수정된 부분 [2026-07-16]: 비회원 CTA 문구를 명시적으로 지정
  // 이유: 기존에는 undefined를 넘겨 각 컴포넌트의 기본 문구를 썼지만,
  // 새 디자인은 Hero/FloatingCta/ClosingSection이 같은 ctaLabel을 공유하므로
  // 여기서 한 곳에서 문구를 확정함. (회원 문구 '마인드맵 바로가기'는 기존과 동일)
  // before: const ctaLabel = isMember ? '마인드맵 바로가기' : undefined;
  // after: const ctaLabel = isMember ? '마인드맵 바로가기' : '무료로 시작하기';
  const ctaLabel = isMember ? '마인드맵 바로가기' : '무료로 시작하기';
  // 비회원: 로그인 모달 / 회원: 바로 마인드맵 이동 (기존 로직 유지, 한 줄로 축약)
  const handleCtaClick = () => isMember ? navigate('/mindmap') : openLogin();

  return (
    // 수정된 부분 [2026-07-16]: 루트 클래스에 mc-page 추가
    // 이유: 기존 Main.css의 기본 골격(.mindcraft-page)은 유지하면서,
    // MainExperience.css의 .mc-page 하위 셀렉터가 새 디자인으로 덮어쓰도록 하는 핵심 장치.
    // before: <div className="mindcraft-page">
    // after: <div className="mindcraft-page mc-page">
    <div className="mindcraft-page mc-page">
      <Nav isMember={isMember} onLoginClick={openLogin} />
      <Hero onStartClick={handleCtaClick} ctaLabel={ctaLabel} />
      {/* 추가된 부분 [2026-07-16]: 스크롤 스토리 구역 (여정 라인 + 3개 섹션) */}
      <main ref={storyRef} className="mc-scroll-story">
        <JourneyLine pathRef={pathRef} glowRef={glowRef} />
        <ProcessSection />
        <MindMapFeature />
        <AiFeature />
      </main>
      <ClosingSection onStartClick={handleCtaClick} ctaLabel={ctaLabel} />

      <FloatingCta visible={showFloatCta} onClick={handleCtaClick} ctaLabel={ctaLabel} />
      <TopButton visible={showTopBtn} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      <LoginPage open={isLoginOpen} onClose={closeAll} onSignupClick={openSignup} />
      <SignupPage open={isSignupOpen} onClose={closeAll} onLoginClick={openLogin} theme="blue" />
    </div>
  );
}

export default MainPage;