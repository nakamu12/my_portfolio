import { Dock, DockIcon } from '@/components/ui/dock';

interface DockNavProps {
  lang: string;
  base: string;
  navItems: { label: string; href: string }[];
  langLabel: string;
  currentLang: string;
}

// SVG icons as components
const icons: Record<string, React.ReactNode> = {
  home: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  user: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    </svg>
  ),
  award: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="8" r="6" />
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
    </svg>
  ),
  code: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  briefcase: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  layers: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  mail: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  sun: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  moon: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  globe: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  github: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  twitter: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
};

const iconMap: Record<string, string> = {
  '#about': 'user',
  '#certifications': 'award',
  '#skills': 'code',
  '#experience': 'briefcase',
  '#projects': 'layers',
  '#contact': 'mail',
};

export default function DockNav({ lang, base, navItems, langLabel, currentLang }: DockNavProps) {
  const handleThemeToggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    // Force re-render to swap icon
    window.dispatchEvent(new Event('themechange'));
  };

  const handleLangSwitch = () => {
    const targetLang = currentLang === 'en' ? 'ja' : 'en';
    localStorage.setItem('lang', targetLang);
    window.location.href = `${base}/${targetLang}/`;
  };

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <Dock
      iconSize={40}
      iconMagnification={56}
      iconDistance={120}
      direction="middle"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border-border/50 bg-background/70 shadow-2xl shadow-black/10"
    >
      {/* Home */}
      <DockIcon className="text-muted-foreground transition-colors hover:text-foreground">
        <a href={`${base}/${lang}/#hero`} aria-label="Home" className="flex items-center justify-center">
          {icons.home}
        </a>
      </DockIcon>

      {/* Separator */}
      <div className="mx-1 h-8 w-[1px] bg-border/50" />

      {/* Section navigation */}
      {navItems.map((item) => (
        <DockIcon key={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
          <a href={item.href} aria-label={item.label} className="flex items-center justify-center" title={item.label}>
            {icons[iconMap[item.href]] ?? icons.layers}
          </a>
        </DockIcon>
      ))}

      {/* Separator */}
      <div className="mx-1 h-8 w-[1px] bg-border/50" />

      {/* SNS Links */}
      <DockIcon className="text-muted-foreground transition-colors hover:text-foreground">
        <a href="https://github.com/nakamu12" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub" className="flex items-center justify-center">
          {icons.github}
        </a>
      </DockIcon>
      <DockIcon className="text-muted-foreground transition-colors hover:text-foreground">
        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn" className="flex items-center justify-center">
          {icons.linkedin}
        </a>
      </DockIcon>
      <DockIcon className="text-muted-foreground transition-colors hover:text-foreground">
        <a href="https://x.com/NakamuR_general" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" title="X (Twitter)" className="flex items-center justify-center">
          {icons.twitter}
        </a>
      </DockIcon>

      {/* Separator */}
      <div className="mx-1 h-8 w-[1px] bg-border/50" />

      {/* Language toggle */}
      <DockIcon className="text-muted-foreground transition-colors hover:text-foreground">
        <button onClick={handleLangSwitch} aria-label={langLabel} title={langLabel} className="flex items-center justify-center">
          {icons.globe}
        </button>
      </DockIcon>

      {/* Theme toggle */}
      <DockIcon className="text-muted-foreground transition-colors hover:text-foreground">
        <button onClick={handleThemeToggle} aria-label="Toggle theme" title="Toggle theme" className="flex items-center justify-center">
          {isDark ? icons.sun : icons.moon}
        </button>
      </DockIcon>
    </Dock>
  );
}
