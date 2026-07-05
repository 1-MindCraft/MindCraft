import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

/**
 * 전역 테마 관리 (라이트 / 다크)
 * - localStorage에 저장해서 새로고침해도 유지됩니다.
 * - <html data-theme="light|dark"> 속성으로 반영되며,
 *   각 페이지 CSS에서 [data-theme="dark"] 선택자로 다크 모드 스타일을 정의합니다.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('mc-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mc-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme은 ThemeProvider 내부에서만 사용할 수 있어요');
  return ctx;
}
