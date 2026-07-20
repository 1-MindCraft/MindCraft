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
// 수정된 부분 [2026-07-17]: lucide-react import 목록에서 Github 제거
// 이유(버그 리포트): "does not provide an export named 'Github'" 런타임 에러.
// lucide-react가 1.0으로 업그레이드되면서 GitHub/Slack/Figma 등 상표가 있는
// 브랜드 로고 아이콘들이 전부 라이브러리에서 삭제됨(라이선스/일관성 문제로
// lucide 팀이 공식적으로 브랜드 아이콘 지원을 중단함). 그래서 lucide-react에는
// 더 이상 Github라는 이름의 export가 존재하지 않음.
// 해결: lucide-react import에서 Github를 빼고, 파일 하단에 GitHub 마크를
// 인라인 SVG 컴포넌트(GithubIcon)로 직접 정의해서 대체함.
// before: Film, Github,
// after: Film, (Github 삭제)
// 수정된 부분 [2026-07-17]: lucide-react import에서 Move 삭제
// 이유: mc-window-tools(이동/커서/추가 아이콘 툴바)를 통째로 지우면서
// 그 안에서만 쓰이던 Move 아이콘이 더 이상 필요 없어져 함께 제거함.
// before: MousePointer2, Move, Network,
// after: MousePointer2, Network, (Move 삭제)
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Film,
  MousePointer2,
  Network,
  Play,
  Plus,
  // 수정된 부분 [2026-07-20]: PenLine 제거, Settings/Tags 추가
  // 이유(요청 - ONE SIMPLE FLOW 카드 수정): "1번째 버튼 - CAPTURE 아이콘 제거" —
  // PenLine은 processSteps 1번 카드에서만 쓰였는데, 그 아이콘 자리를 CONNECT의
  // Network로 교체하면서 PenLine을 쓰는 곳이 없어짐. 대신 2번째(키워드 추출)
  // 카드에 Tags, 3번째(자소서 마스터) 카드에 톱니바퀴 아이콘(Settings)이 필요해짐.
  // before: PenLine,
  // after: Settings, Tags, (PenLine 삭제, 알파벳 순서에 맞춰 재배치)
  Settings,
  Sparkles,
  Tags,
  WandSparkles,
} from 'lucide-react';
import './Main.css';
// 추가된 부분 [2026-07-16]: MainExperience.css import
// 이유: 리디자인 전용 스타일 시트. 반드시 Main.css '다음'에 import해야
// 같은 특이도(.mc-page ... vs .mindcraft-page ...)에서 새 스타일이 우선 적용됨.
import './MainExperience.css';

// 추가된 부분 [2026-07-17]: MindCraft 로고 이미지 import
// 이유(요청 8, 9): Footer와 새로 추가하는 introduction 영역에서 lucide 아이콘 대신
// 실제 MindCraft 로고 이미지를 쓰기 위해 추가. Nav.jsx와 동일한 자산/경로 재사용.
import LOGO_SRC from '../../assets/MindCraft-Logo1.png';

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
//
// 수정된 부분 [2026-07-17]: 3개 카드의 title / description 문구 전체 교체
// 이유(요청 2): 서비스 흐름(마인드맵 → 자소서 마스터 설정 → AI 생성)이 더 명확히
// 드러나도록 문구를 구체화해달라는 요청.
// before: title '경험을 꺼내 적어요' / description '프로젝트, 수상, 동아리까지. 떠오르는 경험을 짧은 키워드로 남겨보세요.'
// after:  title '나만의 경험을 모아보세요' / description '마인드맵에서 프로젝트, 활동, 강점 등 흩어진 경험을 자유롭게 정리하고 연결합니다.'
// before: title '맥락을 연결해요' / description '경험과 역량을 노드로 이어 나만의 커리어 지도를 완성해요.'
// after:  title '지원 직무에 맞게 설정하세요' / description '자소서 마스터를 만들고 회사 정보와 직무, 인재상 등을 입력해 AI가 참고할 기준을 설정합니다.'
// before: title 'AI가 문장으로 만들어요' / description '지원 직무에 꼭 맞는 자기소개서 초안을 단 몇 분 만에 만들어요.'
// after:  title 'AI가 자기소개서를 작성합니다' / description '항목을 생성한 뒤 버튼 한 번으로 마인드맵과 자소서 마스터를 기반으로 자기소개서 초안을 완성합니다.'
//
// 수정된 부분 [2026-07-20]: 3개 카드(CAPTURE/CONNECT/CRAFT) → 4개 카드로 재구성,
// 영어 eyebrow 문구를 한글로 교체
// 이유(요청 - ONE SIMPLE FLOW 카드 수정): Main.jsx에 새로 추가된 4단계 흐름
// (마인드맵 → 키워드 추출 → 자소서 마스터 → AI 생성)과 카드 개수/순서를 맞추기
// 위해 카드 하나(키워드 추출)를 새로 끼워 넣고, "CAPTURE 아이콘 제거 + CONNECT
// 아이콘을 1번으로 이동 + 한글 텍스트로 교체"를 그대로 반영함.
// - 1번(구 CAPTURE): 아이콘을 PenLine → Network(구 CONNECT 아이콘)로 교체,
//   eyebrow를 'CAPTURE' → '마인드맵 노드 연결'로 교체. title/description은
//   이미 마인드맵 내용이라 그대로 재사용.
// - 2번(신규): 키워드 추출 카드. 아이콘 Tags, eyebrow '키워드 추출'.
//   title/description은 아래 KeywordFeature 컴포넌트와 같은 문구로 통일.
// - 3번(구 CONNECT 자리, 내용은 재사용): 아이콘을 톱니바퀴(Settings)로,
//   eyebrow를 'CONNECT' → '자소서 마스터'로 교체. title/description('지원
//   직무에 맞게 설정하세요...')은 원래도 자소서 마스터 설명이라 그대로 재사용.
// - 4번(구 CRAFT): 아이콘 WandSparkles 그대로, eyebrow만 'CRAFT' → 'AI로
//   자소서 생성'으로 교체.
// - color는 4개를 구분하기 위해 violet/blue/mint에 새 색상 amber를 추가함
//   (CSS: mc-card-amber, 아래 CSS 파일 참고).
// before: 3개 항목(번호 01~03, eyebrow CAPTURE/CONNECT/CRAFT, PenLine/Network/WandSparkles)
// after: 아래 4개 항목으로 교체
const processSteps = [
  {
    number: '01',
    icon: Network,
    eyebrow: '마인드맵 노드 연결',
    title: '나만의 경험을 모아보세요',
    description: '마인드맵에서 프로젝트, 활동, 강점 등 흩어진 경험을 자유롭게 정리하고 연결합니다.',
    color: 'violet',
  },
  {
    number: '02',
    icon: Tags,
    eyebrow: '키워드 추출',
    title: '경험 속에서 핵심 키워드를 뽑아내요',
    description: '마인드맵에 쌓아둔 경험을 AI가 분석해서, 자기소개서에 바로 쓸 수 있는 핵심 키워드와 역량을 자동으로 정리해요.',
    color: 'blue',
  },
  {
    number: '03',
    icon: Settings,
    eyebrow: '자소서 마스터',

    eyebrow: '직무 맞춤 설정',
    title: '지원 직무에 맞게 설정하세요',
    description: '자소서 마스터를 만들고 회사 정보와 직무, 인재상 등을 입력해 AI가 참고할 기준을 설정합니다.',
    color: 'mint',
  },
  {
    number: '04',
    icon: WandSparkles,
    eyebrow: 'AI로 자소서 생성',
    title: 'AI가 자기소개서를 작성합니다',
    description: '항목을 생성한 뒤 버튼 한 번으로 마인드맵과 자소서 마스터를 기반으로 자기소개서 초안을 완성합니다.',
    color: 'amber',
  },
];

// 추가된 부분 [2026-07-16]: FAQ 데이터
// 이유: 기존 data/faqs.js(Faq 컴포넌트용) 대신 새 디자인 전용 FAQ를 파일 내에 정의
//
// 수정된 부분 [2026-07-17]: 기존 FAQ 3개 → 요청받은 FAQ 5개로 전면 교체
// 이유(요청 7): 저장 방식(자동 저장 → 저장 버튼) 등 실제 기능 변경사항을 반영하고,
// 자소서 마스터 / 자기소개서 생성·재생성 관련 질문을 새로 추가해달라는 요청.
// before: ['마인드맵은 처음인데 어렵지 않나요?', ...], ['작성한 내용은 자동으로 저장되나요?', ...], ['생성한 자기소개서를 수정할 수 있나요?', ...]
// after: 아래 5개 문항으로 교체
const faqs = [
  ['마인드맵을 처음 사용해도 괜찮나요?', '네. + 버튼으로 새로운 노드를 추가하고 이름을 입력하는 것만으로 쉽게 시작할 수 있습니다. 프로젝트, 활동, 경험 등을 연결하며 자연스럽게 나만의 마인드맵을 완성할 수 있습니다.'],
  ['작성한 내용은 저장할 수 있나요?', '네. 작업이 완료되면 저장 버튼을 눌러 작성한 내용을 저장할 수 있습니다. 저장된 내용은 언제든 다시 불러와 이어서 작업할 수 있습니다.'],
  ['자소서 마스터는 무엇인가요?', '자소서 마스터는 지원 기업명, 직무, 인재상 등 자기소개서 생성에 필요한 정보를 저장하는 공간입니다. 한 번 작성해두면 여러 자기소개서를 만들 때 반복 입력할 필요가 없습니다.'],
  ['자기소개서는 어떻게 생성되나요?', '마인드맵과 자소서 마스터에 입력한 정보를 바탕으로 AI가 자기소개서 초안을 생성합니다. 생성 버튼 한 번으로 지원 직무에 맞는 초안을 빠르게 받아볼 수 있습니다.'],
  ['생성된 자기소개서를 다시 만들 수 있나요?', '네. 생성 버튼을 다시 눌러 새로운 자기소개서를 생성할 수 있습니다.'],
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
//
// 참고 [2026-07-17]: 한때 이 로직을 "배속 없이 스크롤 비율 그대로" 방식으로
// 단순화해봤는데, 재확인 결과 이 아래 버전(배속 1.5 적용)이 실제로는 문제가
// 없다고 확인되어 다시 이 버전으로 되돌림.
function useScrollJourney() {
  const storyRef = useRef(null);
  // 추가된 부분 [2026-07-17]: 여정 라인 컨테이너(div.mc-journey-line) 참조용 ref
  // 이유(버그 리포트): "화면 크기를 줄이고 보니 선이 끝에 안 가있음". 원인은
  // .mc-journey-line이 height: 100%로 되어있는데, 부모인 .mc-scroll-story(<main>)는
  // 명시적 높이 없이 내용물(3개 패널)에 맞춰 자동으로 늘어나는 요소라서, 퍼센트
  // 높이가 항상 정확히 계산되지 않을 수 있음(특히 화면 폭이 바뀌어 패널들의
  // 실제 줄바꿈/높이가 달라지는 시점에 어긋나기 쉬움). CSS 퍼센트에 맡기는 대신
  // story의 실제 픽셀 높이(story.offsetHeight)를 재서 이 컨테이너의 height를
  // 인라인 스타일로 직접 못박아, 화면 크기와 무관하게 항상 실제 스토리 전체
  // 높이와 정확히 일치하도록 함.
  const lineRef = useRef(null);
  // 추가된 부분 [2026-07-17]: 여정 라인 물결선(ghost path) 참조용 ref
  // 이유: 아래 설명 참고 — 창 크기가 바뀔 때마다 path의 d 속성을 다시 그려야
  // 해서, 기존에는 ref가 없던 점선(배경) path에도 ref가 필요해짐.
  const ghostPathRef = useRef(null);
  const pathRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const story = storyRef.current;
    const line = lineRef.current;
    const ghostPath = ghostPathRef.current;
    const path = pathRef.current;
    const glow = glowRef.current;
    if (!story || !line || !ghostPath || !path || !glow) return undefined;

    // 추가된 부분 [2026-07-16]: 점이 스크롤보다 아주 조금만 먼저 이동하도록 설정
    // 이유: 1보다 크게 설정하면 점이 스크롤을 살짝 선행하지만 혼자 빠르게 달아나지 않음.
    const DOT_SCROLL_SPEED = 1.5;
    // 추가된 부분 [2026-07-16]: 시작점이 화면 최상단에 잘리지 않도록 약간 아래에서 시작
    const DOT_START_OFFSET_PX = 100;
    const PATH_SAMPLE_COUNT = 700;

    // 수정된 부분 [2026-07-17]: path를 고정 1200x3000 좌표가 아니라
    // "너비/높이에 대한 비율(0~1)"로 정의하고, 실제 렌더링 크기에 맞춰 매번
    // d 속성을 다시 그리도록 변경
    // 이유(버그 리포트): "브라우저 사이즈에 따라 선이 다르게 보임 — 100%일 때처럼
    // 동일하게 보이게 하고 싶다". 원인은 이 SVG가 viewBox="0 0 1200 3000"을
    // preserveAspectRatio="none"으로 실제 컨테이너 크기에 맞춰 가로/세로를 각각
    // 다른 비율로 늘려서 그리고 있었기 때문. 창 폭이 바뀌면 가로 확대 비율만
    // 바뀌고 세로 비율은 그대로라, 곡선의 좌우 폭 대 상하 길이 비율이 창
        // 크기마다 달라져 모양이 계속 다르게 보였음.
    // 해결: 고정 좌표 대신 각 점을 "가로/세로 비율(0~1)"로만 저장해두고,
    // 실제 컨테이너 너비(containerWidth)와 실제 스토리 높이(storyHeight)를 잴
    // 때마다 그 비율 그대로 real px 좌표로 환산해 d 속성을 다시 그림. 이러면
    // 좌표계가 항상 실제 렌더링 크기와 1:1로 맞아 늘어나거나 눌리는 왜곡 자체가
    // 생기지 않고, 곡선의 가로 폭 대 세로 길이 비율도 창 크기와 무관하게
    // 항상 동일하게 유지됨(=100%일 때와 똑같은 비율로 보임).
    // before: <path d="M600 0 C600 210 315 170 315 460 ..." /> (고정 좌표, JSX에 하드코딩)
    // after: 아래 PATH_POINTS(비율)로 매번 계산해서 setAttribute('d', ...)
    const PATH_POINTS = [
      [0.5, 0],
      [0.5, 0.07], [0.2625, 0.056667], [0.2625, 0.153333],
      [0.2625, 0.216667], [0.729167, 0.193333], [0.729167, 0.32],
      [0.729167, 0.413333], [0.3, 0.39], [0.3, 0.513333],
      [0.3, 0.603333], [0.691667, 0.59], [0.691667, 0.703333],
      [0.691667, 0.803333], [0.5, 0.816667], [0.5, 1],
    ];

    const buildPathD = (width, height) => {
      const toXY = ([fx, fy]) => `${(fx * width).toFixed(1)} ${(fy * height).toFixed(1)}`;
      let d = `M${toXY(PATH_POINTS[0])}`;
      for (let index = 1; index < PATH_POINTS.length; index += 3) {
        d += ` C${toXY(PATH_POINTS[index])} ${toXY(PATH_POINTS[index + 1])} ${toXY(PATH_POINTS[index + 2])}`;
      }
      return d;
    };

    let frame = null;
    let storyHeight = Math.max(story.offsetHeight, 1);
    let containerWidth = Math.max(line.clientWidth, 1);
    let targetProgress = 0;
    let displayProgress = 0;
    let targetOpacity = 0;
    // 수정된 부분 [2026-07-17]: pathLength/pathSamples를 상수가 아니라 재계산
    // 가능한 변수로 변경 (창 크기가 바뀔 때마다 path 자체가 다시 그려지므로
    // 경로 길이와 샘플도 그때그때 다시 구해야 함)
    let pathLength = 1;
    let pathSamples = [];

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

    // 추가된 부분 [2026-07-17]: 현재 containerWidth/storyHeight 기준으로
    // path의 d 속성 + 길이 샘플을 전부 다시 계산
    // 이유: 창 크기가 바뀌면 path 좌표 자체가 달라지므로, 진행률 계산에 쓰는
    // pathLength/pathSamples도 새 path 기준으로 다시 뽑아야 정확함.
    const rebuildPath = () => {
      const d = buildPathD(containerWidth, storyHeight);
      ghostPath.setAttribute('d', d);
      path.setAttribute('d', d);
      pathLength = path.getTotalLength();
      pathSamples = Array.from({ length: PATH_SAMPLE_COUNT + 1 }, (_, index) => {
        const length = pathLength * (index / PATH_SAMPLE_COUNT);
        const point = path.getPointAtLength(length);
        return { length, y: point.y };
      });
    };

    // 수정된 부분 [2026-07-17]: storyHeight/containerWidth를 재는 김에
    // line(여정 라인 컨테이너)의 실제 height와 path의 d 속성도 함께 다시 그림
    // before: const measure = () => { storyHeight = Math.max(story.offsetHeight, 1); line.style.height = `${storyHeight}px`; };
    // after: containerWidth 측정 + rebuildPath() 호출 추가
    const measure = () => {
      storyHeight = Math.max(story.offsetHeight, 1);
      containerWidth = Math.max(line.clientWidth, 1);
      line.style.height = `${storyHeight}px`;
      rebuildPath();
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
      // 수정된 부분 [2026-07-17]: glow 위치를 퍼센트로 환산할 때 고정
      // PATH_VIEWBOX_WIDTH/HEIGHT(1200/3000) 대신 실제 containerWidth/storyHeight로 나눔
      // 이유: path 좌표계가 더 이상 고정 1200x3000이 아니라 실제 렌더링 크기와
      // 1:1로 맞춰져 있으므로, 그 실제 크기 기준으로 퍼센트를 구해야 함.
      // before: glow.style.left = `${(point.x / PATH_VIEWBOX_WIDTH) * 100}%`;
      //         glow.style.top = `${(point.y / PATH_VIEWBOX_HEIGHT) * 100}%`;
      // after: 아래 2줄
      glow.style.left = `${(point.x / containerWidth) * 100}%`;
      glow.style.top = `${(point.y / storyHeight) * 100}%`;
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
      // 수정된 부분 [2026-07-17]: targetPathY 환산 시 더 이상 PATH_VIEWBOX_HEIGHT가
      // 필요 없음 — path 좌표계가 이미 storyHeight와 1:1로 맞춰져 있으므로
      // dotLocalY 자체가 곧 path 공간에서의 Y좌표임.
      // before: const targetPathY = (dotLocalY / storyHeight) * PATH_VIEWBOX_HEIGHT;
      // after: targetPathY = dotLocalY (변환 불필요)
      const targetPathY = dotLocalY;
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

    // 수정된 부분 [2026-07-17]: 마운트 시 onScroll()만 먼저 부르지 않고
    // measure()를 먼저 호출해 path의 d/길이/샘플을 만들어둔 뒤 onScroll() 실행
    // 이유: pathSamples/pathLength가 이제 rebuildPath()(= measure() 안에서 호출)로만
    // 채워지는데, 이 순서가 바뀌면 onScroll()이 먼저 돌면서 findProgressByY가
    // 빈 배열(pathSamples[0])을 참조해 에러가 날 수 있음.
    // before: onScroll();
    // after: measure(); onScroll();
    measure();
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

  return {
    storyRef, lineRef, ghostPathRef, pathRef, glowRef,
  };
}

// 추가된 부분 [2026-07-17]: GithubIcon 컴포넌트 (인라인 SVG)
// 이유: lucide-react 1.0에서 브랜드 아이콘(Github 포함)이 전부 제거되어
// 더 이상 lucide-react에서 import할 수 없음. introduction 섹션의 GitHub 링크에
// 쓸 마크를 표준적으로 널리 쓰이는 옥토캣 실루엣 SVG path로 직접 구현함.
// currentColor를 써서 부모 텍스트 색(.mc-intro-github)을 그대로 따라가도록 함.
function GithubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
    </svg>
  );
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
//
// 수정된 부분 [2026-07-20]: variant prop 추가('hero' | 'editing' | 'complete')
// 이유: 히어로, 01 MIND MAP, YOUR STORY STARTS HERE 세 군데에서 완전히 동일한
// 정지 화면(같은 노드 4개, 같은 배치)이 반복 노출되어 "같은 그림을 또 보여준다"는
// 인상을 준다는 피드백. "경험을 적는다(hero) → 확장하고 편집한다(01 MIND MAP =
// editing) → 이야기가 된다(클로징 = complete)"라는 하나의 서사로 이어지도록
// variant별로 다른 상태를 렌더링하게 분기함. 기본값 'hero'는 기존 마크업을
// 그대로 유지해 히어로 화면 자체는 변경 없음.
// before: function MiniMindMap({ compact = false }) { return (<div className={...}>...고정 마크업 1종...</div>); }
// after: variant에 따라 세 마크업(hero/editing/complete) 중 하나를 렌더링(아래)
function MiniMindMap({ compact = false, variant = 'hero' }) {
  // 수정된 부분 [2026-07-20]: 'editing' variant 분기 전체 삭제
  // 이유(요청 3-2): "MINDMAP 기존 가짜 마인드맵 삭제, GIF 추가 공간 추가" — 01 MIND MAP
  // 섹션(MindMapFeature)에서 이 variant를 쓰던 <MiniMindMap variant="editing" />를
  // mc-gif-placeholder로 교체하면서, 'editing' variant를 쓰는 곳이 이제 하나도
  // 남지 않아 죽은 코드가 됨. 관련 CSS(mc-map-node-editing-*, mc-map-node-sub*,
  // mc-map-node-ghost, mc-mini-map-line-sub-*/ghost, mc-node-pulse 등 keyframes)도
  // MainExperience.css에서 함께 삭제함.
  // before: if (variant === 'editing') { return (<div className="mc-mini-map mc-mini-map-editing">
  //           ...노드 8개(main/a/c/b/sub-1/2/3/ghost) + 곡선 7개 + 커서... </div>); }
  //         (전체 57줄 삭제)
  // after: (분기 삭제, 'complete'/'hero' 분기만 남음 — 아래)

  // 추가된 부분 [2026-07-20]: 'complete' variant — YOUR STORY STARTS HERE(클로징) 전용
  // 이유: 클로징 카피("당신의 경험은 이미 충분히 좋은 이야기예요")에 맞춰 중앙 노드를
  // '나의 경험' → '나의 이야기'로 바꾸고, 선의 시작/끝 좌표를 서로 뒤바꿔 안쪽(중앙)으로
  // 모여드는 방향으로 흐르게 해 "흩어진 경험이 하나의 이야기로 모인다"는 완성 상태를 표현.
  // 노드 배치(mc-map-node-a/b/c/d/main)는 hero와 동일한 클래스를 그대로 재사용하므로,
  // .mc-final-map 안에서 적용되는 흰색 톤 오버라이드(아래 CSS mc-final-map 규칙)도
  // 별도 수정 없이 그대로 적용됨.
  if (variant === 'complete') {
    return (
      <div className={`mc-mini-map mc-mini-map-complete${compact ? ' is-compact' : ''}`} aria-hidden="true">
        <svg className="mc-mini-map-lines" viewBox="0 0 640 380" preserveAspectRatio="none">
          <path d="M155 82 C240 82 245 190 320 190" />
          <path d="M500 82 C405 82 410 190 320 190" />
          <path d="M145 300 C235 300 245 190 320 190" />
          <path d="M515 300 C420 300 410 190 320 190" />
        </svg>
        <div className="mc-map-node mc-map-node-main"><Sparkles size={16} /> 나의 이야기</div>
        <div className="mc-map-node mc-map-node-a"><BriefcaseBusiness size={15} /> 아르바이트 경험</div>
        <div className="mc-map-node mc-map-node-b">팀 프로젝트</div>
        <div className="mc-map-node mc-map-node-c">자격증</div>
        <div className="mc-map-node mc-map-node-d">동아리 활동</div>
      </div>
    );
  }

  // 'hero' variant(기본값) — 기존 마크업 그대로 유지 (변경 없음)
  return (
    <div className={`mc-mini-map${compact ? ' is-compact' : ''}`} aria-hidden="true">
      <svg className="mc-mini-map-lines" viewBox="0 0 640 380" preserveAspectRatio="none">
        <path d="M320 190 C245 190 240 82 155 82" />
        <path d="M320 190 C405 190 410 82 500 82" />
        <path d="M320 190 C245 190 235 300 145 300" />
        <path d="M320 190 C410 190 420 300 515 300" />
      </svg>
      <div className="mc-map-node mc-map-node-main"><Sparkles size={16} /> 나의 경험</div>
      {/* 수정된 부분 [2026-07-17]: 마인드맵 노드 텍스트를 실제 사용자가 적을 법한
          일반적인 경험 키워드로 교체
          이유(요청 0): "프로젝트/Java·React/문제 해결/협업 경험"은 이미 정리된
          역량 키워드처럼 보여 실제 사용자가 마인드맵에 처음 적는 원본 항목과는
          결이 달랐음. 아르바이트/팀 프로젝트/자격증/동아리 활동처럼 사람들이
          흔히 마인드맵에 적어 넣는 보편적인 경험 항목으로 교체함.
          before: 프로젝트 / Java / React / 문제 해결 / 협업 경험
          after: 아르바이트 경험 / 팀 프로젝트 / 자격증 / 동아리 활동 */}
      <div className="mc-map-node mc-map-node-a"><BriefcaseBusiness size={15} /> 아르바이트 경험</div>
      <div className="mc-map-node mc-map-node-b">팀 프로젝트</div>
      <div className="mc-map-node mc-map-node-c">자격증</div>
      <div className="mc-map-node mc-map-node-d">동아리 활동</div>
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
      {/* 수정된 부분 [2026-07-17]: 좌상단의 작은 원형 장식(mc-orb-one) 삭제
          이유(사용자 피드백, 스크린샷): 20x20px 크기의 얇은 테두리 원이 배경에
          뚝 떨어져 혼자 떠있어서 의도된 장식이라기보다 "안 지워진 잔여물"처럼
          보인다는 지적. 우하단의 크고 부드럽게 블러 처리된 mc-orb-two(의도가
          분명한 은은한 배경 블롭)는 그대로 유지함.
          before: <div className="mc-hero-orb mc-orb-one" />
          after: (삭제됨) */}
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
            {/* 수정된 부분 [2026-07-17]: 히어로 상품 미리보기 창 안의 왼쪽 세로 툴바 제거
                이유(사용자 피드백, 스크린샷): 이동/커서/추가 아이콘이 담긴 작은 알약 모양
                툴바(mc-window-tools)를 빼달라는 요청.
                before: <div className="mc-window-body">
                          <aside className="mc-window-tools">...</aside>
                          <MiniMindMap />
                        </div>
                after: aside 삭제, MiniMindMap만 남김 */}
            <div className="mc-window-body">
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
//
// 수정된 부분 [2026-07-20]: 카드 내용을 아이콘 + 영어 문구만 남기고, 카드를 누르면
// 아래에 설명 글(왼쪽)/이미지 자리(오른쪽) 펼쳐지는 형태로 변경
// 이유(요청 1, 1-1, 손그림 스케치): "번호, 한글 텍스트, 문구, GIF 추가 예정 텍스트
// 삭제" + "아이콘 중간 가운데 정렬, 크기 증가" + "영어 텍스트 아이콘 아래에 재
// 위치" + "카드를 누르면 아래에 새로운 빈 공간이 생기면서 왼쪽에는 설명하는 글
// 오른쪽에는 사진을 넣을 수 있는 공간이 생기는 형식. 1번째 것은 무조건 Active
// 상태로 열려있고, 다른 카드를 클릭하면 그 카드로 Active가 옮겨감".
// before: <article ...><div className="mc-card-top"><span>{step.number}</span><Icon /></div>
//           <small>{eyebrow}</small><h3>{title}</h3><p>{description}</p>
//           <div className="mc-card-sketch">Film 아이콘 + "GIF 추가 예정"</div></article>
//         (클릭 동작 없음, 펼침 영역 없음)
// after: 카드는 아이콘 + eyebrow만 표시하는 button으로 변경, 그리드 아래에
// activeStep 상태를 공유하는 펼침 영역(mc-process-expand)을 추가
function ProcessSection() {
  // 추가된 부분 [2026-07-20]: 현재 펼쳐진 카드의 인덱스. 기본값 0(첫 번째 카드)이
  // 항상 Active 상태로 시작하도록 함.
  const [activeStep, setActiveStep] = useState(0);
  const activeData = processSteps[activeStep];

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
              // 수정된 부분 [2026-07-20]: <article> → 클릭 가능한 <button>으로 변경
              // 이유: 카드를 눌러 아래 펼침 영역의 내용을 바꾸는 상호작용이 생겨서,
              // 시맨틱하게도 접근성 측면에서도 button이 적절함.
              <button
                type="button"
                key={step.number}
                className={`mc-process-card mc-card-${step.color}${index === activeStep ? ' is-active' : ''}`}
                style={{ '--card-delay': `${index * 120}ms` }}
                onClick={() => setActiveStep(index)}
                aria-pressed={index === activeStep}
              >
                <div className="mc-card-icon"><Icon size={30} /></div>
                <small>{step.eyebrow}</small>
              </button>
            );
          })}
        </div>
        {/* 추가된 부분 [2026-07-20]: 카드 클릭 시 아래에 펼쳐지는 설명(왼쪽) + 이미지
            자리(오른쪽) 영역. activeStep이 가리키는 카드의 title/description을
            그대로 재사용함(카드 자체에서는 삭제됐지만 데이터는 processSteps에 남아있음). */}
        <div className="mc-process-expand" data-reveal>
          <div className="mc-process-expand-text">
            <h3>{activeData.title}</h3>
            <p>{activeData.description}</p>
          </div>
          <div className="mc-process-expand-media" aria-hidden="true">
            {/* 수정된 부분 [2026-07-20]: Film 아이콘 크기 28 → 34
                이유(사용자 피드백): "설명하는 부분과 그림 넣는 부분이 너무 작은데
                여유있는 공간이 있었으면 좋겠어" — 이미지 자리 자체를 키우면서
                (CSS: mc-process-expand-media 참고) 안의 아이콘도 다른 GIF
                placeholder(mc-gif-placeholder, size 34)와 같은 크기로 맞춤. */}
            <Film size={34} />
            <span>이미지 추가 예정</span>
          </div>
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
          <p>정해진 양식에 나를 끼워 맞추지 마세요. 자유롭게 노드를 만들고 연결하다 보면 <br /> 나만의 강점과 이야기가 자연스럽게 드러납니다.</p>
          {/* 수정된 부분 [2026-07-17]: 리스트 문구 2개 교체 + 1개 항목 삭제
              이유(요청 4): 자동 저장 안내 문구는 FAQ 쪽 문구(저장 버튼 방식)와
              내용이 어긋나서 완전히 삭제하고, 나머지 두 문구는 실제 기능(노드
              추가/편집, 항목별 정리)에 맞게 구체화함.
              before: <li>드래그 한 번으로 자유로운 노드 연결</li>
              before: <li>질문 가이드로 막힘없이 경험 정리</li>
              before: <li>작성하는 순간마다 안전하게 자동 저장</li> (삭제됨)
              after: 아래 2개 항목으로 교체 */}
          <ul>
            <li><Check size={16} /> 연결된 노드를 빠르게 추가하고 편집</li>
            <li><Check size={16} /> 프로젝트와 활동 경험을 항목별로 정리</li>
          </ul>
          {/* 수정된 부분 [2026-07-20]: 링크 타깃/문구 변경 (#features → #keyword)
              이유(요청 3): 마인드맵과 AI 크래프팅 사이에 "키워드 추출"/"자소서 마스터"
              단계가 새로 추가되면서, 이 링크는 (한 단계 건너뛴) AI CRAFTING이 아니라
              바로 다음 단계인 키워드 추출로 이어지는 게 흐름상 자연스러움.
              before: <a className="mc-inline-btn" href="#features">AI 기능까지 이어보기 <ArrowRight size={17} /></a>
              after: 아래로 교체 */}
          <a className="mc-inline-btn" href="#keyword">키워드 추출 살펴보기 <ArrowRight size={17} /></a>
        </div>
        <div className="mc-gif-placeholder" aria-hidden="true">
          {/* 수정된 부분 [2026-07-20]: mc-demo-frame(캡션 + 가짜 마인드맵 데모) 전체 삭제,
              AiFeature와 동일한 GIF 추가 자리(mc-gif-placeholder)로 교체
              이유(요청 3-2): "MINDMAP 기존 가짜 마인드맵 삭제, GIF 추가 공간 추가" —
              히어로/편집 상태를 예시로 보여주려 만든 정지 화면 목업 대신, 실제 기능을
              보여줄 GIF/영상을 나중에 넣을 수 있도록 자리만 마련. AiFeature 섹션에서
              이미 쓰고 있는 것과 같은 자리(디자인 통일)로 맞춤.
              before: <div className="mc-demo-frame">
                        <div className="mc-demo-caption"><small>자기소개서에 활용할 경험을 연결해 보세요</small></div>
                        <div className="mc-demo-canvas"><MiniMindMap variant="editing" /></div>
                      </div>
              after: 아래 Film 아이콘 + 안내 텍스트로 통일 (AiFeature와 동일 패턴) */}
          <Film size={34} />
          <span>GIF/영상 추가 예정</span>
        </div>
      </div>
    </section>
  );
}

// 추가된 부분 [2026-07-20]: KeywordFeature 컴포넌트 (내부 정의)
// 이유(요청 3): "단계 추가 - 02 · Keyword Extraction (키워드 추출)". 기존
// MindMapFeature/AiFeature와 같은 mc-feature-panel 구조를 그대로 따르는 새 단계.
// 실제 데모 화면이 아직 없어 AiFeature와 동일하게 mc-gif-placeholder를 씀.
// ※ 참고: title/description/list 문구는 요청에 없던 부분이라 기존 톤에 맞춰
// 초안으로 작성함 — 검수 후 문구를 다듬어주세요.
function KeywordFeature() {
  return (
    <section className="mc-story-panel mc-feature-panel" id="keyword">
      <div className="mc-panel-inner mc-feature-layout mc-feature-reverse" data-reveal>
        <div className="mc-feature-copy">
          <span className="mc-feature-index">02 · KEYWORD EXTRACTION</span>
          <h2>경험 속에서<br />핵심 키워드를 뽑아내요</h2>
          <p>마인드맵에 쌓아둔 경험을 AI가 분석해서, 자기소개서에 바로 쓸 수 있는 핵심 키워드와 역량을 자동으로 정리해요.</p>
          <ul>
            <li><Check size={16} /> 노드에 담긴 경험을 키워드 단위로 요약</li>
            <li><Check size={16} /> 지원 직무와 관련 있는 키워드부터 우선 정리</li>
          </ul>
          <a className="mc-inline-btn" href="#master">자소서 마스터 설정하러 가기 <ArrowRight size={17} /></a>
        </div>
        <div className="mc-gif-placeholder" aria-hidden="true">
          <Film size={34} />
          <span>GIF/영상 추가 예정</span>
        </div>
      </div>
    </section>
  );
}

// 추가된 부분 [2026-07-20]: MasterFeature 컴포넌트 (내부 정의)
// 이유(요청 3): "단계 추가 - 03 · Personal Statement Master (자소서 마스터)".
// FAQ에서만 언급되던 "자소서 마스터" 개념(회사/직무/인재상 정보 저장)에
// 전용 소개 섹션을 만들어달라는 요청. 구조는 위 KeywordFeature와 동일.
// ※ 참고: title/description/list 문구는 요청에 없던 부분이라 기존 톤에 맞춰
// 초안으로 작성함 — 검수 후 문구를 다듬어주세요.
function MasterFeature() {
  return (
    <section className="mc-story-panel mc-feature-panel" id="master">
      <div className="mc-panel-inner mc-feature-layout" data-reveal>
        <div className="mc-feature-copy">
          <span className="mc-feature-index">03 · PERSONAL STATEMENT MASTER</span>
          <h2>회사와 직무 정보를 한 곳에 정리해요</h2>
          <p>지원할 회사명, 직무, 인재상 같은 정보를 <br /> 자소서 마스터에 저장해두면, AI가 그 기준에 맞춰 자기소개서를 작성해요.</p>
          <ul>
            <li><Check size={16} /> 회사·직무·인재상 정보를 한 번만 입력</li>
            <li><Check size={16} /> 여러 자기소개서에서 반복 재사용</li>
          </ul>
          <a className="mc-inline-btn" href="#features">AI 자기소개서 생성 보기 <ArrowRight size={17} /></a>
        </div>
        <div className="mc-gif-placeholder" aria-hidden="true">
          <Film size={34} />
          <span>GIF/영상 추가 예정</span>
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
          {/* 수정된 부분 [2026-07-20]: 인덱스 번호 02 → 04
              이유(요청 3): 마인드맵(01)과 AI CRAFTING 사이에 키워드 추출(02)/자소서
              마스터(03) 단계가 새로 끼어들면서, AI CRAFTING은 네 번째 단계가 됨.
              before: <span className="mc-feature-index">02 · AI CRAFTING</span>
              after: 아래로 교체 */}
          <span className="mc-feature-index">04 · AI CRAFTING</span>
          <h2>연결된 경험이<br />설득력 있는 문장이 돼요</h2>
          <p>AI가 단순히 문장을 채우는 것이 아니라, 마인드맵 속 맥락을 읽고 지원 직무에 꼭 맞는 나만의 자기소개서를 만들어요.</p>
          {/* 수정된 부분 [2026-07-17]: 지표 3개 텍스트 교체
              이유(요청 5): 실제 기능 흐름(항목 생성 → 자동화 → 마인드맵 기반 초안 →
              언제든 다시 생성)에 맞게 문구를 구체화함.
              before: <b>3분</b><span>첫 초안 완성</span>
              before: <b>맥락 기반</b><span>개인화 문장</span>
              before: <b>언제든</b><span>수정·재생성</span>
              after: 아래 3개 쌍으로 교체 */}
          <div className="mc-metric-row">
            <div><b>항목 생성</b><span>자동화</span></div>
            {/* 수정된 부분 [2026-07-17]: "마인드맵을 반영한" 줄바꿈 처리
                이유(요청 4): mc-metric-row는 3열 그리드라 각 칸 폭이 좁은데,
                이 문구만 다른 두 문구(항목 생성/언제든)보다 길어서 폭이 부족한
                지점에서 글자가 어중간하게 끊겨 보였음. word-break로 아무 데서나
                끊기게 두는 대신, 의미 단위("마인드맵을" / "반영한")로 직접 줄바꿈 위치를
                지정해 항상 같은 자리에서 자연스럽게 끊기도록 함.
                before: <b>마인드맵을 반영한</b>
                after: <b>마인드맵을<br />반영한</b> */}
            <div><b>마인드맵을<br />반영한</b><span>자소서 초안</span></div>
            <div><b>언제든</b><span>다시 생성</span></div>
          </div>
          <a className="mc-inline-btn" href="#faq">자주 묻는 질문 보기 <ArrowRight size={17} /></a>
        </div>
        {/* 수정된 부분 [2026-07-17]: 왼쪽(mc-feature-reverse라 실제로는 좌측에 렌더링되는)
            자기소개서 미리보기 목업(mc-document-demo) 전체 삭제, GIF/영상을 넣을 수 있는
            빈 자리로 교체
            이유(요청 5): 정적 목업 대신 실제 기능을 보여줄 GIF/영상을 나중에 넣을 수
            있도록 자리만 마련해달라는 요청. 안에 있던 toolbar/문서 내용/타이핑 애니메이션을
            모두 제거하고 큰 점선 박스 하나로 대체함(CSS: mc-gif-placeholder, 아래 CSS 파일 참고).
            before: <div className="mc-document-demo"> ... (toolbar + 문서 내용 전체) ... </div>
            after: 아래 mc-gif-placeholder 박스로 교체 */}
        <div className="mc-gif-placeholder" aria-hidden="true">
          <Film size={34} />
          <span>GIF/영상 추가 예정</span>
        </div>
      </div>
    </section>
  );
}

// 추가된 부분 [2026-07-20]: IntroBreak 컴포넌트 (내부 정의)
// 이유(요청 2): "쉬는 구간인 빈 공간에 문구 생성" — ProcessSection(3단계 요약)과
// MindMapFeature(01 · MIND MAP) 사이, 지금까지 여정 라인만 지나가고 텍스트가
// 없던 빈 구간에 안내 문구 2줄을 넣어달라는 요청. mc-story-panel(전체 화면
// 높이)을 쓰면 다른 기능 섹션만큼 커져버려 "쉬는 구간"의 느낌이 사라지므로,
// 높이가 작은 전용 클래스(mc-intro-break)를 새로 만들어 가볍게 처리함.
function IntroBreak() {
  return (
    <section className="mc-intro-break" data-reveal>
      <div className="mc-panel-inner">
        <p>마인드맵과 자기소개서의 핵심 기능을 모두 가지고 있습니다</p>
        <span>MindCraft에서 편리하게 사용해보세요</span>
      </div>
    </section>
  );
}

// 추가된 부분 [2026-07-16]: JourneyLine 컴포넌트 (내부 정의)
// 이유: 스크롤 스토리 구간을 관통하는 여정 라인 SVG.
// useScrollJourney 훅의 pathRef/glowRef와 연결되어 진행도가 시각화됨.
//
// 수정된 부분 [2026-07-17]: 글로우 점 + 이정표 점을 SVG <circle>에서
// 일반 HTML 절대위치 요소(span)로 변경
// 이유(버그 리포트): "내 컴퓨터에서는 원이 정상인데 다른 사용자 컴퓨터에서는
// 타원으로 보인다". 원인은 이 SVG가 preserveAspectRatio="none"으로 가로/세로를
// 서로 다른 비율로 늘려서 화면을 꽉 채우도록 되어있는데(스크롤 진행 매핑을
// 위해 의도적으로 이렇게 함), <circle>은 반지름(r) 하나만 갖는 도형이라
// 가로/세로 확대 비율이 조금만 달라져도 타원으로 찌그러짐. 이 비율은
// "화면 폭 대비 스토리 전체 높이"에 좌우되는데, 폰트 렌더링/브라우저/OS/줌
// 등에 따라 사람마다 미묘하게 달라서 어떤 컴퓨터에서는 우연히 정원처럼
// 보이고 다른 컴퓨터에서는 눈에 띄게 타원으로 보였던 것.
// 해결: 늘어나도 상관없는 물결선(path)만 SVG에 남기고, 정원이어야 하는
// 점들(글로우 점, 이정표 점)은 SVG 밖으로 빼서 일반 HTML 요소로 만듦.
// 위치는 원본 뷰박스 좌표(0~1200, 0~3000)를 퍼센트로 환산해 left/top으로
// 잡으므로 컨테이너 안에서의 위치는 그대로 유지되고, 크기는 고정 px이라
// 가로/세로 스케일이 달라도 항상 정원으로 그려짐.
// before: <circle ref={glowRef} className="mc-path-glow" r="9" cx="600" cy="0" />
//         <g className="mc-path-landmarks"><circle .../>...</g>
// after: 아래 mc-path-landmark span 3개 + mc-path-glow span 1개로 교체
function JourneyLine({
  lineRef, ghostPathRef, pathRef, glowRef,
}) {
  return (
    <div className="mc-journey-line" ref={lineRef} aria-hidden="true">
      {/* 수정된 부분 [2026-07-17]: viewBox/preserveAspectRatio 제거
          이유: path의 d 속성을 이제 실제 렌더링 크기(containerWidth/storyHeight)
          기준으로 JS가 직접 계산해서 넣어주므로, svg 좌표계가 항상 실제 픽셀
          크기와 1:1로 맞음 — 뷰박스를 늘려서 맞추는 방식 자체가 필요 없어짐.
          before: <svg viewBox="0 0 1200 3000" preserveAspectRatio="none">
          after: <svg> (뷰박스 없음) */}
      <svg>
        <defs>
          <linearGradient id="journeyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset=".5" stopColor="#4f7cff" />
            <stop offset="1" stopColor="#28c7aa" />
          </linearGradient>
        </defs>
        {/* 수정된 부분 [2026-07-17]: 고정 d 좌표는 JS가 마운트 직후 바로 덮어쓰므로
            여기 적힌 d 값은 JS 실행 전 아주 잠깐 보일 수 있는 폴백일 뿐이고,
            ghost path에도 ref를 추가해 JS에서 d를 갱신할 수 있게 함.
            before: <path className="mc-path-ghost" d="M600 0 ..." /> (ref 없음)
            after: ref={ghostPathRef} 추가 */}
        <path ref={ghostPathRef} className="mc-path-ghost" d="M600 0 C600 210 315 170 315 460 C315 650 875 580 875 960 C875 1240 360 1170 360 1540 C360 1810 830 1770 830 2110 C830 2410 600 2450 600 3000" />
        <path ref={pathRef} className="mc-path-progress" pathLength="1" d="M600 0 C600 210 315 170 315 460 C315 650 875 580 875 960 C875 1240 360 1170 360 1540 C360 1810 830 1770 830 2110 C830 2410 600 2450 600 3000" />
      </svg>
      <span className="mc-path-landmark" style={{ left: '26.25%', top: '15.333%' }} />
      <span className="mc-path-landmark" style={{ left: '30%', top: '51.333%' }} />
      <span className="mc-path-landmark" style={{ left: '69.167%', top: '70.333%' }} />
      <span ref={glowRef} className="mc-path-glow" />
    </div>
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
        {/* 수정된 부분 [2026-07-17]: 태그 스트립(취업 준비/프로젝트 정리/직무 탐색/
            자기소개서/면접 준비) 전체 삭제
            이유(요청 6): 요청대로 해당 문구들을 화면에서 완전히 제거.
            before: <div className="mc-community-strip">...</div>
            after: (삭제됨) */}
        <div className="mc-final-card">
          <span><Sparkles size={15} /> YOUR STORY STARTS HERE</span>
          <h2>당신의 경험은 이미<br />충분히 좋은 이야기예요.</h2>
          <p>MindCraft와 함께 흩어진 조각을 연결해 보세요.</p>
          <button className="mc-primary-btn mc-primary-light" onClick={onStartClick}>{ctaLabel}<ArrowRight size={18} /></button>
          {/* 수정된 부분 [2026-07-20]: 히어로/01 MIND MAP과 동일했던 정적 마인드맵 대신
              variant="complete"를 전달해, 중앙 노드가 '나의 이야기'로 바뀌고 선이
              안쪽으로 모이는 완성 상태 화면으로 교체
              이유(사용자 피드백): "YOUR STORY STARTS HERE의 마인드맵도 위와 중복된다".
              "당신의 경험은 이미 충분히 좋은 이야기"라는 이 카드의 카피에 맞춰
              흩어진 경험이 하나의 이야기로 모이는 모습으로 마무리되도록 함.
              before: <MiniMindMap compact />
              after: <MiniMindMap compact variant="complete" /> */}
          <div className="mc-final-map" aria-hidden="true"><MiniMindMap compact variant="complete" /></div>
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

      {/* 수정된 부분 [2026-07-17]: Footer와 introduction을 하나의 검은 footer로 통합
          이유(사용자 피드백): 흰 배경 Footer(로고+태그라인+저작권)와 검은 배경
          Introduction(로고+이름+GitHub+만든사람)이 바로 붙어있어 로고가 두 번
          연속으로 나오고 색이 급하게 끊겨 "겹치는" 느낌을 줌.
          해결: 두 블록을 <footer className="mc-intro"> 하나로 합치고,
          - 로고는 하나만 남김: Footer 쪽 로고(mc-footer-logo-img, "#top" 링크)는 삭제,
            Introduction 쪽 로고(mc-intro-logo-img)만 유지
          - "생각을 연결해, 나만의 가능성을 발견하세요." 문구는 가운데 정렬 그대로
            유지한 채 맨 위 줄로 이동(mc-intro-tagline)
          - "© 2026 MindCraft Team"은 오른쪽 그대로 유지(mc-intro-copyright)
          - 로고/GitHub/만든사람은 왼쪽에 한 줄로 묶음(mc-intro-left)
          before: <footer className="mc-footer">...</footer> + <section className="mc-intro">...</section>
                  (로고 2개, 태그라인은 첫 번째 footer 가운데, 저작권은 첫 번째 footer 오른쪽)
          after: 아래 <footer className="mc-intro"> 하나로 통합 (mc-footer / mc-footer-logo-img
                 클래스는 더 이상 쓰이지 않음 — 아래 CSS 파일에서 함께 정리함) */}
      <footer className="mc-intro">
        <p className="mc-intro-tagline">생각을 연결해, 나만의 가능성을 발견하세요.</p>
        <div className="mc-intro-row">
          <div className="mc-intro-left">
            <a href="#top" className="mc-intro-brand">
              <img src={LOGO_SRC} alt="MindCraft" className="mc-intro-logo-img" />
              <b>MindCraft</b>
            </a>
            {/* 수정된 부분 [2026-07-17]: GitHub 링크를 실제 저장소 주소로 교체
                이유: 이전엔 실제 주소를 몰라서 placeholder(your-org/mindcraft)를
                써뒀는데, 실제 저장소 주소를 알려주셔서 반영함 (TODO 주석 제거).
                before: href="https://github.com/your-org/mindcraft"
                after: href="https://github.com/1-MindCraft/MindCraft" */}
            <a
              className="mc-intro-github"
              href="https://github.com/1-MindCraft/MindCraft"
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon size={18} /> GitHub
            </a>
            {/* 수정된 부분 [2026-07-17]: 만든 사람 placeholder → 실제 팀원 이름으로 교체
                before: <li>팀원 1</li> / <li>팀원 2</li> / <li>팀원 3</li>
                after: 아래 3명 이름으로 교체 */}
            <div className="mc-intro-credits">
              <span className="mc-intro-credits-label">만든 사람</span>
              <ul>
                <li>김세윤</li>
                <li>이원호</li>
                <li>임병서</li>
              </ul>
            </div>
          </div>
          <span className="mc-intro-copyright">© 2026 MindCraft Team</span>
        </div>
      </footer>
    </>
  );
}

function MainPage() {
  const navigate = useNavigate();
  // 추가된 부분 [2026-07-16]: useScrollJourney 훅 연결
  // 이유: 스크롤 스토리 구간(ref)과 여정 라인 SVG(pathRef/glowRef)를 묶어 진행도 표시
  const {
    storyRef, lineRef, ghostPathRef, pathRef, glowRef,
  } = useScrollJourney();
  // 수정된 부분 [2026-07-20]: threshold 0.45 → 0.13로 하향 (등장 시점을 훨씬 앞당김)
  // 이유(사용자 피드백, 스크린샷): "top 버튼이 떠오르는 시점이 너무 늦은 것 같아요.
  // 첨부한 이미지의 위치쯤부터 나타났으면 좋겠어" — 첨부 이미지는 히어로를 지나
  // ONE SIMPLE FLOW(프로세스 섹션) 초입에 막 들어선 지점이었음. 페이지 전체 길이
  // (히어로 100vh + 프로세스 100vh + 쉬는구간 + 기능 패널 4개×100vh + 클로징/FAQ/푸터)
  // 기준으로 그 지점은 대략 전체 스크롤의 12~15% 정도라 threshold를 0.13으로 낮춤.
  // 참고: useScrollButtons 훅 자체(스크롤 비율을 어떻게 계산하는지)는 이번에 받은
  // 파일에 포함되어 있지 않아 직접 보지 못했고, Main.jsx에서 넘기는 파라미터
  // 값만 조정했습니다 — 실제로 보시고 위치가 안 맞으면 이 숫자만 더 조절하면 돼요.
  // before: useScrollButtons({ threshold: 0.45, bottomOffset: 520 })
  // after: useScrollButtons({ threshold: 0.13, bottomOffset: 520 })
  const { showTopBtn, showFloatCta } = useScrollButtons({ threshold: 0.13, bottomOffset: 520 });
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
        <JourneyLine lineRef={lineRef} ghostPathRef={ghostPathRef} pathRef={pathRef} glowRef={glowRef} />
        <ProcessSection />
        {/* 추가된 부분 [2026-07-20]: 쉬는 구간 문구(IntroBreak) + 신규 단계 2개
            (KeywordFeature/MasterFeature) 삽입
            이유(요청 2, 3): "쉬는 구간인 빈 공간에 문구 생성" + "단계 추가(02 키워드
            추출, 03 자소서 마스터)". 순서는 01 마인드맵 → 02 키워드 추출 →
            03 자소서 마스터 → 04 AI 크래프팅(기존 AiFeature, 인덱스만 04로 변경). */}
        <IntroBreak />
        <MindMapFeature />
        <KeywordFeature />
        <MasterFeature />
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