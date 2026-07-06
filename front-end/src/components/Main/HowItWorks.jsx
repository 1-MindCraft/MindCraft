import React from 'react';
import steps from '../../data/steps';

function HowItWorks() {
  return (
    <section className="section" id="how" style={{ background: '#fff' }}>
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
