import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import './index.css';

import App from './App';
// import MainPage from './MainPage/MainPage';
// import MindMapPage from './MindMapPage/MindMapPage';
import CoverLetterPage from './CoverLetterPage/CoverLetterPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <MainPage />
//     </BrowserRouter>
//   </StrictMode>
// );


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <MindMapPage userName="홍길동" />
//     </BrowserRouter>
//   </StrictMode>
// );


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CoverLetterPage userName="프로젝트 매니저 지원" />
    </BrowserRouter>

  </StrictMode>
);
