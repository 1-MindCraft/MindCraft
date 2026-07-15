// 추가된 부분: 이 파일 전체가 새로 추가된 파일입니다
// 이유: alert()/confirm() 브라우저 기본 창을 대체하려면, 어디서든
// "await alert(메시지)"처럼 쓸 수 있는 Promise 기반 API가 필요해서 Context로 만듦
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import Modal from './Modal';

const ModalContext = createContext(null);

// 이 Provider 하나가 앱 전체에서 alert()/confirm()을 대체함.
// 실제로 alert()/confirm()처럼 "그 자리에서 잠깐 멈추고 결과를 기다리는" 느낌으로 쓰려고,
// 내부적으로 Promise를 만들어서 사용자가 버튼을 누를 때 resolve 시켜주는 방식을 씀.
export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState(null); // null이면 모달 안 뜸
  const resolveRef = useRef(null); // 사용자가 버튼을 누르면 이 함수를 호출해서 Promise를 resolve함
  // 추가된 부분: promptPassword용 입력값 state
  // 이유: 비밀번호를 입력받는 프롬프트 모달은 내부에 controlled input이 필요함
  const [promptValue, setPromptValue] = useState('');

  // alert(message) — 확인 버튼 하나만 있는 모달. 확인 누르면 resolve(true)
  const alert = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setModalState({
        type: 'alert',
        message,
        title: options.title,
        confirmText: options.confirmText || '확인',
      });
    });
  }, []);

  // confirm(message) — 확인/취소 버튼 두 개. 확인=true, 취소/바깥클릭/ESC=false로 resolve
  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setModalState({
        type: 'confirm',
        message,
        title: options.title,
        confirmText: options.confirmText || '확인',
        cancelText: options.cancelText || '취소',
      });
    });
  }, []);

  // 추가된 부분: promptPassword(message) — 비밀번호 입력창 + 확인/취소 버튼이 있는 모달
  // 확인 누르면 입력한 비밀번호 문자열로 resolve, 취소/바깥클릭/ESC는 null로 resolve
  // 이유: 회원 탈퇴 시 "현재 비밀번호를 입력해주세요" 모달에 입력창이 필요해서 추가
  const promptPassword = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setPromptValue('');
      setModalState({
        type: 'prompt',
        message,
        title: options.title,
        confirmText: options.confirmText || '확인',
        cancelText: options.cancelText || '취소',
      });
    });
  }, []);

  // before:
  // const handleConfirm = () => {
  //   resolveRef.current?.(true);
  //   setModalState(null);
  // };
  // after:
  const handleConfirm = () => {
    if (modalState?.type === 'prompt') {
      resolveRef.current?.(promptValue);
    } else {
      resolveRef.current?.(true);
    }
    setModalState(null);
  };

  // before:
  // const handleCancel = () => {
  //   resolveRef.current?.(modalState?.type === 'alert' ? true : false);
  //   setModalState(null);
  // };
  // after:
  const handleCancel = () => {
    if (modalState?.type === 'prompt') {
      resolveRef.current?.(null);
    } else {
      // alert 타입인데 바깥을 클릭/ESC로 닫는 경우도 여기로 들어옴 → true로 resolve
      // (alert는 "확인"밖에 없는 개념이라, 어떻게 닫히든 같은 의미로 처리)
      resolveRef.current?.(modalState?.type === 'alert' ? true : false);
    }
    setModalState(null);
  };

  return (
    // before: <ModalContext.Provider value={{ alert, confirm }}>
    // after:
    <ModalContext.Provider value={{ alert, confirm, promptPassword }}>
      {children}

      {/* 수정된 부분 [2026-07-15]: onConfirm={handleConfirm} 추가
          이유: 빈 공통 모달 컴포넌트(Modal.jsx)에 Enter 키로 바로 확인하는 기능이 생겨서,
          alert/confirm 타입처럼 입력창이 없는 모달도 Enter만 누르면 바로 확인 버튼을 누른 것과
          동일하게 동작하도록 연결함
          before: <Modal open={Boolean(modalState)} onClose={handleCancel}>
          after: */}
      <Modal open={Boolean(modalState)} onClose={handleCancel} onConfirm={handleConfirm}>
        {modalState && (
          <>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {modalState.message}
            </p>
            {/* 추가된 부분: prompt 타입일 때 비밀번호 입력창 렌더링
                이유: promptPassword 모달은 사용자가 비밀번호를 입력할 곳이 있어야 함 */}
            {modalState.type === 'prompt' && (
              <input
                type="password"
                className="modal-input"
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                onKeyDown={(e) => {
                  // 수정된 부분 [2026-07-15]: e.stopPropagation() 추가
                  // 이유: Modal.jsx에 Enter 키로 onConfirm을 실행하는 window 레벨 리스너가 추가되면서,
                  // 이 input에서 Enter를 누르면 여기서 한 번 + window 리스너에서 또 한 번, 총 두 번
                  // handleConfirm이 호출되는 문제가 생겨서 이벤트 버블링을 막아 중복 실행을 방지함
                  // before:
                  // if (e.key === 'Enter') handleConfirm();
                  // after:
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                    handleConfirm();
                  }
                }}
                autoFocus
              />
            )}
            <div className="modal-footer" style={{ padding: '1rem 0 0' }}>
              {(modalState.type === 'confirm' || modalState.type === 'prompt') && (
                <button
                  className="modal-btn modal-btn--secondary"
                  onClick={handleCancel}
                >
                  {modalState.cancelText}
                </button>
              )}
              <button
                className="modal-btn modal-btn--primary"
                onClick={handleConfirm}
              >
                {modalState.confirmText}
              </button>
            </div>
          </>
        )}
      </Modal>
    </ModalContext.Provider>
  );
}

// 컴포넌트/훅에서 const { alert, confirm } = useModal(); 로 사용
export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('useModal은 ModalProvider 안에서만 사용할 수 있어요');
  }
  return ctx;
}