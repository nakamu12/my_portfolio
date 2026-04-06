interface LanguageSwitcherProps {
  currentLang: string;
  label: string;
  base: string;
}

export default function LanguageSwitcher({ currentLang, label, base }: LanguageSwitcherProps) {
  const targetLang = currentLang === 'en' ? 'ja' : 'en';
  const href = `${base}/${targetLang}/`;

  const handleSwitch = () => {
    localStorage.setItem('lang', targetLang);
    window.location.href = href;
  };

  return (
    <button
      onClick={handleSwitch}
      className="inline-flex h-9 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
      aria-label={`Switch to ${label}`}
    >
      {label}
    </button>
  );
}
