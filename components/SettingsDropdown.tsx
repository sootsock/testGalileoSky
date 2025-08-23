"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage, useTheme } from "@/components";
import { Language, languages } from "@/lib/translations";

export default function SettingsDropdown() {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`border rounded px-2 sm:px-3 py-1 text-sm transition-colors ${
          theme === 'dark' 
            ? 'border-gray-600 hover:bg-gray-800 text-gray-200' 
            : 'border-gray-300 hover:bg-gray-100 text-gray-900'
        }`}
        aria-label={t('settings')}
        title={t('settings')}
      >
        <span className="hidden sm:inline">⚙️ {t('settings')}</span>
        <span className="sm:hidden">⚙️</span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 sm:w-56 rounded-md shadow-lg z-50 ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-600' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className="py-1">
            {/* Language Section */}
            <div className={`px-3 py-2 border-b ${
              theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <div className={`text-xs font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('changeLanguage')}
              </div>
              <div className="space-y-1">
                {(['en', 'ru'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                      language === lang
                        ? theme === 'dark'
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-blue-100 text-blue-700'
                        : theme === 'dark'
                          ? 'hover:bg-gray-700 text-gray-200'
                          : 'hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    {languages[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Section */}
            <div className="px-3 py-2">
              <div className={`text-xs font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {t('changeTheme')}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Theme toggle component that integrates with the existing theme system
function ThemeToggle() {
  const { t } = useLanguage();
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
        theme === 'dark'
          ? 'hover:bg-gray-700 text-gray-200'
          : 'hover:bg-gray-100 text-gray-900'
      }`}
    >
      {theme === 'dark' ? t('light') : t('dark')}
    </button>
  );
}
