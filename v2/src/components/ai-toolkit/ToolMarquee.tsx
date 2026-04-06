interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  logoUrl: string;
  url: string;
}

interface Props {
  /** Ordered list of categories (defines row order) */
  categories: string[];
  tools: Tool[];
}

function ToolChip({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      title={tool.description}
      className="group border-border bg-background mx-2 flex shrink-0 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 hover:border-[#686dff]/50 hover:shadow-[0_0_16px_rgba(104,109,255,0.15)]"
    >
      {/* Logo */}
      <span className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        <img
          src={tool.logoUrl}
          alt=""
          aria-hidden="true"
          width={20}
          height={20}
          className="h-5 w-5 object-contain"
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const fb = img.nextElementSibling as HTMLElement | null;
            if (fb) fb.style.display = 'flex';
          }}
        />
        <span
          className="text-muted-foreground hidden h-full w-full items-center justify-center text-xs font-bold"
          aria-hidden="true"
        >
          {tool.name[0]}
        </span>
      </span>

      {/* Name */}
      <span className="text-foreground text-sm font-semibold whitespace-nowrap transition-colors group-hover:text-[#686dff]">
        {tool.name}
      </span>
    </a>
  );
}

function MarqueeRow({
  tools,
  direction,
  duration,
}: {
  tools: Tool[];
  direction: 'left' | 'right';
  duration: number;
}) {
  // Duplicate items to create seamless loop
  const items = [...tools, ...tools];
  const cls = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className="relative flex overflow-hidden">
      {/* Fade masks */}
      <div className="from-background pointer-events-none absolute top-0 left-0 z-10 h-full w-16 bg-gradient-to-r to-transparent" />
      <div className="from-background pointer-events-none absolute top-0 right-0 z-10 h-full w-16 bg-gradient-to-l to-transparent" />

      <div
        className={`flex ${cls}`}
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        {items.map((tool, i) => (
          <ToolChip key={`${tool.id}-${i}`} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export default function ToolMarquee({ categories, tools }: Props) {
  // Group tools by category (preserving categories order, skip "All"-like entries)
  const grouped = categories
    .filter((cat) => tools.some((t) => t.category === cat))
    .map((cat) => ({
      category: cat,
      tools: tools.filter((t) => t.category === cat),
    }));

  return (
    <div className="space-y-6">
      {grouped.map(({ category, tools: catTools }, idx) => {
        const direction = idx % 2 === 0 ? 'left' : 'right';
        // Base duration on tool count so rows with fewer items don't look rushed
        const duration = Math.max(18, catTools.length * 5);

        return (
          <div key={category} className="marquee-row group/row">
            {/* Category label */}
            <div className="mb-2 flex items-center gap-3 px-1">
              <span className="text-muted-foreground/60 text-xs font-medium tracking-widest uppercase">
                {category}
              </span>
              <div className="border-border h-px flex-1 border-t" />
              <span className="text-muted-foreground/40 text-xs">{catTools.length}</span>
            </div>

            {/* Marquee track */}
            <MarqueeRow tools={catTools} direction={direction} duration={duration} />
          </div>
        );
      })}
    </div>
  );
}
