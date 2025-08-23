"use client";

import { useLanguage } from "./LanguageProvider";
import { Language, languages } from "@/lib/translations";

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{t('language')}:</span>
      <div className="flex border rounded overflow-hidden">
        {(['en', 'ru'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`px-3 py-1 text-sm transition-colors ${
              language === lang
                ? 'bg-blue-600 text-white'
                : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {languages[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}
