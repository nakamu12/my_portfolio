export const languages = {
  en: 'English',
  ja: '日本語',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export function getLangFromUrl(url: URL): Lang {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path =
    base && url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname;
  const [, lang] = path.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string) {
    return `/${lang}${path}`;
  };
}

export async function getTranslations(lang: Lang) {
  // Defense-in-depth: ensure lang is in the allowlist before dynamic import
  const safeLang: Lang = lang in languages ? lang : defaultLang;
  const ui = (await import(`./locales/${safeLang}.json`)).default as Record<string, string>;
  return function t(key: string): string {
    return ui[key] ?? key;
  };
}
