import React from 'react';

function FinalCta({ onClick, ctaLabel = '마인드맵 시작하기 →' }) {
  return (
    <section className="cta-section">
      <div className="cta-box">
        <h2>
          지금 바로 나만의
          <br />
          이력서를 만들어보세요
        </h2>
        <p>
          마인드맵으로 데이터를 입력할수록
          <br />
          AI가 더 정확한 이력서를 완성해드립니다.
        </p>
        <button className="btn-white" onClick={onClick}>
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}

export default FinalCta;