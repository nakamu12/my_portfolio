import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Brand Beams — decorative SVG background that extends from below the Hero
 * section down to the Contact section, visually bridging the Hero's WebGL
 * fluid background with the rest of the page.
 *
 * Each beam is a **single cubic Bézier** (one M + one C command) — zero
 * junctions, zero connectors. A single cubic is C∞ smooth within its
 * parameter range: position, tangent, and curvature all vary continuously,
 * and the curvature passes smoothly through zero at its inflection points
 * instead of flipping abruptly. This eliminates the "jointed" feel that
 * chained arcs or multi-segment Béziers produce.
 *
 * Animation layers (all GPU-composited):
 *   1. Whole-beam pulse — the entire <g> element pulses opacity 0.75 → 1.0
 *      → 0.75 on a 4s loop, making the beam feel like it's "breathing".
 *   2. Bright stroke-dasharray flow — an overlay <path> with pathLength=100
 *      and a dash pattern ("6 94") runs one bright segment along the curve
 *      by animating strokeDashoffset 0 → -100. The segment stays perfectly
 *      tangent to the path because it IS the path, so there's no
 *      mismatched orientation like a round particle would produce.
 *
 * Respects `prefers-reduced-motion` and adapts to mobile viewports.
 */

// LEFT: a single cubic from the upper-left to the lower-left, with control
// points pushed far beyond the viewBox so the curve swings dramatically —
// a deep left dip to x≈34 around y=580, then a prominent right peak to
// x≈610 around y=2950 — before returning to the lower-left.
const LEFT_BEAM_D = 'M 180 0 C -500 1200, 1500 2800, 100 4000';

// RIGHT: a single cubic mirroring LEFT's x-swing, but with control-point y
// values shifted later (2300 / 3600 vs LEFT's 1200 / 2800). RIGHT's x
// extremes therefore happen at different pixel Y values than LEFT's, so
// the two beams cross at off-center positions rather than at x=500.
// Resulting crossings fall around (591, 2725) — right side — and
// (411, 3640) — left side.
const RIGHT_BEAM_D = 'M 820 0 C 1500 2300, -500 3600, 900 4000';

// Mobile: a single cubic hugging the right edge with more pronounced wave.
const MOBILE_BEAM_D = 'M 900 0 C 650 1300, 1150 2700, 900 4000';

// A single bright segment that travels along each beam via stroke-dasharray
// offset animation. With pathLength={100}, these values are percentages:
// 6% bright, 94% gap — summing to 100 so an offset of -100 completes one
// seamless loop. One dash (instead of two) halves the visible flow
// frequency while keeping the dash's travel speed the same.
const FLOW_DASHARRAY = '6 94';
const FLOW_DURATION = 7;

interface BrandBeamsProps {
  className?: string;
}

export default function BrandBeams({ className }: BrandBeamsProps) {
  const shouldReduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const paused = shouldReduce === true;
  const blurStdDev = isMobile ? 4 : 8;
  const blurStdDev2 = isMobile ? 8 : 16;
  const rightBeamPath = isMobile ? MOBILE_BEAM_D : RIGHT_BEAM_D;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 4000"
      preserveAspectRatio="none"
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 h-full w-full',
        'opacity-[0.3] transition-opacity duration-300 dark:opacity-[0.7]',
        'md:opacity-[0.35] md:dark:opacity-[0.85]',
        className,
      )}
    >
      <defs>
        <linearGradient id="brandBeamsGradient" x1="0" y1="0" x2="0" y2="1">
          {/* Fade-in at the top so the beam doesn't appear with a hard edge
              right at the Hero/About boundary. Starts at 0 opacity at y=0
              and ramps up to full by 8% of the path. */}
          <stop offset="0%" stopColor="#686dff" stopOpacity="0" />
          <stop offset="8%" stopColor="#686dff" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#9e86ed" stopOpacity="0.75" />
          <stop offset="70%" stopColor="#b66fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#b66fff" stopOpacity="0" />
        </linearGradient>

        <filter
          id="brandBeamsGlow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurStdDev} result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurStdDev2} result="b2" />
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="b1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Whole-beam pulse — medium intensity breathing */}
      <motion.g
        animate={paused ? { opacity: 1 } : { opacity: [0.75, 1, 0.75] }}
        transition={
          paused
            ? { duration: 0 }
            : {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        {/* Right beam — base stroke */}
        <motion.path
          d={rightBeamPath}
          stroke="url(#brandBeamsGradient)"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          filter="url(#brandBeamsGlow)"
          initial={paused ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            paused
              ? { duration: 0 }
              : {
                  duration: 2.2,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
        />
        {/* Right beam — bright flow overlay (stroke-dasharray streaks).
            Skipped under reduce-motion so a frozen dash isn't pinned at an
            arbitrary point along the path. */}
        {!paused && (
          <motion.path
            d={rightBeamPath}
            stroke="#ffffff"
            strokeOpacity={0.9}
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            filter="url(#brandBeamsGlow)"
            pathLength={100}
            strokeDasharray={FLOW_DASHARRAY}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -100 }}
            transition={{
              duration: FLOW_DURATION,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        )}

        {/* Left beam — desktop only */}
        {!isMobile && (
          <>
            {/* Left beam — base stroke */}
            <motion.path
              d={LEFT_BEAM_D}
              stroke="url(#brandBeamsGradient)"
              strokeWidth={3}
              strokeLinecap="round"
              fill="none"
              filter="url(#brandBeamsGlow)"
              initial={paused ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                paused
                  ? { duration: 0 }
                  : {
                      duration: 2.2,
                      delay: 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
            />
            {/* Left beam — bright flow overlay (phase-shifted from RIGHT by
                half the flow period so the two beams never sync up).
                Skipped under reduce-motion (see right-beam comment above). */}
            {!paused && (
              <motion.path
                d={LEFT_BEAM_D}
                stroke="#ffffff"
                strokeOpacity={0.9}
                strokeWidth={3}
                strokeLinecap="round"
                fill="none"
                filter="url(#brandBeamsGlow)"
                pathLength={100}
                strokeDasharray={FLOW_DASHARRAY}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -100 }}
                transition={{
                  duration: FLOW_DURATION,
                  ease: 'linear',
                  repeat: Infinity,
                  delay: FLOW_DURATION / 2,
                }}
              />
            )}
          </>
        )}
      </motion.g>
    </svg>
  );
}
