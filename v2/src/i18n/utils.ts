export const languages = {
  en: 'English',
  ja: '日本語',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string) {
    return `/${lang}${path}`;
  };
}

export async function getTranslations(lang: Lang) {
  const ui = (await import(`./locales/${lang}.json`)).default as Record<string, string>;
  return function t(key: string): string {
    return ui[key] ?? key;
  };
}
