import { useReducedMotion } from 'motion/react';
import type { CSSProperties } from 'react';
import { TegakiRenderer } from 'tegaki';
import caveat from 'tegaki/fonts/caveat';
import { cn } from '@/lib/utils';

interface HandwrittenVisionProps {
  text: string;
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

const normalizedBaseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const CAVEAT_FONT_URL = `${normalizedBaseUrl}fonts/caveat.ttf`;
const CAVEAT_BUNDLE = {
  ...caveat,
  fontUrl: CAVEAT_FONT_URL,
  fontFaceCSS: `@font-face { font-family: 'Caveat'; src: url(${CAVEAT_FONT_URL}); }`,
} as const;

export default function HandwrittenVision({ text, className }: HandwrittenVisionProps) {
  const shouldReduceMotion = useReducedMotion();

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
      time={{ mode: 'uncontrolled', speed: 7.5 }}
      effects={VISION_EFFECTS}
      style={VISION_STYLE}
      className={cn('inline-block min-h-[1.2em] w-full', className)}
      aria-label={text}
    >
      {text}
    </TegakiRenderer>
  );
}
