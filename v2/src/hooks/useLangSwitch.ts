export function useLangSwitch(currentLang: string, base: string) {
  return () => {
    const targetLang = currentLang === 'en' ? 'ja' : 'en';
    localStorage.setItem('lang', targetLang);
    window.location.href = `${base}/${targetLang}/`;
  };
}
