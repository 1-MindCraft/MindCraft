import React, { useState } from 'react';
import './CoverLetter.css';

import CLHeader from '../../components/CoverLetter/CLHeader';
import CLToolbar from '../../components/CoverLetter/CLToolbar';
import CLMindMap from '../../components/CoverLetter/CLMindMap';
import CLDraft from '../../components/CoverLetter/CLDraft';
import CLSettings from '../../components/CoverLetter/CLSettings';

// 문항 데이터를 최상위(CoverLetterPage)에서 관리해서
// CLDraft(문항 목록/상세)와 CLSettings(문항 구성 라디오)가 같은 상태를 공유합니다.
const INITIAL_SECTIONS = [
  {
    id: 1,
    title: '지원 동기',
    content: `저는 사람과 조직을 연결하고, 목표를 달성하는 데 기여하는 프로젝트 매니저의 역할에 매력을 느껴 지원하게 되었습니다.

다양한 프로젝트를 경험하며 기획부터 실행, 성과 도출까지 전 과정을 주도적으로 이끌어 왔습니다. 특히 A회사 프로젝트에서는 팀원들과의 긴밀한 협업을 통해 정해진 기간 내에 목표를 달성하여 고객 만족도를 높였고, B회사 프로젝트에서는 리스크 관리를 통해 문제를 사전에 예방하고 프로젝트의 안정적인 진행을 이끌었습니다.

이러한 경험을 바탕으로 귀사에서 더 큰 가치를 만들어가고 싶습니다.`,
    sourceNodes: ['주요 역량 > 기획력', '주요 역량 > 일정 관리', '경험 > A회사 프로젝트'],
  },
  {
    id: 2,
    title: '성장과정',
    content: `어릴 때부터 팀을 이끄는 것에 자연스럽게 흥미를 느꼈습니다. 학창 시절 다양한 팀 프로젝트를 통해 협업의 중요성을 깨달았고, 이를 바탕으로 꾸준히 역량을 키워왔습니다.`,
    sourceNodes: ['성과 > 프로세스 개선', '강점 > 책임감'],
  },
  {
    id: 3,
    title: '강점과 보완점',
    content: `저의 가장 큰 강점은 문제 해결 능력과 팀워크입니다. 어떤 상황에서도 냉정하게 문제를 분석하고 최선의 해결책을 찾아왔습니다.`,
    sourceNodes: ['강점 > 문제 해결 능력', '강점 > 팀워크'],
  },
  {
    id: 4,
    title: '입사 후 포부',
    content: `입사 후에는 귀사의 프로젝트 성공에 실질적으로 기여하는 PM이 되고 싶습니다. 단순히 일정을 관리하는 것을 넘어, 팀의 역량을 극대화하고 고객 가치를 창출하는 데 집중하겠습니다.`,
    sourceNodes: ['성과 > 매출 증대 기여', '주요 역량 > 리스크 관리'],
  },
];

function CoverLetterPage({ userName = '프로젝트 매니저 지원', onBackToMindMap }) {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [selectedId, setSelectedId] = useState(1);
  const [nextId, setNextId] = useState(100); // 새 문항용 내부 고유 id (화면 노출 X)
  const [settingsOpen, setSettingsOpen] = useState(true);

  const toggleSettings = () => setSettingsOpen((p) => !p);

  // "+ 직접 문항 추가" 클릭 시: 새 문항 생성 + 선택 + 생성 설정 사이드바 자동 오픈
  const addSection = () => {
    const customCount = sections.filter((s) => s.id >= 100).length;
    const newSection = {
      id: nextId,
      title: `직접 입력 문항 ${customCount + 1}`,
      content: '',
      sourceNodes: [],
    };
    setSections((prev) => [...prev, newSection]);
    setSelectedId(nextId);
    setNextId((p) => p + 1);
    setSettingsOpen(true); // 자동으로 열기
  };

  const updateSectionTitle = (id, title) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  };

  return (
    <div className="cl-page">
      <CLHeader userName={userName} onBackToMindMap={onBackToMindMap} />

      <div className="cl-body">
        {/* 툴바 */}
        <CLToolbar
          settingsOpen={settingsOpen}
          onSettingsToggle={toggleSettings}
        />

        {/* 콘텐츠: 마인드맵 | 자소서 | 생성설정 */}
        <div className="cl-content">
          <CLMindMap />
          <div className="cl-content-divider" />

          <CLDraft
            sections={sections}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAddSection={addSection}
            onUpdateTitle={updateSectionTitle}
          />

          <CLSettings
            open={settingsOpen}
            onToggle={toggleSettings}
          />
        </div>
      </div>
    </div>
  );
}

export default CoverLetterPage;