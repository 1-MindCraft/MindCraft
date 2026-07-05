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
      style={sectionClassName === 'section' ? { background: '#fff' } : undefined}
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
