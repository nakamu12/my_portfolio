import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

// ── Animation variants ─────────────────────────────────────────────────────
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.88 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 320, damping: 22 },
  },
};

// ── ToolIcon ───────────────────────────────────────────────────────────────
function ToolIcon({ tool }: { tool: Tool }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      title={tool.description}
      className="group flex flex-col items-center gap-2.5 rounded-2xl p-3"
      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
    >
      {/* Icon */}
      <div
        className={cn(
          'border-border bg-card relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border transition-all duration-200',
          'group-hover:border-[#686dff]/50 group-hover:bg-[rgba(104,109,255,0.06)] group-hover:shadow-[0_8px_24px_rgba(104,109,255,0.18)]',
        )}
      >
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
      <span className="text-muted-foreground group-hover:text-foreground w-full text-center text-[11px] leading-tight font-medium transition-colors">
        {tool.name}
      </span>
    </motion.a>
  );
}

// ── ToolGrid ───────────────────────────────────────────────────────────────
export default function ToolGrid({ categories, tools, allLabel }: Props) {
  const [active, setActive] = useState(allLabel);

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
            aria-pressed={active === tab}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150',
              active === tab
                ? 'bg-[#686dff] text-white shadow-[0_0_12px_rgba(104,109,255,0.45)]'
                : 'text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Icon grid — AnimatePresence handles filter crossfade + stagger */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          variants={gridVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="grid grid-cols-4 gap-1 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8"
        >
          {filtered.map((tool) => (
            <motion.div key={tool.id} variants={itemVariants}>
              <ToolIcon tool={tool} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
