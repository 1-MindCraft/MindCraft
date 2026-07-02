import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PAGES = [
  { path: '/', label: 'MainPage' },
  { path: '/mindmap', label: 'MindMapPage' },
  { path: '/coverletter', label: 'CoverLetterPage' },
  { path: '/account', label: 'AccountPage' },
  { path: '/help', label: 'HelpPage' },
  { path: '/terms', label: 'TermsPage' },
  { path: '/privacy', label: 'PrivacyPage' },
];

/**
 * 개발 중 페이지 이동용 플로팅 패널.
 * - import.meta.env.DEV가 true일 때만(즉 `npm run dev`로 실행할 때만) 보이고,
 *   `npm run build`로 만든 실제 배포본에는 포함되지 않습니다.
 * - main.jsx는 더 이상 건드릴 필요 없이, 이 패널에서 클릭만으로 페이지를 전환할 수 있어요.
 */
function DevNav() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  if (!import.meta.env.DEV) return null;

  return (
    <div style={styles.wrap}>
      <button style={styles.toggle} onClick={() => setOpen((p) => !p)}>
        {open ? '✕' : '☰'} DEV
      </button>

      {open && (
        <div style={styles.panel}>
          <div style={styles.title}>페이지 이동</div>
          {PAGES.map((p) => (
            <Link
              key={p.path}
              to={p.path}
              style={{
                ...styles.link,
                ...(location.pathname === p.path ? styles.linkActive : {}),
              }}
            >
              {p.label}
              <span style={styles.path}>{p.path}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    position: 'fixed',
    bottom: '16px',
    right: '16px',
    zIndex: 9999,
    fontFamily: 'system-ui, sans-serif',
  },
  toggle: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    background: '#1a1a2e',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
  },
  panel: {
    position: 'absolute',
    bottom: '42px',
    right: 0,
    width: '190px',
    background: '#1a1a2e',
    borderRadius: '10px',
    padding: '8px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  title: {
    color: '#888',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    padding: '4px 8px',
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    padding: '7px 8px',
    borderRadius: '6px',
    color: '#e8e6f5',
    fontSize: '12px',
    fontWeight: 600,
    textDecoration: 'none',
  },
  linkActive: {
    background: '#6c63ff',
    color: '#fff',
  },
  path: {
    fontSize: '10px',
    color: '#8886a0',
    fontWeight: 400,
    marginTop: '1px',
  },
};

export default DevNav;
