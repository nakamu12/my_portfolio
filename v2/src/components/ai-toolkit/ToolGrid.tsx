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
}

function ToolIcon({ tool }: { tool: Tool }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-3 rounded-2xl p-4 transition-all duration-200 hover:bg-white/5"
      title={tool.description}
    >
      {/* Icon container */}
      <div className="border-border bg-card relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border transition-all duration-200 group-hover:border-[#686dff]/40 group-hover:shadow-[0_0_20px_rgba(104,109,255,0.12)]">
        {imgError ? (
          <span className="text-muted-foreground text-xl font-bold">{tool.name[0]}</span>
        ) : (
          <img
            src={tool.logoUrl}
            alt=""
            aria-hidden="true"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Name */}
      <span className="text-foreground w-full text-center text-xs leading-tight font-medium transition-colors group-hover:text-[#686dff]">
        {tool.name}
      </span>
    </a>
  );
}

export default function ToolGrid({ categories, tools, allLabel }: Props) {
  const [active, setActive] = useState(allLabel);

  // Categories excluding the "all" sentinel
  const cats = categories.filter((c) => c !== allLabel);
  const tabs = [allLabel, ...cats];

  const filtered = active === allLabel ? tools : tools.filter((t) => t.category === active);

  return (
    <div>
      {/* Category tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150',
              active === tab
                ? 'bg-[#686dff] text-white shadow-[0_0_12px_rgba(104,109,255,0.4)]'
                : 'text-muted-foreground hover:text-foreground bg-white/5 hover:bg-white/10',
            )}
            aria-pressed={active === tab}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Icon grid */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {filtered.map((tool) => (
          <ToolIcon key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
