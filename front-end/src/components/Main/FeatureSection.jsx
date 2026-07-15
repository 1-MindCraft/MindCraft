import React from 'react';

/**
 * 재사용 가능한 기능 소개 섹션
 *
 * props
 * - id: 섹션 anchor id (선택)
 * - sectionClassName: 'feature-section' | 'section' 등 바깥 section의 className
 * - reverse: true면 미디어 영역이 오른쪽 대신 왼쪽에 위치 (feature-grid.rev)
 * - label, title, sub: 섹션 상단 텍스트
 * - mediaLabel, mediaHint: 미디어(이미지/GIF 자리) 안내 텍스트
 * - items: [{ title, desc }] 형태의 기능 리스트
 */
function FeatureSection({
  id,
  sectionClassName = 'feature-section',
  reverse = false,
  label,
  title,
  sub,
  mediaLabel,
  mediaHint,
  items = [],
}) {
  return (
    <section
      className={sectionClassName}
      id={id}
      // 삭제된 부분 [2026-07-15]: sectionClassName === 'section'일 때 style={{ background: '#fff' }} 적용하던 로직 제거
      // 이유: 인라인 스타일로 흰색이 하드코딩돼 있어서, 다크모드에서 두 번째 FeatureSection(AI 이력서 생성)만
      // 계속 흰색으로 남아 위아래 어두운 섹션들과 "흑백흑백" 번갈아 보이는 원인이었음.
      // 제거하면 부모(.mindcraft-page)의 배경을 그대로 물려받아서 라이트/다크 모드 둘 다 자연스럽게 어울림
      // before: style={sectionClassName === 'section' ? { background: '#fff' } : undefined}
      // after: (제거됨)
    >
      <div className="section-label">{label}</div>
      <h2 className="section-title">{title}</h2>
      <p className="section-sub">{sub}</p>

      <div className={`feature-grid${reverse ? ' rev' : ''}`}>
        <div className="feature-media">
          <div className="fm-label">{mediaLabel}</div>
          <div className="fm-hint">{mediaHint}</div>
        </div>

        <div className="feature-list">
          {items.map((item) => (
            <div className="feature-item" key={item.title}>
              <div className="feat-text">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;