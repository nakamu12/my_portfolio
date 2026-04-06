import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  logoUrl: string;
  url: string;
}

interface Props {
  categories: string[];
  tools: Tool[];
  allLabel: string;
  visitLabel: string;
}

export default function ToolFilter({ categories, tools, allLabel, visitLabel }: Props) {
  const [active, setActive] = useState(allLabel);

  const filtered = active === allLabel ? tools : tools.filter((t) => t.category === active);

  return (
    <div>
      {/* Category filter buttons */}
      <div className="mb-10 flex flex-wrap gap-2">
        {[allLabel, ...categories.filter((c) => c !== allLabel)].map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150',
              active === cat
                ? 'border-[#686dff] bg-[#686dff] text-white'
                : 'border-border text-muted-foreground hover:border-[#686dff]/60 hover:text-[#686dff]',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tool grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((tool) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group border-border bg-background flex flex-col gap-4 rounded-xl border p-5 transition-all duration-200 hover:border-[#686dff]/40 hover:bg-[rgba(104,109,255,0.04)]"
            aria-label={`${tool.name} — ${visitLabel}`}
          >
            {/* Header: logo + name + category */}
            <div className="flex items-start gap-3">
              <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={tool.logoUrl}
                  alt={`${tool.name} logo`}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.style.display = 'none';
                    const fallback = img.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <span
                  className="text-muted-foreground hidden h-full w-full items-center justify-center text-sm font-semibold"
                  aria-hidden="true"
                >
                  {tool.name[0]}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-semibold">{tool.name}</p>
                <span className="mt-0.5 inline-block rounded-full bg-[rgba(104,109,255,0.1)] px-2 py-0.5 text-[11px] font-medium text-[#686dff]">
                  {tool.category}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
              {tool.description}
            </p>

            {/* Visit link hint */}
            <span className="text-muted-foreground/50 mt-auto flex items-center gap-1 text-xs transition-colors group-hover:text-[#686dff]">
              {visitLabel}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
