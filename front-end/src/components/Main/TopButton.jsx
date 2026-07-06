import React from 'react';
import TOP_BTN_SRC from '../../assets/top-button.png';

function TopButton({ visible, onClick }) {
  if (!visible) return null;

  return (
    <button className="top-btn" onClick={onClick} aria-label="맨 위로 이동">
      <img src={TOP_BTN_SRC} alt="" />
    </button>
  );
}

export default TopButton;
