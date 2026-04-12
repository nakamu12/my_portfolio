import type { ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeState } from '@/hooks/useThemeState';
import { useLangSwitch } from '@/hooks/useLangSwitch';

export interface ThemeLangControl {
  key: 'theme' | 'lang';
  label: string;
  title: string;
  icon: ReactNode;
  onClick: () => void;
}

interface ThemeLangControlsProps {
  currentLang: string;
  base: string;
  langLabel: string;
  themeLabel?: string;
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  onAction?: () => void;
  renderControl?: (control: ThemeLangControl) => ReactNode;
}

export default function ThemeLangControls({
  currentLang,
  base,
  langLabel,
  themeLabel = 'Toggle theme',
  className,
  buttonClassName,
  iconClassName = 'h-4 w-4',
  onAction,
  renderControl,
}: ThemeLangControlsProps) {
  const { isDark, toggleTheme } = useThemeState();
  const switchLang = useLangSwitch(currentLang, base);
  const isJapanese = currentLang === 'ja';

  const controls: ThemeLangControl[] = [
    {
      key: 'lang',
      label: langLabel,
      title: langLabel,
      icon: (
        <span className="text-[10px] font-semibold leading-none tracking-wide">
          <span className={cn(isJapanese ? 'opacity-100' : 'opacity-50')}>JP</span>
          <span className="px-0.5 opacity-50">/</span>
          <span className={cn(!isJapanese ? 'opacity-100' : 'opacity-50')}>EN</span>
        </span>
      ),
      onClick: switchLang,
    },
    {
      key: 'theme',
      label: themeLabel,
      title: themeLabel,
      icon: isDark ? <Sun className={iconClassName} /> : <Moon className={iconClassName} />,
      onClick: toggleTheme,
    },
  ];

  const handleControlClick = (control: ThemeLangControl) => {
    onAction?.();
    control.onClick();
  };

  if (renderControl) {
    return (
      <>
        {controls.map((control) =>
          renderControl({
            ...control,
            onClick: () => handleControlClick(control),
          }),
        )}
      </>
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {controls.map((control) => (
        <button
          key={control.key}
          type="button"
          onClick={() => handleControlClick(control)}
          className={cn(
            'text-muted-foreground hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors',
            buttonClassName,
          )}
          aria-label={control.label}
          title={control.title}
        >
          {control.icon}
        </button>
      ))}
    </div>
  );
}
