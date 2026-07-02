import React from 'react';

function Hero({ onStartClick }) {
  return (
    <section className="hero">
      <div className="hero-container">
        {/* 왼쪽: 텍스트 영역 */}
        <div className="hero-text">
          <h1>
            마인드맵으로 정리하는
            <br />
            <span>나만의 자기소개서</span>
            <br />
          </h1>
          <p>
            나만의 경험을 마인드맵으로 구조화하면,
            <br />
            AI가 직무와 산업에 맞는 맞춤형 이력서를 자동 생성합니다.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={onStartClick}>
              마인드맵 시작하기
            </button>
            {/* <button className="btn-secondary">서비스 소개 보기</button>  */}
          </div>
        </div>

        {/* 오른쪽: 미디어 영역 */}
        <div className="hero-media">
          <div className="media-label">서비스 전체 시연 영상 / GIF</div>
          <div className="media-hint">
            권장: 1280×720 · 루프 재생 GIF 또는 MP4
          </div>
        </div>
      </div>

      <div className="scroll-hint">
        <span>스크롤하여 더 알아보기</span>
        <span className="scroll-arrow">↓</span>
      </div>
    </section>
  );
}

export default Hero;