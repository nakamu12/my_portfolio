import { useEffect, useState } from 'react';

export function useThemeState() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const readTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    readTheme();

    const observer = new MutationObserver(readTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return { isDark, toggleTheme };
}
