import { useEffect, useRef, useState } from 'react';
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

/** Returns all keyboard-focusable elements inside a container. */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export default function MobileNav({ items, menuLabel, langLabel, lang, base }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  // Guards the close-path focus return so it never fires on initial mount.
  const wasOpenRef = useRef(false);

  // Move focus into the menu when it opens; return to trigger when it closes.
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      // Effects run after commit, so the menu is already in the DOM.
      // (No rAF here: rAF callbacks never fire while the tab is hidden.)
      if (menuRef.current) {
        const focusable = getFocusableElements(menuRef.current);
        focusable[0]?.focus();
      }
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Keyboard handling: Escape closes the menu; Tab/Shift+Tab cycle within.
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key === 'Tab' && menuRef.current) {
        const focusable = getFocusableElements(menuRef.current);
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  function handleLinkClick() {
    setIsOpen(false);
  }

  return (
    <div className="md:hidden">
      <div className="flex items-center gap-1">
        <ThemeLangControls currentLang={lang} base={base} langLabel={langLabel} />

        {/* Hamburger */}
        <button
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className="text-muted-foreground hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors"
          aria-label={menuLabel}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          id="mobile-nav-menu"
          className="border-border bg-background/95 absolute top-16 left-0 w-full border-b backdrop-blur-md"
        >
          <nav aria-label={menuLabel} className="mx-auto flex max-w-6xl flex-col px-6 py-4">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
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
