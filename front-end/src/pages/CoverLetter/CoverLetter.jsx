import React, { useState, useEffect } from 'react';
import './CoverLetter.css';

import CLHeader from '../../components/CoverLetter/CLHeader';
import CLToolbar from '../../components/CoverLetter/CLToolbar';
import CLMindMap from '../../components/CoverLetter/CLMindMap';
import CLDraft from '../../components/CoverLetter/CLDraft';
import CLSettings from '../../components/CoverLetter/CLSettings';

import { getOrCreateCoverLetter, getCoverLetterDetail } from '../../axios/coverLetterApi';
import { createSection } from '../../axios/sectionApi';
import { getMindMap } from '../../axios/mindMapApi';
import { useModal } from '../../components/common/ModalProvider';

// 백엔드 문항(section) → 화면 형태로 변환
const mapSection = (s) => ({
  id: s.id,
  title: s.question,        // question → title
  content: s.answer,        // answer → content
  sourceNodes: (s.sourceNode || []).map((node) => node?.data?.label).filter(Boolean),
});

function CoverLetterPage({ onBackToMindMap }) {
  const { alert } = useModal(); // 수정된 부분: 브라우저 기본 alert() 대신 커스텀 모달 사용
  const [sections, setSections] = useState([]);
  const [coverLetterId, setCoverLetterId] = useState(null);
  const [userName, setUserName] = useState('자기소개서');
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    companyIdeal: '',
    jobDescription: '',
  });
  const [mindMapNodes, setMindMapNodes] = useState([]);   // 마인드맵 전체 노드 (sourceNode로 넘길 것)

  const [selectedId, setSelectedId] = useState(null);
  const [nextId, setNextId] = useState(100);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);   // AI 생성 중 여부

  // 페이지 진입 시: 자소서 조회 + 문항 로드 + 마인드맵 노드 로드
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const cover = await getOrCreateCoverLetter();
        setCoverLetterId(cover.id);

        const detail = await getCoverLetterDetail(cover.id);
        setUserName(detail.title || '자기소개서');
        setCompanyInfo({
          companyName: detail.company_name || '',
          companyIdeal: detail.company_ideal || '',
          jobDescription: detail.job_description || '',
        });

        const mapped = (detail.sections || []).map(mapSection);
        setSections(mapped);
        if (mapped.length > 0) setSelectedId(mapped[0].id);

        // 마인드맵 노드 로드 (생성 시 sourceNode로 넘김)
        const mindmap = await getMindMap();
        const nodes = typeof mindmap.nodes === 'string'
          ? JSON.parse(mindmap.nodes)   // 문자열이면 파싱
          : mindmap.nodes;              // 이미 배열이면 그대로
        setMindMapNodes(nodes || []);
      } catch (error) {
        console.error('자소서 로드 실패:', error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleSettings = () => setSettingsOpen((p) => !p);

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
    setSettingsOpen(true);
  };

  const updateSectionTitle = (id, title) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  };

  // "생성하기" → 현재 선택 문항을 마인드맵 노드 참고해 AI 생성
  const handleGenerate = async (settings) => {
    const current = sections.find((s) => s.id === selectedId);
    if (!current) {
      // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
      await alert('생성할 문항을 선택해주세요.');
      return;
    }
    if (!current.title || !current.title.trim()) {
      // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
      await alert('문항(질문)을 먼저 입력해주세요.');
      return;
    }
    if (mindMapNodes.length === 0) {
      // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
      await alert('마인드맵 노드가 없습니다. 마인드맵을 먼저 작성해주세요.');
      return;
    }

    try {
      setGenerating(true);
      const created = await createSection(coverLetterId, {
        question: current.title,
        writingStyle: settings.writingStyle,
        maxChars: settings.maxChars,
        allowCreativity: settings.allowCreativity,
        sourceNode: mindMapNodes,   // 마인드맵 전체 노드 참고
      });
      // 임시 문항 → 실제 저장된 문항으로 교체 (answer 채워짐)
      const mapped = mapSection(created);
      setSections((prev) => prev.map((s) => (s.id === selectedId ? mapped : s)));
      setSelectedId(mapped.id);
    } catch (error) {
      console.error('생성 실패:', error.response?.data || error);
      // 수정된 부분: alert() → await alert() (커스텀 모달로 교체)
      await alert('생성 중 오류가 발생했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="cl-page">자소서를 불러오는 중...</div>;
  }

  return (
    <div className="cl-page">
      {/* 수정된 부분: sections 대신 coverLetterId를 내려줌
          이유: PDF/DOCX 생성이 백엔드로 옮겨가면서, CLHeader는 문항 데이터가 아니라
          어떤 자소서를 내보낼지 식별할 id만 있으면 되기 때문 */}
      <CLHeader userName={userName} onBackToMindMap={onBackToMindMap} coverLetterId={coverLetterId} />

      <div className="cl-body">
        <CLToolbar
          settingsOpen={settingsOpen}
          onSettingsToggle={toggleSettings}
        />

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
            onGenerate={handleGenerate}
            generating={generating}
          />
        </div>
      </div>
    </div>
  );
}

export default CoverLetterPage;