import { useReducedMotion } from 'motion/react';
import { Component, type CSSProperties, type ReactNode } from 'react';
import { TegakiRenderer } from 'tegaki';
import caveat from 'tegaki/fonts/caveat';
// Override tegaki's bundled-ttf fontUrl with @fontsource/caveat's hashed woff2
// so the runtime fetch goes through Vite-built _astro assets (less likely to
// be MIME-blocked by SSL-inspecting proxies than a raw .ttf).
import caveatFontUrl from '@fontsource/caveat/files/caveat-latin-400-normal.woff2?url';
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

const FALLBACK_VISION_STYLE: CSSProperties = {
  ...VISION_STYLE,
  fontFamily: "'Caveat', cursive",
};

const CAVEAT_BUNDLE = {
  ...caveat,
  fontUrl: caveatFontUrl,
  fontFaceCSS: `@font-face { font-family: 'Caveat'; src: url(${caveatFontUrl}) format('woff2'); }`,
} as const;

function FallbackVision({ text, className }: HandwrittenVisionProps) {
  return (
    <span
      className={cn(
        'inline-block min-h-[1.2em] w-full bg-gradient-to-r from-[#686dff] to-[#b66fff] bg-clip-text text-transparent',
        className,
      )}
      style={FALLBACK_VISION_STYLE}
    >
      {text}
    </span>
  );
}

class TegakiBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { errored: boolean }
> {
  state = { errored: false };
  static getDerivedStateFromError() {
    return { errored: true };
  }
  render() {
    return this.state.errored ? this.props.fallback : this.props.children;
  }
}

export default function HandwrittenVision({ text, className }: HandwrittenVisionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <FallbackVision text={text} className={className} />;
  }

  return (
    <TegakiBoundary fallback={<FallbackVision text={text} className={className} />}>
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
    </TegakiBoundary>
  );
}
