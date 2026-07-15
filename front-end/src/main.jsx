import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
// 추가된 부분: ModalProvider import (이유: 앱 어디서든 useModal()로 alert/confirm 대체 모달을 쓸 수 있게 하려면 필요)
import { ModalProvider } from './components/common/ModalProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      {/* 추가된 부분: ModalProvider로 App 감싸기 (이유: 최상단에서 감싸야 어느 컴포넌트에서든 useModal() 사용 가능) */}
      <ModalProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ModalProvider>
    </ThemeProvider>
  </StrictMode>
);