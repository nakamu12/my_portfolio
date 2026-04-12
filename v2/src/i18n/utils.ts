import enUi from './locales/en.json';
import jaUi from './locales/ja.json';

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

const UI_LOCALES: Record<Lang, Record<string, string>> = {
  en: enUi as Record<string, string>,
  ja: jaUi as Record<string, string>,
};

export async function getTranslations(lang: Lang) {
  // Defense-in-depth: ensure lang is in the allowlist before locale selection
  const safeLang: Lang = lang in languages ? lang : defaultLang;
  const ui = UI_LOCALES[safeLang] ?? UI_LOCALES[defaultLang];
  return function t(key: string): string {
    return ui[key] ?? key;
  };
}
