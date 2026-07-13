import React, { useState, useEffect } from 'react';
import './CoverLetter.css';

import CLHeader from '../../components/CoverLetter/CLHeader';
import CLToolbar from '../../components/CoverLetter/CLToolbar';
import CLMindMap from '../../components/CoverLetter/CLMindMap';
import CLDraft from '../../components/CoverLetter/CLDraft';
import CLSettings from '../../components/CoverLetter/CLSettings';
import CLMasterDraft from '../../components/CoverLetter/CLMasterDraft';

import {
  getCoverLetterList,
  createCoverLetter,
  updateCoverLetter,
  getCoverLetterDetail,
} from '../../axios/coverLetterApi';
import { createSection } from '../../axios/sectionApi';
import { getMindMap } from '../../axios/mindMapApi';
import useMindMapStore from '../../zustand/mindMapStore';
import { useModal } from '../../components/common/ModalProvider';

// 백엔드 문항(section) → 화면 형태로 변환
const mapSection = (s) => ({
  id: s.id,
  title: s.question,
  content: s.answer,
  sourceNodes: (s.sourceNode || [])
    .map((node) => node?.data?.label)
    .filter(Boolean),
});

// 추가된 부분: 백엔드 자소서 마스터(snake_case) → 화면 형태(camelCase)로 변환
// 이유: 자소서 마스터 목록/폼 화면에서 쓸 데이터 형태가 필요해서 추가
const mapMaster = (m) => ({
  id: m.id,
  title: m.title || '',
  companyName: m.company_name || '',
  companyIdeal: m.company_ideal || '',
  jobDescription: m.job_description || '',
  saved: true,
});

// 추가된 부분: 저장 전 임시 항목용 id 카운터 (실제 id와 안 겹치게 음수로 부여)
let tempIdCounter = -1;

// 수정된 부분: 이 파일 하나가 "자소서 마스터 목록/폼 화면"과 "문항 편집 화면"을 모두 담당함
// 이유: 별도 페이지 파일/라우트를 만들지 않고, /coverletter 라우트 하나 안에서
// view state로 두 화면을 전환하기로 결정했기 때문
function CoverLetterPage({ onBackToMindMap }) {
  const { alert } = useModal(); // 수정된 부분: 브라우저 기본 alert() 대신 커스텀 모달 사용

  // 추가된 부분: Zustand store에서 mindMapId와 fetchMindMap을 가져옴
  // 이유: 생성/수정 요청 dto에 mindMapId를 포함시켜야 백엔드 @NotNull 유효성 검사를 통과하는데,
  // 이 페이지는 mindMapId를 읽기만 하고 fetch를 안 해서 null이 유지되던 문제가 있었음.
  // fetchMindMap을 페이지 진입 시 호출해서 store에 mindMapId를 채워줘야 함
  const mindMapId = useMindMapStore((state) => state.mindMapId);
  const fetchMindMap = useMindMapStore((state) => state.fetchMindMap);

  // 추가된 부분: view state ('list' = 자소서 마스터 목록/폼, 'edit' = 문항 편집)
  // 이유: 두 화면을 같은 컴포넌트 안에서 전환하기 위해 필요
  const [view, setView] = useState('list');

  // 추가된 부분: 자소서 마스터 목록 화면 전용 상태
  const [masters, setMasters] = useState([]);
  const [selectedMasterId, setSelectedMasterId] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [savingMaster, setSavingMaster] = useState(false);

  // 문항 편집 화면 상태
  const [editingId, setEditingId] = useState(null); // 추가된 부분: 지금 편집 중인 자소서의 id (URL 파라미터 대신 state로 관리)
  const [sections, setSections] = useState([]);
  const [userName, setUserName] = useState('자기소개서');
  const [mindMapNodes, setMindMapNodes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [nextId, setNextId] = useState(100);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [generating, setGenerating] = useState(false);

  // 추가된 부분: 페이지 진입 시 자소서 마스터 전체 조회 + fetchMindMap으로 mindMapId 채우기
  // 이유: /coverletter에 들어오면 가장 먼저 자소서 마스터 목록을 봐야 하고,
  // mindMapId도 이 시점에 store에 채워져 있어야 이후 생성/수정 요청에 쓸 수 있음
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingList(true);
        // 추가된 부분: mindMapId 채우기 (이유: store가 비어있으면 dto에 null이 들어가서 400 에러)
        await fetchMindMap();
        const list = await getCoverLetterList();
        const mapped = list.map(mapMaster);
        setMasters(mapped);
        if (mapped.length > 0) setSelectedMasterId(mapped[0].id);
      } catch (error) {
        console.error('목록 로드 실패:', error.response?.data || error);
      } finally {
        setLoadingList(false);
      }
    };
    load();
  }, []);

  // 추가된 부분: "+ 자소서 마스터 생성하기" — 임시 항목을 목록에 추가하고 선택함 (아직 저장 안 됨)
  const handleAddMaster = () => {
    const newMaster = {
      id: tempIdCounter--,
      title: '',
      companyName: '',
      companyIdeal: '',
      jobDescription: '',
      saved: false,
    };
    setMasters((prev) => [...prev, newMaster]);
    setSelectedMasterId(newMaster.id);
  };

  // 추가된 부분: 폼 입력값 변경 — 선택된 마스터의 해당 필드만 갱신 (목록의 이름도 실시간 반영됨)
  const handleMasterFieldChange = (field, value) => {
    setMasters((prev) =>
      prev.map((m) =>
        m.id === selectedMasterId ? { ...m, [field]: value } : m
      )
    );
  };

  // 추가된 부분: 생성하기(저장 전) / 수정하기(이미 저장됨) 버튼
  const handleMasterSubmit = async () => {
    const current = masters.find((m) => m.id === selectedMasterId);
    if (!current || savingMaster) return;

    // 수정된 부분: dto에 mindMapId 추가
    // 이유: 백엔드 CoverLetterRequestDto의 @NotNull mindMapId가 null이면 400 에러가 나서,
    // fetchMindMap()으로 채워진 store의 mindMapId를 같이 보냄
    const dto = {
      title: current.title,
      company_name: current.companyName,
      company_ideal: current.companyIdeal,
      job_description: current.jobDescription,
      mindmap_id: mindMapId,
    };

    setSavingMaster(true);
    try {
      if (current.saved) {
        await updateCoverLetter(current.id, dto);
        setMasters((prev) =>
          prev.map((m) => (m.id === current.id ? { ...m, ...current } : m))
        );
        // 추가된 부분: 수정 성공 알림
        await alert('자소서 마스터가 수정되었습니다.');
      } else {
        const created = await createCoverLetter(dto);
        const mapped = mapMaster(created);
        setMasters((prev) =>
          prev.map((m) => (m.id === current.id ? mapped : m))
        );
        setSelectedMasterId(mapped.id);
        // 추가된 부분: 생성 성공 알림 — 확인 누르면 편집 화면으로 이동
        await alert('자소서 마스터가 저장되었습니다.');
        setEditingId(mapped.id);
        setView('edit');
      }
    } catch (error) {
      console.error('자소서 마스터 저장 실패:', error.response?.data || error);
      await alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSavingMaster(false);
    }
  };

  // 추가된 부분: 툴바의 "→ 자소서 편집으로 이동" — 저장된 마스터만 편집 화면으로 전환 가능
  const selectedMaster = masters.find((m) => m.id === selectedMasterId);
  const handleGoToEdit = async () => {
    if (!selectedMaster?.saved) {
      await alert('먼저 자소서 마스터를 저장해주세요.');
      return;
    }
    setEditingId(selectedMaster.id);
    setView('edit');
  };

  // 추가된 부분: 툴바의 "← 자소서 마스터로 돌아가기"
  const handleBackToMasterList = () => {
    setView('list');
  };

  // 수정된 부분: 페이지 진입 시 무조건 로드하던 것을, editingId가 정해지고 view가 'edit'일 때만 로드하도록 변경
  // 이유: coverLetterId를 처음부터 알 수 없고(목록에서 선택해야 알게 됨), 특정 하나가
  // 정해졌을 때만 그 상세 내용을 불러오면 되기 때문
  useEffect(() => {
    if (view !== 'edit' || !editingId) return;

    const load = async () => {
      try {
        setLoadingEdit(true);
        const detail = await getCoverLetterDetail(editingId);
        setUserName(detail.title || '자기소개서');

        const mapped = (detail.sections || []).map(mapSection);
        setSections(mapped);
        setSelectedId(mapped.length > 0 ? mapped[0].id : null);

        const mindmap = await getMindMap();
        const nodes =
          typeof mindmap.nodes === 'string'
            ? JSON.parse(mindmap.nodes)
            : mindmap.nodes;
        setMindMapNodes(nodes || []);
      } catch (error) {
        console.error('자소서 로드 실패:', error.response?.data || error);
      } finally {
        setLoadingEdit(false);
      }
    };
    load();
  }, [view, editingId]);

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

  const handleGenerate = async (settings) => {
    const current = sections.find((s) => s.id === selectedId);
    if (!current) {
      await alert('생성할 문항을 선택해주세요.');
      return;
    }
    if (!current.title || !current.title.trim()) {
      await alert('문항(질문)을 먼저 입력해주세요.');
      return;
    }
    if (mindMapNodes.length === 0) {
      await alert('마인드맵 노드가 없습니다. 마인드맵을 먼저 작성해주세요.');
      return;
    }

    try {
      setGenerating(true);
      const created = await createSection(editingId, {
        question: current.title,
        writingStyle: settings.writingStyle,
        maxChars: settings.maxChars,
        allowCreativity: settings.allowCreativity,
        sourceNode: mindMapNodes,
      });
      const mapped = mapSection(created);
      setSections((prev) =>
        prev.map((s) => (s.id === selectedId ? mapped : s))
      );
      setSelectedId(mapped.id);
    } catch (error) {
      console.error('생성 실패:', error.response?.data || error);
      await alert('생성 중 오류가 발생했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  // 수정된 부분: CLMindMap을 두 화면 바깥으로 꺼내서 하나만 공유
  // 이유: 두 개의 CLMindMap이 각각 마운트/언마운트되면서 React Flow 리렌더링이 일어나 깜빡임이 생겼음
  return (
    <div className="cl-page" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 — 화면에 따라 다른 헤더 */}
      {view === 'list'
        ? <CLHeader userName="자소서 마스터" />
        : <CLHeader userName={userName} onBackToMindMap={onBackToMindMap} coverLetterId={editingId} />
      }

      <div className="cl-body">
        {/* 툴바 — 화면에 따라 다른 툴바 */}
        {view === 'list' ? (
          <CLToolbar
            navLabel="자소서 편집으로 이동 →"
            onNav={handleGoToEdit}
            showSettingsToggle={false}
            className="cl-toolbar--master"
          />
        ) : (
          <CLToolbar
            settingsOpen={settingsOpen}
            onSettingsToggle={toggleSettings}
            navLabel="← 자소서 마스터로 돌아가기"
            onNav={handleBackToMasterList}
            className="cl-toolbar--master"
          />
        )}

        <div className={`cl-content ${view === 'list' ? 'cl-content--master' : ''}`}>
          {/* 추가된 부분: CLMindMap 하나를 두 화면이 공유 — DOM 유지로 깜빡임 제거 */}
          <CLMindMap />
          <div className="cl-content-divider" />

          {/* 마스터 목록/폼 — display:none으로 숨김/표시 */}
          <div style={{ display: view === 'list' ? 'contents' : 'none' }}>
            {!loadingList && (
              <CLMasterDraft
                masters={masters}
                selectedId={selectedMasterId}
                onSelect={setSelectedMasterId}
                onAdd={handleAddMaster}
                onFieldChange={handleMasterFieldChange}
                onSubmit={handleMasterSubmit}
                saving={savingMaster}
              />
            )}
          </div>

          {/* 문항 편집 — display:none으로 숨김/표시 */}
          <div style={{ display: view === 'edit' ? 'contents' : 'none' }}>
            {!loadingEdit && (
              <>
                <CLDraft
                  sections={sections}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onAddSection={addSection}
                  onUpdateTitle={updateSectionTitle}
                  draftTitle={userName}
                />
                <CLSettings
                  open={settingsOpen}
                  onToggle={toggleSettings}
                  onGenerate={handleGenerate}
                  generating={generating}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoverLetterPage;
