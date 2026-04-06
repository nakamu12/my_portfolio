import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
}

interface MobileNavProps {
  items: NavItem[];
  menuLabel: string;
}

export default function MobileNav({ items, menuLabel }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors"
        aria-label={menuLabel}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

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
