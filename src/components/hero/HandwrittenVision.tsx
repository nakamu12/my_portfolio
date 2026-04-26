import { useReducedMotion } from 'motion/react';
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { TegakiRenderer } from 'tegaki';
import caveat from 'tegaki/fonts/caveat';
import { cn } from '@/lib/utils';

interface HandwrittenVisionProps {
  text: string;
  lang: 'ja' | 'en';
  className?: string;
}

const VISION_EFFECTS = {
  pressureWidth: { strength: 1.3 },
  taper: { startLength: 0.05, endLength: 0.05 },
  glow: { radius: 1.5, color: 'rgba(124, 128, 255, 0.7)' },
  gradient: { colors: ['#686dff', '#b66fff'] },
} as const;

const VISION_STYLE: CSSProperties = {
  fontSize: 'clamp(1.875rem, 2vw + 1.35rem, 3rem)',
  lineHeight: 1.2,
};

const JAPANESE_VISION_STYLE: CSSProperties = {
  ...VISION_STYLE,
  fontFamily: "'Yomogi', 'Noto Sans JP', sans-serif",
  fontWeight: 700,
  letterSpacing: '0.02em',
  WebkitTextStroke: '0.01em rgba(104, 109, 255, 0.3)',
};

const CAVEAT_FONT_URL = `${import.meta.env.BASE_URL}fonts/caveat.ttf`;
const CAVEAT_BUNDLE = {
  ...caveat,
  fontUrl: CAVEAT_FONT_URL,
  fontFaceCSS: `@font-face { font-family: 'Caveat'; src: url(${CAVEAT_FONT_URL}); }`,
} as const;

function splitGraphemes(value: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(value), (item) => item.segment);
  }
  return Array.from(value);
}

export default function HandwrittenVision({ text, lang, className }: HandwrittenVisionProps) {
  const shouldReduceMotion = useReducedMotion();
  const isJapanese = lang === 'ja';
  const graphemes = useMemo(() => (isJapanese ? splitGraphemes(text) : []), [isJapanese, text]);
  const [visibleCount, setVisibleCount] = useState(() => (isJapanese ? 0 : 0));

  useEffect(() => {
    if (!isJapanese) return;
    if (shouldReduceMotion) {
      setVisibleCount(graphemes.length);
      return;
    }

    setVisibleCount(0);

    const intervalId = window.setInterval(() => {
      setVisibleCount((current) => {
        const next = Math.min(current + 1, graphemes.length);
        if (next >= graphemes.length) {
          window.clearInterval(intervalId);
        }
        return next;
      });
    }, 28);

    return () => window.clearInterval(intervalId);
  }, [graphemes, isJapanese, shouldReduceMotion]);

  if (isJapanese) {
    const renderedJapaneseText = shouldReduceMotion ? text : graphemes.slice(0, visibleCount).join('');

    return (
      <span
        className={cn(
          'inline-block min-h-[1.2em] w-full bg-gradient-to-r from-[#686dff] to-[#b66fff] bg-clip-text text-transparent',
          className,
        )}
        style={JAPANESE_VISION_STYLE}
      >
        {renderedJapaneseText || '\u00A0'}
      </span>
    );
  }

  if (shouldReduceMotion) {
    return (
      <span
        className={cn(
          'inline-block min-h-[1.2em] w-full bg-gradient-to-r from-[#686dff] to-[#b66fff] bg-clip-text text-transparent',
          className,
        )}
        style={VISION_STYLE}
      >
        {text}
      </span>
    );
  }

  return (
    <TegakiRenderer
      font={CAVEAT_BUNDLE}
      time={{ mode: 'uncontrolled', speed: 4 }}
      effects={VISION_EFFECTS}
      style={VISION_STYLE}
      className={cn('inline-block min-h-[1.2em] w-full', className)}
      aria-label={text}
    >
      {text}
    </TegakiRenderer>
  );
}
