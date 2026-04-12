import { cn } from '@/lib/utils';

export interface FilterTabItem {
  key: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  items: FilterTabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  variant?: 'outline' | 'soft';
  className?: string;
  scrollable?: boolean;
}

export default function FilterTabs({
  items,
  activeKey,
  onChange,
  variant = 'outline',
  className,
  scrollable = false,
}: FilterTabsProps) {
  return (
    <div
      className={cn('flex gap-2', scrollable ? 'overflow-x-auto pb-1' : 'flex-wrap', className)}
      style={scrollable ? ({ scrollbarWidth: 'none' } as React.CSSProperties) : undefined}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        const buttonClass =
          variant === 'soft'
            ? cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[#686dff] text-white shadow-[0_0_12px_rgba(104,109,255,0.45)]'
                  : 'text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80',
              )
            : cn(
                'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'border-[#686dff] bg-[#686dff] text-white'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-[#686dff]/40',
              );

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={buttonClass}
          >
            {item.label}
            {typeof item.count === 'number' && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                  isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
