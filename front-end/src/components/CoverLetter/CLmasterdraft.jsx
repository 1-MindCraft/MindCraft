import React, { useEffect, useRef, useState } from 'react';

// masters: [{ id, title, companyName, companyIdeal, jobDescription, saved }]
//   - id > 0 이면 이미 백엔드에 저장된 실제 자소서 마스터 (saved: true)
//   - id < 0 이면 아직 저장 전인 임시 항목 (saved: false) — "+ 자소서 마스터 생성하기"로 막 추가한 상태
// selectedId: 지금 오른쪽 폼에 보여줄 마스터의 id
// onSelect(id): 목록에서 항목 클릭
// onAdd(): "+ 자소서 마스터 생성하기" 클릭 (새 임시 항목 추가)
// onFieldChange(field, value): 폼 입력값 변경 (title/companyName/companyIdeal/jobDescription)
// onSubmit(): 생성하기/수정하기 버튼 클릭
// saving: 저장 요청 중 여부
function CLMasterDraft({
  masters,
  selectedId,
  onSelect,
  onAdd,
  onFieldChange,
  onSubmit,
  saving,
  onGoToEdit,
  // 2026-07-14 추가된 부분: 현재 선택된 자소서 마스터 삭제 관련 prop
  // 이유: 마스터 화면의 케밥 메뉴는 현재 보고 있는 마스터 하나만 삭제해야 함
  onDeleteMaster,
  deletingMaster = false,
}) {
  const selectedIndex = masters.findIndex((m) => m.id === selectedId);
  const selected = masters[selectedIndex];

  // 2026-07-14 추가된 부분: 자소서 마스터 삭제 케밥 메뉴 상태
  // 이유: 현재 선택된 마스터를 삭제하는 작은 메뉴를 헤더 오른쪽에 표시하기 위해 필요함
  const [isMasterMenuOpen, setIsMasterMenuOpen] = useState(false);
  const masterMenuRef = useRef(null);

  useEffect(() => {
    if (!isMasterMenuOpen) return;

    const handlePointerDown = (event) => {
      if (!masterMenuRef.current?.contains(event.target)) {
        setIsMasterMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMasterMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMasterMenuOpen]);

  const handleDeleteMasterClick = () => {
    if (!selected || deletingMaster || saving) return;
    setIsMasterMenuOpen(false);
    onDeleteMaster?.();
  };

  return (
    <div className="cl-draft">
      {/* 헤더 — CLDraft와 동일한 구조, 문항 대신 자소서 마스터 안내 문구 */}
      <div className="cl-draft-header">
        <div>
          <div className="cl-draft-title">자소서 마스터</div>
          <div className="cl-draft-hint">
            지원할 회사마다 자소서 마스터를 하나씩 만들어서 관리할 수 있어요.
          </div>
        </div>

        {/* 2026-07-14 추가된 부분: 현재 선택된 자소서 마스터 삭제 케밥 메뉴
            이유: 마스터 화면에서는 선택된 마스터 하나만 삭제하고 문항 삭제와 구분하기 위해 추가함 */}
        <div className="cl-item-menu" ref={masterMenuRef}>
          <button
            type="button"
            className="cl-item-kebab-btn"
            onClick={() => setIsMasterMenuOpen((prev) => !prev)}
            disabled={!selected || deletingMaster || saving}
            aria-label="자소서 마스터 메뉴 열기"
            aria-haspopup="menu"
            aria-expanded={isMasterMenuOpen}
          >
            ⋮
          </button>

          {isMasterMenuOpen && selected && (
            <div className="cl-item-menu-popover" role="menu">
              <button
                type="button"
                className="cl-item-delete-btn"
                onClick={handleDeleteMasterClick}
                disabled={deletingMaster || saving}
                role="menuitem"
              >
                {deletingMaster ? '삭제 중...' : '자소서 마스터 삭제'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="cl-draft-body">
        {/* 왼쪽: 자소서 마스터 목록 (CLDraft의 문항 목록과 동일한 구조/클래스 재사용) */}
        <div className="cl-section-list">
          {/* 수정된 부분: <br/> 방식을 span+display:block 방식으로 변경
              이유: 목록 폭 180px에서 <br/> 전에 이미 자동 줄바꿈이 일어나서 의도한 위치에서
              끊기지 않았음 — 각 줄을 block span으로 명시적으로 분리해서 강제로 줄을 나눔 */}
          {masters.length === 0 && (
            <p className="cl-master-empty">
              <span>아직 생성된</span>
              <span>자소서가 없어요</span>
            </p>
          )}
          {masters.map((m, idx) => (
            <button
              key={m.id}
              className={`cl-section-item ${selectedId === m.id ? 'active' : ''}`}
              onClick={() => onSelect(m.id)}
            >
              <div className="cl-section-num">{idx + 1}</div>
              <div>
                <div className="cl-section-name">
                  {m.title || `자소서 마스터 ${idx + 1}`}
                </div>
                {!m.saved && <div className="cl-section-chars">저장 전</div>}
              </div>
            </button>
          ))}

          {/* 추가된 부분: "+ 자소서 마스터 생성하기" 버튼
              이유: CLDraft의 "+ 직접 문항 추가"와 동일한 패턴 — 누르면 새 항목이 목록에
              추가되고, 이 버튼은 계속 맨 아래로 밀려남 */}
          <button className="cl-add-section" onClick={onAdd}>
            + 자소서 마스터 생성하기
          </button>
        </div>

        {/* 오른쪽: 선택된 마스터의 폼 */}
        {selected ? (
          <div className="cl-section-detail">
            <div className="cl-detail-header">
              <div className="cl-detail-title-row">
                <div className="cl-detail-title">
                  {selectedIndex + 1}. {selected.title || '(제목 없음)'}
                </div>
              </div>
            </div>

            <div className="cl-master-form">
              <label className="cl-master-label">제목</label>
              <input
                className="cl-master-input"
                value={selected.title}
                onChange={(e) => onFieldChange('title', e.target.value)}
                placeholder="예: 마인드크래프트 지원용 자소서"
                maxLength={40}
              />

              <label className="cl-master-label">회사명</label>
              <input
                className="cl-master-input"
                value={selected.companyName}
                onChange={(e) => onFieldChange('companyName', e.target.value)}
                placeholder="예: 마인드크래프트"
              />

              <label className="cl-master-label">인재상</label>
              <input
                className="cl-master-input"
                value={selected.companyIdeal}
                onChange={(e) => onFieldChange('companyIdeal', e.target.value)}
                placeholder="예: 도전적이고 주도적인 인재"
              />

              <label className="cl-master-label">직무 설명</label>
              <textarea
                className="cl-master-textarea"
                value={selected.jobDescription}
                onChange={(e) =>
                  onFieldChange('jobDescription', e.target.value)
                }
                placeholder="지원하는 직무에 대한 설명을 입력하세요"
                rows={4}
              />

              {/* 이미 생성된 자소서 마스터만 이동 버튼 노출 */}
              <div className="cl-master-actions">
                <button
                  className="cl-master-submit"
                  onClick={onSubmit}
                  disabled={saving || deletingMaster}
                >
                  {saving
                    ? '저장 중...'
                    : selected.saved
                      ? '수정하기'
                      : '생성하기'}
                </button>
                {selected.saved && (
                  <button
                    className="cl-master-goedit"
                    onClick={onGoToEdit}
                    disabled={deletingMaster}
                  >
                    문항 편집하기 →
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="cl-section-detail cl-master-empty-detail">
            아직 생성된 자소서가 없어요. 왼쪽의 "+ 자소서 마스터 생성하기"를
            눌러 시작해보세요.
          </div>
        )}
      </div>
    </div>
  );
}

export default CLMasterDraft;