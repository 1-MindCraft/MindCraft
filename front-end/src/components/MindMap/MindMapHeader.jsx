import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PENCIL_SRC from '../../assets/pencil.png';
import EXPORT_SRC from '../../assets/export.png';
import ProfileDropdown from '../common/ProfileDropdown';
import AppHeader from '../common/AppHeader';
import useMindMapStore from '../../zustand/mindMapStore';
import { useModal } from '../common/ModalProvider';
// 추가된 부분 [2026-07-15]: [ 키워드 추출 ] 클릭 시 뜨는 오버레이에 쓸 TextShimmerWave 컴포넌트 import
// 이유: 자소서 편집화면의 [ 생성하기 ]와 동일하게, 키워드 추출 중에도 화면을 어둡게 하고
// 중앙에 웨이브 반짝임 애니메이션을 보여달라는 요청
import { TextShimmerWave } from '../loading-ui/text-shimmer-wave';

function MindMapHeader() {
  const navigate = useNavigate();
  const { alert } = useModal();
  const [isEditing, setIsEditing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const inputRef = useRef(null);
  const title = useMindMapStore((state) => state.title);
  const setTitle = useMindMapStore((state) => state.setTitle);
  const nodes = useMindMapStore((state) => state.nodes);
  const extractKeywords = useMindMapStore((state) => state.extractKeywords);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleEditConfirm = () => {
    if (!title.trim()) setTitle('이름없는 마인드맵');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleEditConfirm();
    if (e.key === 'Escape') {
      setTitle('이름없는 마인드맵');
      setIsEditing(false);
    }
  };

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
      // 이유: 기존엔 finally에서만 false로 바꿔서, "키워드 추출이 완료되었습니다" 알림
      // 모달이 떠 있는 동안에도 뒤에서 추출중 오버레이(TextShimmerWave)가 계속 겹쳐 보였음.
      // 추출이 끝나는 즉시 오버레이부터 닫고, 그 다음에 알림 모달을 띄우면 겹치지 않음
      // before: (finally 블록에서만 setExtracting(false) 호출)
      // after:
      setExtracting(false);
      await alert('키워드 추출이 완료되었습니다.\n노드를 클릭하면 키워드를 볼 수 있어요.');
    } catch {
      // 수정된 부분 [2026-07-15]: 실패 시에도 알림 띄우기 전에 오버레이부터 먼저 닫음 (이유 동일)
      setExtracting(false);
      await alert('키워드 추출 중 오류가 발생했습니다.');
    }
  };

  // 수정된 부분 [2026-07-15]: return을 Fragment(<>)로 감쌈
  // 이유: 기존엔 <AppHeader ... /> 하나만 반환했는데, 키워드 추출 중 오버레이를
  // 형제 엘리먼트로 같이 반환하려면 여러 개를 감쌀 최상위 태그가 필요해서 Fragment로 감쌈
  // before: return (\n    <AppHeader\n  after:
  return (
    <>
    <AppHeader
      logoAreaWidth="260px"
      center={
        <div className="mm-doc-title">
          {isEditing ? (
            <input
              ref={inputRef}
              className="mm-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleEditConfirm}
              onKeyDown={handleKeyDown}
              maxLength={30}
            />
          ) : (
            // 추가된 부분: onDoubleClick 추가
            // 이유: 기존엔 펜 아이콘 클릭으로만 편집모드에 들어갈 수 있었는데,
            // 제목을 더블클릭해도 똑같이 편집모드로 들어가게 해달라는 요청이 있어서 추가
            <span
              className="mm-user-name"
              onDoubleClick={() => setIsEditing(true)}
              title="더블클릭해서 제목 수정"
            >
              {title}
            </span>
          )}
          <button
            className="mm-icon-btn mm-icon-img-btn"
            title="제목 수정"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            <img src={PENCIL_SRC} alt="편집" className="mm-header-icon" />
          </button>
        </div>
      }
      right={
        <div className="mm-header-right">
          <button
            className="mm-btn-keyword"
            onClick={handleExtractKeywords}
            disabled={extracting}
          >
            <span>✦</span> {extracting ? '추출 중...' : '키워드 추출'}
          </button>
          <button className="mm-btn-export" onClick={() => navigate('/coverletter')}>
            <img src={EXPORT_SRC} alt="생성하기" className="mm-header-btn-icon" />{' '}
            생성하기
          </button>
          <ProfileDropdown />
        </div>
      }
    />
    {/* 추가된 부분 [2026-07-15]: [ 키워드 추출 ] 클릭 후 추출 중일 때 뜨는 오버레이
        이유: 자소서 편집화면의 생성 중 오버레이(cl-generating-overlay)와 동일한 방식으로,
        화면을 어둡게 덮고 중앙에 TextShimmerWave 애니메이션을 보여줌.
        position: fixed라서 이 컴포넌트가 헤더 안에 있어도 화면 전체를 덮을 수 있음 */}
    {extracting && (
      <div className="mm-extracting-overlay">
        <TextShimmerWave>키워드 추출중...</TextShimmerWave>
      </div>
    )}
    </>
  );
}

export default MindMapHeader;