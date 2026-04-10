import { useState, useRef } from 'react';

export type MediaItem = {
  title: string;
  category: string;
  source?: string;
  thumbnail?: string;
  description: string;
  link: string;
  stats?: Record<string, string>;
};

type Props = {
  items: MediaItem[];
  labels: Record<string, string>;
  emptyMessage?: string;
};

type Category = string;

// ── Category pill styles ──────────────────────────────────────────────────────
const CAT_STYLES: Record<string, { text: string; bg: string; dot: string; border: string }> = {
  youtube: {
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    dot: 'bg-red-400',
    border: 'border-red-500/30',
  },
  podcast: {
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    dot: 'bg-green-400',
    border: 'border-green-500/30',
  },
  press: {
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    dot: 'bg-orange-400',
    border: 'border-orange-500/30',
  },
  written: {
    text: 'text-[#686dff]',
    bg: 'bg-[#686dff]/10',
    dot: 'bg-[#686dff]',
    border: 'border-[#686dff]/30',
  },
  supervised: {
    text: 'text-[#b66fff]',
    bg: 'bg-[#b66fff]/10',
    dot: 'bg-[#b66fff]',
    border: 'border-[#b66fff]/30',
  },
  presentation: {
    text: 'text-[#686dff]',
    bg: 'bg-[#686dff]/10',
    dot: 'bg-[#686dff]',
    border: 'border-[#686dff]/30',
  },
};

// ── Source-based thumbnail backgrounds ───────────────────────────────────────
const SOURCE_STYLES: Record<string, { gradient: string; textColor: string }> = {
  SoftBank: {
    gradient: 'from-blue-950 via-blue-900/50 to-neutral-900',
    textColor: 'text-blue-300',
  },
  'SoftBank BIZ': {
    gradient: 'from-blue-950 via-blue-900/50 to-neutral-900',
    textColor: 'text-blue-300',
  },
  'SoftBank Recruit': {
    gradient: 'from-blue-950 via-blue-900/50 to-neutral-900',
    textColor: 'text-blue-300',
  },
  enXross: {
    gradient: 'from-violet-950 via-violet-900/40 to-neutral-900',
    textColor: 'text-violet-300',
  },
  Spotify: {
    gradient: 'from-green-950 via-green-900/40 to-neutral-900',
    textColor: 'text-green-300',
  },
  note: {
    gradient: 'from-teal-950 via-teal-900/40 to-neutral-900',
    textColor: 'text-teal-300',
  },
  Zenn: {
    gradient: 'from-sky-950 via-sky-900/40 to-neutral-900',
    textColor: 'text-sky-300',
  },
};

const CAT_KEY_PREFIX = 'media.category.';

export default function MediaCarousel({ items, labels, emptyMessage }: Props) {
  const [active, setActive] = useState<Category>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Derive visible categories (only ones that have items)
  const allCategories = Array.from(new Set(items.map((i) => i.category)));
  const visibleCats: Category[] = ['all', ...allCategories];

  const counts: Record<string, number> = { all: items.length };
  for (const cat of allCategories) {
    counts[cat] = items.filter((i) => i.category === cat).length;
  }

  const filtered = active === 'all' ? items : items.filter((i) => i.category === active);

  const scroll = (dir: 'prev' | 'next') => {
    scrollRef.current?.scrollBy({ left: dir === 'next' ? 320 : -320, behavior: 'smooth' });
  };

  const handleCat = (cat: Category) => {
    setActive(cat);
    scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const labelFor = (cat: string) =>
    cat === 'all'
      ? (labels[`${CAT_KEY_PREFIX}all`] ?? 'All')
      : (labels[`${CAT_KEY_PREFIX}${cat}`] ?? cat);

  return (
    <div>
      {/* Filter tabs */}
      <div
        className="mb-8 flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none' } as React.CSSProperties}
      >
        {visibleCats.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCat(cat)}
            className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
              active === cat
                ? 'border-[#686dff] bg-[#686dff] text-white'
                : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-[#686dff]/40'
            }`}
          >
            {labelFor(cat)}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                active === cat ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              {counts[cat]}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="border-border flex h-40 items-center justify-center rounded-xl border border-dashed">
          <p className="text-muted-foreground text-sm">{emptyMessage ?? 'Coming soon.'}</p>
        </div>
      ) : (
        /* Carousel */
        <div className="relative">
          <button
            onClick={() => scroll('prev')}
            aria-label="Previous"
            className="border-border bg-background absolute top-[38%] -left-4 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow-md transition hover:border-[#686dff]/50 hover:text-[#686dff]"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-3"
            style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' } as React.CSSProperties}
          >
            {filtered.map((item) => (
              <MediaCard key={item.link} item={item} labels={labels} />
            ))}
          </div>

          <button
            onClick={() => scroll('next')}
            aria-label="Next"
            className="border-border bg-background absolute top-[38%] -right-4 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow-md transition hover:border-[#686dff]/50 hover:text-[#686dff]"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function MediaCard({ item, labels }: { item: MediaItem; labels: Record<string, string> }) {
  const style = CAT_STYLES[item.category] ?? CAT_STYLES.press;
  const srcStyle = item.source ? SOURCE_STYLES[item.source] : undefined;
  // Thumbnails are resolved at build time; no client-side YouTube fallback needed
  const thumbnail = item.thumbnail;

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border bg-background group w-72 shrink-0 overflow-hidden rounded-xl border transition-all duration-200 hover:border-[#686dff]/40 hover:shadow-lg"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Thumbnail */}
      <div className="bg-muted relative aspect-video overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : srcStyle ? (
          /* Source-branded gradient */
          <div
            className={`flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br ${srcStyle.gradient}`}
          >
            <span className={`text-lg font-bold tracking-tight ${srcStyle.textColor} opacity-50`}>
              {item.source}
            </span>
          </div>
        ) : (
          /* Category fallback */
          <CategoryPlaceholder category={item.category} />
        )}

        {/* Category pill */}
        <div
          className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full border ${style.border} ${style.bg} px-2.5 py-0.5 backdrop-blur-sm`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          <span className={`text-[10px] font-semibold tracking-wide uppercase ${style.text}`}>
            {labels[`${CAT_KEY_PREFIX}${item.category}`] ?? item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="text-foreground line-clamp-2 text-sm leading-snug font-semibold transition-colors group-hover:text-[#686dff]">
          {item.title}
        </h4>
        <p className="text-muted-foreground mt-1.5 line-clamp-2 text-xs leading-relaxed">
          {item.description}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          {item.stats && Object.keys(item.stats).length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {Object.values(item.stats)
                .slice(0, 2)
                .map((val, i) => (
                  <span
                    key={i}
                    className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-[10px]"
                  >
                    {val}
                  </span>
                ))}
            </div>
          ) : (
            <span />
          )}
          <span
            className={`flex shrink-0 items-center gap-1 text-xs font-medium ${style.text} opacity-0 transition-opacity group-hover:opacity-100`}
          >
            {labels['media.card.open'] ?? 'Open'}
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}

function CategoryPlaceholder({ category }: { category: string }) {
  if (category === 'youtube') {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-950 via-red-900/50 to-neutral-900">
        <svg className="h-12 w-12 text-red-400 opacity-40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
        </svg>
      </div>
    );
  }
  if (category === 'podcast') {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-950 via-green-900/40 to-neutral-900">
        <svg
          className="h-12 w-12 text-green-400 opacity-40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="11" r="3" />
          <path d="M6.343 17.657A8 8 0 1 1 17.657 6.343 8 8 0 0 1 6.343 17.657z" />
          <path d="M12 21v-6" />
          <path d="M9 21h6" />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 via-neutral-800/60 to-neutral-900">
      <svg
        className="h-10 w-10 text-neutral-500 opacity-40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    </div>
  );
}
