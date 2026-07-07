import React from 'react';

function FloatingCta({ visible, onClick, ctaLabel = '마인드맵 시작하기 →' }) {
  if (!visible) return null;

  return (
    <button className="float-cta-btn" onClick={onClick}>
      {ctaLabel}
    </button>
  );
}

export default FloatingCta;