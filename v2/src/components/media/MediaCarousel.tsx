import { useState, useRef } from 'react';

type MediaItem = {
  title: string;
  category: string;
  thumbnail?: string;
  description: string;
  link: string;
  stats?: Record<string, string>;
};

type Props = {
  items: MediaItem[];
  labels: Record<string, string>;
};

type Category = 'all' | 'youtube' | 'podcast' | 'presentation' | 'article';

const CAT_STYLES: Record<
  string,
  { text: string; bg: string; dot: string; border: string; gradient: string }
> = {
  youtube: {
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    dot: 'bg-red-400',
    border: 'border-red-500/30',
    gradient: 'from-red-950 via-red-900/50 to-neutral-900',
  },
  podcast: {
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    dot: 'bg-green-400',
    border: 'border-green-500/30',
    gradient: 'from-green-950 via-green-900/40 to-neutral-900',
  },
  presentation: {
    text: 'text-[#686dff]',
    bg: 'bg-[#686dff]/10',
    dot: 'bg-[#686dff]',
    border: 'border-[#686dff]/30',
    gradient: 'from-[#1a1a3e] via-[#686dff]/20 to-neutral-900',
  },
  article: {
    text: 'text-neutral-400',
    bg: 'bg-neutral-500/10',
    dot: 'bg-neutral-500',
    border: 'border-neutral-500/30',
    gradient: 'from-neutral-800 via-neutral-800/60 to-neutral-900',
  },
};

const CATEGORIES: Category[] = ['all', 'youtube', 'podcast', 'presentation', 'article'];

export default function MediaCarousel({ items, labels }: Props) {
  const [active, setActive] = useState<Category>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const counts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === 'all' ? items.length : items.filter((i) => i.category === cat).length;
    return acc;
  }, {});

  const visibleCats = CATEGORIES.filter((cat) => counts[cat] > 0);
  const filtered = active === 'all' ? items : items.filter((i) => i.category === active);

  const scroll = (dir: 'prev' | 'next') => {
    scrollRef.current?.scrollBy({ left: dir === 'next' ? 300 : -300, behavior: 'smooth' });
  };

  const handleCategoryClick = (cat: Category) => {
    setActive(cat);
    scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Filter Tabs */}
      <div
        className="mb-8 flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        {visibleCats.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
              active === cat
                ? 'border-[#686dff] bg-[#686dff] text-white'
                : 'border-border bg-background text-muted-foreground hover:border-[#686dff]/40 hover:text-foreground'
            }`}
          >
            {labels[cat === 'all' ? 'media.category.all' : `media.category.${cat}`] ?? cat}
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

      {/* Carousel */}
      <div className="relative">
        <button
          onClick={() => scroll('prev')}
          className="border-border bg-background absolute -left-4 top-[40%] z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow-md transition hover:border-[#686dff]/50 hover:text-[#686dff]"
          aria-label="Previous"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3"
          style={
            {
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
            } as React.CSSProperties
          }
        >
          {filtered.map((item, i) => (
            <MediaCard key={`${item.category}-${i}`} item={item} />
          ))}
        </div>

        <button
          onClick={() => scroll('next')}
          className="border-border bg-background absolute -right-4 top-[40%] z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border shadow-md transition hover:border-[#686dff]/50 hover:text-[#686dff]"
          aria-label="Next"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  const style = CAT_STYLES[item.category] ?? CAT_STYLES.article;

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
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${style.gradient}`}
          >
            <PlaceholderIcon category={item.category} />
          </div>
        )}
        {/* Category pill */}
        <div
          className={`absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full border ${style.border} ${style.bg} px-2.5 py-0.5 backdrop-blur-sm`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          <span className={`text-[10px] font-semibold uppercase tracking-wide ${style.text}`}>
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4
          className={`line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:${style.text}`}
        >
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
            Open
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

function PlaceholderIcon({ category }: { category: string }) {
  if (category === 'youtube') {
    return (
      <svg className="h-12 w-12 text-red-400 opacity-40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    );
  }
  if (category === 'podcast') {
    return (
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
    );
  }
  if (category === 'presentation') {
    return (
      <svg
        className="h-12 w-12 text-[#686dff] opacity-40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h20v14H2z" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    );
  }
  return (
    <svg
      className="h-12 w-12 text-neutral-400 opacity-40"
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
  );
}
