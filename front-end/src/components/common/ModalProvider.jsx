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

  const handleConfirm = () => {
    resolveRef.current?.(true);
    setModalState(null);
  };

  const handleCancel = () => {
    // alert 타입인데 바깥을 클릭/ESC로 닫는 경우도 여기로 들어옴 → true로 resolve
    // (alert는 "확인"밖에 없는 개념이라, 어떻게 닫히든 같은 의미로 처리)
    resolveRef.current?.(modalState?.type === 'alert' ? true : false);
    setModalState(null);
  };

  return (
    <ModalContext.Provider value={{ alert, confirm }}>
      {children}

      <Modal open={Boolean(modalState)} onClose={handleCancel}>
        {modalState && (
          <>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {modalState.message}
            </p>
            <div className="modal-footer" style={{ padding: '1rem 0 0' }}>
              {modalState.type === 'confirm' && (
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
