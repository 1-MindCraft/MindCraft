import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactFlow, useViewport } from '@xyflow/react';
import HAND_SRC from '../../assets/hand-tool.png';
import SAVE_SRC from '../../assets/save.png';
// 추가된 부분 [2026-07-15]: [ 키워드 추출 ] / [ 생성하기 ] 버튼을 MindMapHeader.jsx에서
// 이 파일(툴바)로 옮겨오면서 같이 필요해진 것들
// 이유: "헤더에 있는 키워드 추출과 생성하기 버튼을 툴바로 위치 변경"해달라는 요청
import EXPORT_SRC from '../../assets/export.png';
import EXPORT_WHITE_SRC from '../../assets/export-white.png';
import useMindMapStore from '../../zustand/mindMapStore';
import { useModal } from '../common/ModalProvider';
import { useTheme } from '../../context/ThemeContext';
import { TextShimmerWave } from '../loading-ui/text-shimmer-wave';

function MindMapToolbar({
  isSaving,
  lastSaved,
  onSave,
  tool,
  onToolChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) {
  // 추가된 부분 [2026-07-15]: [ 키워드 추출 ] / [ 생성하기 ] 버튼에 필요한 훅/상태
  // 이유: 기존 MindMapHeader.jsx에 있던 것을 그대로 옮겨옴
  const navigate = useNavigate();
  const { alert } = useModal();
  const { theme } = useTheme();
  const [extracting, setExtracting] = useState(false);
  const nodes = useMindMapStore((state) => state.nodes);
  const extractKeywords = useMindMapStore((state) => state.extractKeywords);

  // 실제 캔버스 확대/축소를 제어 (ReactFlowProvider 하위에서만 동작)
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { zoom } = useViewport();
  const zoomPercent = Math.round(zoom * 100);

  const savedTime = lastSaved
    ? lastSaved.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : null;

  // 추가된 부분 [2026-07-15]: [ 키워드 추출 ] 클릭 핸들러 (MindMapHeader.jsx에서 그대로 옮겨옴)
  const handleExtractKeywords = async () => {
    if (extracting) return;

    if (nodes.length === 0) {
      await alert('마인드맵 노드가 없습니다. 먼저 마인드맵을 작성해주세요.');
      return;
    }

    setExtracting(true);
    try {
      await extractKeywords();
      // 수정된 부분 [2026-07-15]: setExtracting(false)를 alert보다 먼저 호출
      // 이유: finally에서만 false로 바꾸면, "키워드 추출이 완료되었습니다" 알림 모달이
      // 떠 있는 동안에도 뒤에서 추출중 오버레이(TextShimmerWave)가 계속 겹쳐 보였음.
      // 추출이 끝나는 즉시 오버레이부터 닫고, 그 다음에 알림 모달을 띄우면 겹치지 않음
      setExtracting(false);
      await alert('키워드 추출이 완료되었습니다.\n노드를 클릭하면 키워드를 볼 수 있어요.');
    } catch {
      // 수정된 부분 [2026-07-15]: 실패 시에도 알림 띄우기 전에 오버레이부터 먼저 닫음 (이유 동일)
      setExtracting(false);
      await alert('키워드 추출 중 오류가 발생했습니다.');
    }
  };

  return (
    // 수정된 부분 [2026-07-15]: 최상위를 Fragment(<>)로 감쌈
    // 이유: 기존엔 <div className="mm-toolbar"> 하나만 반환했는데, 키워드 추출 중 오버레이를
    // 형제 엘리먼트로 같이 반환하려면 여러 개를 감쌀 최상위 태그가 필요해서 Fragment로 감쌈
    // before: return (\n    <div className="mm-toolbar">\n  after:
    <>
    <div className="mm-toolbar">
      {/* ── 왼쪽 고정: 저장 + 저장됨 ── */}
      <div className="mm-toolbar-left">
        <button
          className={`mm-btn-save-toolbar ${isSaving ? 'saving' : ''}`}
          onClick={onSave}
          disabled={isSaving}
          title="저장"
        >
          {isSaving ? (
            <span></span>
          ) : (
            <img src={SAVE_SRC} alt="저장" className="mm-tool-icon" />
          )}
          {isSaving ? '저장 중...' : '저장'}
        </button>

        <div className="mm-toolbar-divider" />

        {savedTime && !isSaving && (
          <span className="mm-toolbar-saved">
            <span className="mm-save-icon">✓</span> 저장됨 
          </span>
        )}
      </div>

      {/* ── 중앙: 도구 / undo/redo / 줌 ── */}
      <div className="mm-toolbar-center">
        <div className="mm-toolbar-group">
          <button
            className={`mm-tool-btn mm-tool-img-btn ${tool === 'drag' ? 'active' : ''}`}
            onClick={() => onToolChange('drag')}
            title="드래그 (공간 이동)"
          >
            <img src={HAND_SRC} alt="드래그" className="mm-tool-icon" />
          </button>
          <button
            className={`mm-tool-btn mm-tool-img-btn ${tool === 'select' ? 'active' : ''}`}
            onClick={() => onToolChange('select')}
            title="선택 (드래그로 여러 노드 선택)"
          >
            <svg
              className="mm-tool-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              fill="currentColor"
            >
              <path d="M14.78 5a1 1 0 00-.69.28L15 6.28 36.69 27.59l-9.38.81a1 1 0 00-.77 1.53L32.78 43.5l-2.56 1.16-6-13.84a1 1 0 00-1.6-.34L16 36.69V8.28l20.69 19.31-9.38.81z" />
            </svg>
          </button>
          {/* undo/redo: 드래그 도구 바로 옆 */}
          <button
            className="mm-icon-btn"
            title="실행 취소"
            onClick={onUndo}
            disabled={!canUndo}
          >
            ↩
          </button>
          <button
            className="mm-icon-btn"
            title="다시 실행"
            onClick={onRedo}
            disabled={!canRedo}
          >
            ↪
          </button>
        </div>

        <div className="mm-toolbar-divider" />

        <div className="mm-toolbar-group">
          <button
            className="mm-tool-btn"
            onClick={() => zoomOut({ duration: 200 })}
            title="축소"
          >
            −
          </button>
          <span className="mm-zoom-label">{zoomPercent}%</span>
          <button
            className="mm-tool-btn"
            onClick={() => zoomIn({ duration: 200 })}
            title="확대"
          >
            +
          </button>
          <button
            className="mm-tool-btn"
            onClick={() => fitView({ duration: 300 })}
            title="화면에 맞추기"
          >
            ⛶
          </button>
        </div>
        {/* 수정된 부분: "테마 ▾" 버튼과 그 앞 구분선을 여기서 삭제함
            이유: 아직 미완성 기능이라 보류 중이었는데, 나중에 추가하는 방식으로 논의를 결정해서 삭제 */}
      </div>

      {/* 추가된 부분 [2026-07-15]: 오른쪽 고정 — [ 키워드 추출 ] / [ 생성하기 ]
          이유: 기존 MindMapHeader.jsx 헤더에 있던 두 버튼을 툴바 오른쪽으로 옮김 */}
      <div className="mm-toolbar-right">
        <button
          className="mm-btn-keyword"
          onClick={handleExtractKeywords}
          disabled={extracting}
        >
          <span>✦</span> {extracting ? '추출 중...' : '키워드 추출'}
        </button>
        <button className="mm-btn-export" onClick={() => navigate('/coverletter')}>
          <img
            src={theme === 'dark' ? EXPORT_WHITE_SRC : EXPORT_SRC}
            alt="생성하기"
            className="mm-header-btn-icon"
          />{' '}
          생성하기
        </button>
      </div>
    </div>
    {/* 추가된 부분 [2026-07-15]: [ 키워드 추출 ] 클릭 후 추출 중일 때 뜨는 오버레이
        이유: 화면을 어둡게 덮고 중앙에 TextShimmerWave 애니메이션을 보여줌.
        position: fixed라서 이 컴포넌트(툴바) 안에 있어도 화면 전체를 덮을 수 있음.
        (기존 MindMapHeader.jsx에 있던 것을 그대로 옮겨옴) */}
    {extracting && (
      <div className="mm-extracting-overlay">
        <TextShimmerWave>키워드 추출중...</TextShimmerWave>
      </div>
    )}
    </>
  );
}

export default MindMapToolbar;