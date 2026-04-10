import type { ImageMetadata } from 'astro';
import type { Lang } from '@/i18n/utils';

/**
 * Allowlist of supported languages for dynamic data imports.
 * Defense-in-depth: even though getLangFromUrl validates, we check again here
 * to make the data-loading function self-contained.
 */
export const SUPPORTED_LANGS = ['en', 'ja'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export function isSupportedLang(lang: string): lang is SupportedLang {
  return (SUPPORTED_LANGS as readonly string[]).includes(lang);
}

/**
 * Shared image module map loaded eagerly at build time.
 * Used by both Certifications and Achievements sections.
 */
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/certifications/*',
  { eager: true },
);

/**
 * Resolve a certification/achievement image by filename.
 * Rejects filenames containing path separators or traversal segments.
 */
export function getCertificationImage(filename: string | null): ImageMetadata | null {
  if (!filename) return null;
  // Reject any attempt at path traversal or subdirectory access.
  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
    return null;
  }
  return imageModules[`../assets/images/certifications/${filename}`]?.default ?? null;
}

/**
 * Format an ISO date string (YYYY-MM or YYYY-MM-DD) for the given locale.
 * Returns the original string if validation fails, never "Invalid Date".
 */
export function formatCertificationDate(dateStr: string, lang: Lang): string {
  // Strict YYYY-MM or YYYY-MM-DD validation
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(dateStr);
  if (!match) return dateStr;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  if (Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12) {
    return dateStr;
  }

  const date = new Date(year, month - 1, 1);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'short',
  });
}

/**
 * Check whether a URL uses a safe http/https scheme.
 * Used to guard against javascript: / data: URIs from JSON data.
 */
export function isSafeUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  return url.startsWith('https://') || url.startsWith('http://');
}
