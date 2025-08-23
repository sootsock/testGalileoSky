import { en } from './en';
import { ru } from './ru';

export type Language = 'en' | 'ru';
export type TranslationKey = keyof typeof en;

export const translations = {
  en,
  ru,
} as const;

export const languages: Record<Language, string> = {
  en: 'English',
  ru: 'Русский',
};

export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language][key];
}
