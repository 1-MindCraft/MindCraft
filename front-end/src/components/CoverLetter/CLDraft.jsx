import React, { useState, useRef, useEffect } from 'react';
import PENCIL_SRC from '../../assets/pencil.png';

// 수정된 부분: draftTitle prop 추가 (이유: 자소서 마스터의 title을 CLDraft 헤더에 표시하기 위해 외부에서 받아야 함)
function CLDraft({ sections, selectedId, onSelect, onAddSection, onUpdateTitle, draftTitle = '자기소개서 초안' }) {
  const selectedIndex = sections.findIndex((s) => s.id === selectedId);
  const selected = sections[selectedIndex];
  const totalChars = sections.reduce((sum, s) => sum + (s.content?.length || 0), 0);

  // ── 제목 편집 상태 ──
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const titleInputRef = useRef(null);

  // 선택된 문항이 바뀌면 편집 모드 초기화
  useEffect(() => {
    setIsEditingTitle(false);
  }, [selectedId]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const startEditTitle = () => {
    setOriginalTitle(selected.title);
    setTitleDraft(selected.title);
    setIsEditingTitle(true);
  };

  const confirmTitle = () => {
    const trimmed = titleDraft.trim();
    // 완전히 지웠다면(빈 값) 원래 제목으로 되돌림
    onUpdateTitle(selected.id, trimmed || originalTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') confirmTitle();
    if (e.key === 'Escape') setIsEditingTitle(false);
  };

  return (
    <div className="cl-draft">
      {/* 헤더 */}
      <div className="cl-draft-header">
        <div>
          {/* 수정된 부분: 하드코딩된 "자기소개서 초안" → draftTitle prop으로 교체 (이유: 자소서 마스터의 title과 동기화하기 위해) */}
          <div className="cl-draft-title">{draftTitle}</div>
          <div className="cl-draft-hint">문항을 클릭하면 해당 내용의 참고 노드를 마인드맵에서 확인할 수 있습니다.</div>
        </div>
        <div className="cl-draft-total">총 글자 수 : {totalChars.toLocaleString()}자</div>
      </div>

      <div className="cl-draft-body">
        {/* 왼쪽: 문항 목록 */}
        <div className="cl-section-list">
          {sections.map((s, idx) => (
            <button
              key={s.id}
              className={`cl-section-item ${selectedId === s.id ? 'active' : ''}`}
              onClick={() => onSelect(s.id)}
            >
              {/* 화면에 보이는 번호는 리스트 내 순번(idx+1), 내부 id는 노출하지 않음 */}
              <div className="cl-section-num">{idx + 1}</div>
              <div>
                <div className="cl-section-name">{s.title}</div>
                {s.content?.length > 0 && <div className="cl-section-chars">{s.content.length}자</div>}
              </div>
            </button>
          ))}

          {/* 직접 문항 추가 */}
          <button className="cl-add-section" onClick={onAddSection}>
            + 직접 문항 추가
          </button>
        </div>

        {/* 오른쪽: 선택된 문항 내용 */}
        {selected && (
          <div className="cl-section-detail">
            <div className="cl-detail-header">
              {isEditingTitle ? (
                <div className="cl-detail-title-row">
                  <span className="cl-detail-title-num">{selectedIndex + 1}.</span>
                  <input
                    ref={titleInputRef}
                    className="cl-detail-title-input"
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onBlur={confirmTitle}
                    onKeyDown={handleTitleKeyDown}
                    placeholder={originalTitle}
                    maxLength={500}
                  />
                </div>
              ) : (
                <div className="cl-detail-title-row">
                  {/* 추가된 부분: onDoubleClick 추가 (이유: 제목을 더블클릭해도 편집 모드로 들어가게 해달라는 요청) */}
                  <div
                    className="cl-detail-title"
                    onDoubleClick={startEditTitle}
                    title="더블클릭해서 제목 수정"
                  >
                    {selectedIndex + 1}. {selected.title}
                  </div>
                  <button
                    className="mm-icon-btn mm-icon-img-btn"
                    onClick={startEditTitle}
                    title="제목 수정"
                  >
                    <img src={PENCIL_SRC} alt="편집" className="cl-detail-pencil" />
                  </button>
                </div>
              )}
            </div>

            <div className="cl-detail-content">
              {selected.content || (
                <span className="cl-detail-empty">
                  오른쪽 '생성 설정'에서 문항, 문체, 글자 수를 선택한 뒤 [생성하기] 버튼을 눌러 AI로 이 문항의 초안을 만들어보세요.
                </span>
              )}
            </div>

            {selected.sourceNodes?.length > 0 && (
              <div className="cl-source-nodes">
                <div className="cl-source-label">참고한 마인드맵 노드</div>
                <div className="cl-source-tags">
                  {selected.sourceNodes.map((n) => (
                    <span key={n} className="cl-source-tag">{n}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 하단: AI 생성 안내 */}
      <div className="cl-ai-notice">
        <span className="cl-ai-icon">✦</span>
        <div>
          <div className="cl-ai-notice-title">AI가 생성한 초안입니다</div>
          <div className="cl-ai-notice-sub">마인드맵의 구조와 내용을 기반으로 AI가 자기소개서 초안을 생성합니다. 내용은 자유롭게 수정하고 보완하여 완성도를 높여보세요.</div>
        </div>
        <div className="cl-ai-notice-time">
          생성 일시 {new Date().toLocaleDateString('ko-KR')} {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 📅
        </div>
      </div>
    </div>
  );
}

export default CLDraft;