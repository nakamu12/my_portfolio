/**
 * Generate public/og-image.png from an SVG template.
 * Uses @resvg/resvg-js (already in devDependencies).
 *
 * Run once:  node scripts/generate-og.mjs
 */

import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'public', 'og-image.png');

// 1200 × 630 — standard OG image dimensions
const WIDTH = 1200;
const HEIGHT = 630;

const svg = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${WIDTH}"
  height="${HEIGHT}"
  viewBox="0 0 ${WIDTH} ${HEIGHT}"
>
  <defs>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#686dff"/>
      <stop offset="100%" stop-color="#b66fff"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#686dff" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#b66fff" stop-opacity="0.05"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0f0f0f"/>

  <!-- Subtle radial glow in upper-left -->
  <ellipse cx="200" cy="180" rx="420" ry="300" fill="url(#glowGrad)"/>

  <!-- Thin gradient accent bar at top -->
  <rect x="0" y="0" width="${WIDTH}" height="4" fill="url(#accentGrad)"/>

  <!-- Name -->
  <text
    x="80"
    y="290"
    font-family="system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    font-size="80"
    font-weight="700"
    letter-spacing="-2"
    fill="#ededed"
  >Ryota Nakamura</text>

  <!-- Subtitle -->
  <text
    x="82"
    y="360"
    font-family="system-ui, -apple-system, Helvetica Neue, Arial, sans-serif"
    font-size="32"
    font-weight="400"
    letter-spacing="1"
    fill="#a3a3a3"
  >AI &amp; Robotics Engineer</text>

  <!-- Gradient accent line under subtitle -->
  <rect x="80" y="388" width="320" height="2" fill="url(#accentGrad)" rx="1"/>

  <!-- Thin border accent at bottom -->
  <rect x="0" y="${HEIGHT - 4}" width="${WIDTH}" height="4" fill="url(#accentGrad)"/>
</svg>`;

mkdirSync(join(__dirname, '..', 'public'), { recursive: true });

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: WIDTH },
});

const pngData = resvg.render();
const pngBuffer = pngData.asPng();

writeFileSync(outPath, pngBuffer);
console.log(`OG image written to ${outPath} (${pngBuffer.length} bytes)`);
