// 추가된 부분: 이 파일 전체가 새로 추가된 파일입니다
// 이유: 어디서든 재사용 가능한 빈 모달 껍데기 컴포넌트가 필요해서 (alert/confirm 대체용
// ModalProvider뿐 아니라, 나중에 다른 화면에서 커스텀 모달이 필요할 때도 이걸 재사용하기 위함)
import React, { useEffect } from 'react';
import './Modal.css';

// 어디서든 재사용 가능한 "빈" 모달 껍데기.
// 이 컴포넌트 자체는 알림/확인 같은 특정 용도를 모르고, 그냥 오버레이+카드+제목+내용만 담당함.
// (alert/confirm 대체용 ModalProvider가 이 위에 내용을 얹어서 쓰고, 나중에 다른 화면에서
//  임의의 내용을 담은 모달이 필요할 때도 이 컴포넌트를 그대로 재사용하면 됨)
function Modal({ open, onClose, title, children, footer }) {
  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose} // 바깥(어두운 배경) 클릭하면 닫힘
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()} // 카드 안쪽 클릭은 오버레이 클릭으로 안 번지게 막음
      >
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button
              className="modal-close-btn"
              onClick={onClose}
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
        )}

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
