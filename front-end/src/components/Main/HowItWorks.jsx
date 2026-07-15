import React from 'react';
import steps from '../../data/steps';

function HowItWorks() {
  // 삭제된 부분 [2026-07-15]: style={{ background: '#fff' }} 제거
  // 이유: 인라인 스타일로 흰색이 하드코딩돼 있어서, 다크모드에서 이 섹션만 계속
  // 흰색으로 남아 위아래 어두운 섹션들과 "흑백흑백" 번갈아 보이는 원인이었음.
  // 인라인 스타일은 CSS보다 우선순위가 높아서 다크모드 CSS로도 덮어쓸 수 없었음.
  // 제거하면 부모(.mindcraft-page)의 배경(라이트: 흰색, 다크: #16161f)을 그대로
  // 물려받아서 두 모드 다 자연스럽게 어울림
  // before: <section className="section" id="how" style={{ background: '#fff' }}>
  // after: <section className="section" id="how">
  return (
    <section className="section" id="how">
      <div className="section-label">How it works</div>
      <h2 className="section-title">3단계로 완성하는 이력서</h2>
      <p className="section-sub">
        복잡한 과정 없이, 생각을 정리하는 것만으로 이력서가 완성됩니다.
      </p>

      <div className="steps">
        {steps.map((step) => (
          <div className="step-card" key={step.num}>
            <div className="step-num">{step.num}</div>
            <div className="step-title">{step.title}</div>
            <div className="step-desc">{step.desc}</div>
            <div className="step-media">
              <div className="sm-text">{step.mediaText}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;