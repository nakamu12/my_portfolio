import { useEffect, useState } from 'react';
import { Moon, Sun, Globe, Menu, X } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

interface MobileNavProps {
  items: NavItem[];
  menuLabel: string;
  lang: string;
  base: string;
}

export default function MobileNav({ items, menuLabel, lang, base }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const handleThemeToggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleLangSwitch = () => {
    const targetLang = lang === 'en' ? 'ja' : 'en';
    localStorage.setItem('lang', targetLang);
    window.location.href = `${base}/${targetLang}/`;
  };

  return (
    <div className="md:hidden">
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={handleThemeToggle}
          className="text-muted-foreground hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Language toggle */}
        <button
          onClick={handleLangSwitch}
          className="text-muted-foreground hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors"
          aria-label="Switch language"
        >
          <Globe className="h-4 w-4" />
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-muted-foreground hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors"
          aria-label={menuLabel}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-border bg-background/95 absolute top-16 left-0 w-full border-b backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl flex-col px-6 py-4">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground py-3 text-sm transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
