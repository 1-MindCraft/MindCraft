import React from 'react';

function FloatingCta({ visible }) {
  if (!visible) return null;

  return <button className="float-cta-btn">마인드맵 시작하기 →</button>;
}

export default FloatingCta;
