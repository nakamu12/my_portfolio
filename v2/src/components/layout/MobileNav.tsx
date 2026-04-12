import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeLangControls from '@/components/common/ThemeLangControls';

interface NavItem {
  label: string;
  href: string;
}

interface MobileNavProps {
  items: NavItem[];
  menuLabel: string;
  langLabel: string;
  lang: string;
  base: string;
}

export default function MobileNav({ items, menuLabel, langLabel, lang, base }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="flex items-center gap-1">
        <ThemeLangControls currentLang={lang} base={base} langLabel={langLabel} />

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
