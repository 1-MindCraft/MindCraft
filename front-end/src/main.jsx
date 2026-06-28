import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import App from './App.jsx'
import MindMap from './mindmap/components/TestMindmap';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <MindMap />
  </StrictMode>
);
