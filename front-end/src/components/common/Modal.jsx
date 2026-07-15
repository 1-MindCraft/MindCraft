// 추가된 부분: 이 파일 전체가 새로 추가된 파일입니다
// 이유: 어디서든 재사용 가능한 빈 모달 껍데기 컴포넌트가 필요해서 (alert/confirm 대체용
// ModalProvider뿐 아니라, 나중에 다른 화면에서 커스텀 모달이 필요할 때도 이걸 재사용하기 위함)
// 수정된 부분 [2026-07-15]: useRef 추가
// 이유: 모달이 열릴 때 포커스를 모달 카드로 옮기기 위한 ref가 필요해서
// before: import React, { useEffect } from 'react';
// after:
import React, { useEffect, useRef } from 'react';
import './Modal.css';

// 어디서든 재사용 가능한 "빈" 모달 껍데기.
// 이 컴포넌트 자체는 알림/확인 같은 특정 용도를 모르고, 그냥 오버레이+카드+제목+내용만 담당함.
// (alert/confirm 대체용 ModalProvider가 이 위에 내용을 얹어서 쓰고, 나중에 다른 화면에서
//  임의의 내용을 담은 모달이 필요할 때도 이 컴포넌트를 그대로 재사용하면 됨)
// 수정된 부분 [2026-07-15]: onConfirm prop 추가
// 이유: 빈 공통 모달 컴포넌트 자체는 "확인" 동작이 뭔지 모르지만, 이 컴포넌트를 쓰는 쪽(예: ModalProvider)에서
// Enter로 바로 다음 단계로 넘어가는 동작을 연결할 수 있도록 콜백을 받을 자리가 필요해서 추가함
// before: function Modal({ open, onClose, title, children, footer }) {
// after:
function Modal({ open, onClose, onConfirm, title, children, footer }) {
  // 추가된 부분 [2026-07-15]: 모달 카드에 붙일 ref
  // 이유: 모달이 열릴 때 이 요소로 포커스를 옮겨서, 배경(예: 로그인 폼)에 남아있던 포커스 때문에
  // Enter 키가 배경 요소에도 같이 전달되는 것을 막기 위함 (아래 focus 이동 useEffect에서 사용)
  const modalCardRef = useRef(null);

  // ESC 키로 닫기 / Enter 키로 바로 확인
  // 수정된 부분 [2026-07-15]: Enter 키 처리 추가
  // 이유: "빈 공통 모달 컴포넌트인 상태"에서도 사용자가 Enter만 눌러도 확인 버튼을 누른 것처럼
  // 바로 다음 단계로 넘어갈 수 있어야 해서 (onConfirm이 연결돼 있을 때만 동작)
  useEffect(() => {
    if (!open) return;
    // before:
    // const handleKeyDown = (e) => {
    //   if (e.key === 'Escape') onClose?.();
    // };
    // after:
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
      // 추가된 부분 [2026-07-15]: Enter 키를 누르면 onConfirm 콜백 실행 (전달 안 됐으면 아무 동작 없음)
      // 수정된 부분 [2026-07-15]: e.repeat 체크 추가
      // 이유: 사용자가 Enter를 꾹 누르고 있으면 운영체제가 keydown을 연속으로 반복 발생시키는데,
      // 그때마다 onConfirm이 계속 실행되는 걸 막기 위해 자동 반복 입력은 무시함
      if (e.key === 'Enter' && !e.repeat) onConfirm?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // 수정된 부분 [2026-07-15]: 의존성 배열에 onConfirm 추가
    // before: }, [open, onClose]);
    // after:
  }, [open, onClose, onConfirm]);

  // 추가된 부분 [2026-07-15]: 모달이 열리면 포커스를 모달 카드로 이동
  // 이유: (실제 원인) 모달이 열려도 이전 화면(예: 로그인 폼의 비밀번호 입력창)에 포커스가 그대로
  // 남아있었음. 그 상태에서 얼럿을 닫으려고 Enter를 누르면, 그 Enter가 모달뿐 아니라 여전히
  // 포커스가 남아있는 배경의 <form>에도 전달돼서 로그인 폼이 한 번 더 제출되고, 그 결과
  // '로그인 성공' 얼럿이 다시 뜨는 것이 실제 원인이었음. 모달이 열릴 때 포커스를 모달 카드로
  // 옮겨두면 배경 폼이 더 이상 키 입력을 받지 않아서 이 문제가 해결됨
  useEffect(() => {
    if (!open) return;
    modalCardRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose} // 바깥(어두운 배경) 클릭하면 닫힘
    >
      <div
        className="modal-card"
        // 추가된 부분 [2026-07-15]: ref + tabIndex={-1}
        // 이유: tabIndex={-1}을 줘야 일반 텍스트인 div도 JS로 focus()를 호출할 수 있음
        // (마우스/탭으로는 포커스되지 않고, 오직 코드에서만 포커스 이동 가능)
        ref={modalCardRef}
        tabIndex={-1}
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