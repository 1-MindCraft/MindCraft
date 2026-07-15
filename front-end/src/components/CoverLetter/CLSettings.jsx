import React, { useState } from 'react';

const STYLE_PRESETS = [
  '적극적이고 자신감 있는 문체',
  '차분하고 논리적인 문체',
  '따뜻하고 진정성 있는 문체',
  '직접 입력',
];

const CHAR_LIMITS = [
  { label: '500자 이하', value: 500 },
  { label: '1,000자 이하', value: 1000 },
  { label: '1,500자 이하', value: 1500 },
  { label: '2,000자 이하', value: 2000 },
];

function CLSettings({ open, onToggle, onGenerate, generating }) {
  const [stylePreset, setStylePreset] = useState('적극적이고 자신감 있는 문체');
  const [customStyle, setCustomStyle] = useState('');
  const [maxChars, setMaxChars] = useState(1000);   // 값으로 관리
  const [allowCreativity, setAllowCreativity] = useState(true);

  const handleGenerate = () => {
    const writingStyle = stylePreset === '직접 입력' ? customStyle : stylePreset;
    onGenerate({
      writingStyle,
      maxChars,
      allowCreativity,
    });
  };

  return (
    <>
      {/* 사이드바 패널 */}
      <aside className={`cl-settings ${open ? 'open' : 'closed'}`}>
        <div className="cl-settings-header">
          <div>
            <div className="cl-settings-title">⚙ 생성 설정</div>
            <div className="cl-settings-sub">자기소개서 초안을 생성하기 위한 옵션을 설정하세요.</div>
          </div>
          <button className="mm-icon-btn" onClick={onToggle}>✕</button>
        </div>

        <div className="cl-settings-body">

          {/* 1. 문체 선택 (writing_style) */}
          <section className="cl-setting-section">
            <div className="cl-setting-label">문체 선택</div>
            <div className="cl-setting-desc">AI가 답변을 생성할 때 사용할 문체를 선택하세요.</div>
            <div className="cl-radio-group">
              {STYLE_PRESETS.map((opt) => (
                <label key={opt} className="cl-radio-item">
                  <input
                    type="radio"
                    name="style"
                    checked={stylePreset === opt}
                    onChange={() => setStylePreset(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {stylePreset === '직접 입력' && (
              <textarea
                className="cl-custom-style-input"
                placeholder="원하는 문체를 직접 입력해주세요. (예: 겸손하고 성실한 태도로, 구체적인 수치를 활용하여)"
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                rows={4}
              />
            )}
          </section>

          <div className="cl-setting-divider" />

          {/* 2. 글자 수 (max_chars) */}
          <section className="cl-setting-section">
            <div className="cl-setting-label">글자 수</div>
            <div className="cl-setting-desc">생성할 답변의 최대 글자 수를 선택하세요.</div>
            <div className="cl-radio-group">
              {CHAR_LIMITS.map((opt) => (
                <label key={opt.value} className="cl-radio-item">
                  <input
                    type="radio"
                    name="chars"
                    checked={maxChars === opt.value}
                    onChange={() => setMaxChars(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          <div className="cl-setting-divider" />

          {/* 삭제된 부분 [2026-07-15]: '마인드맵 노드 참조' 섹션 전체 제거
              이유: 섹션 라벨/설명/안내 문구 박스를 포함해 이 섹션 자체가 불필요하다는 요청으로 삭제함.
              바로 아래 있던 구분선(cl-setting-divider)도 같이 지워서, 이 섹션이 있던 자리에
              구분선 두 개가 나란히 남지 않게 함
              before:
              {/* 3. 마인드맵 노드 참조 (source_node) *\/}
              <section className="cl-setting-section">
                <div className="cl-setting-label">마인드맵 노드 참조</div>
                <div className="cl-setting-desc">AI가 자기소개서를 생성할 때 마인드맵의 노드 내용을 참고합니다. 마인드맵에서 관련 노드를 선택하면 자동으로 연결됩니다.</div>
              </section>

              <div className="cl-setting-divider" />
              after: (제거됨) */}

          {/* 4. AI 창의적 제작 허용 (allow_creativity) */}
          <section className="cl-setting-section">
            <label className="cl-creativity-toggle">
              <div>
                <div className="cl-setting-label" style={{ marginBottom: '0.2rem' }}>AI 창의적 제작 허용</div>
                <div className="cl-setting-desc" style={{ margin: 0 }}>
                  허용 시 AI가 마인드맵에 없는 내용도 창의적으로 추가할 수 있습니다.
                </div>
              </div>
              <div className={`cl-toggle ${allowCreativity ? 'on' : ''}`} onClick={() => setAllowCreativity((p) => !p)}>
                <div className="cl-toggle-thumb" />
              </div>
            </label>
          </section>
        </div>

        {/* 생성하기 */}
        <div className="cl-settings-footer">
          <button
            className="cl-btn-generate"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? '✦ 생성 중...' : '✦ 생성하기'}
          </button>
          <div className="cl-generate-hint">
            {generating
              ? 'AI가 자기소개서를 작성하고 있습니다. 잠시만 기다려주세요.'
              : '마인드맵의 구조와 내용을 기반으로 AI가 자기소개서 초안을 생성합니다.'}
          </div>
        </div>
      </aside>

      {/* 사이드바 열고 닫는 토글 버튼 (사이드바 왼쪽 가장자리, 세로 중앙) */}
      <button
        className={`cl-settings-toggle ${open ? 'open' : ''}`}
        onClick={onToggle}
        title={open ? '생성 설정 닫기' : '생성 설정 열기'}
      >
        {open ? '▶' : '◀'}
      </button>
    </>
  );
}

export default CLSettings;