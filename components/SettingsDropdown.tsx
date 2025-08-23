"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage, useTheme } from "@/components";
import { Language, languages } from "@/lib/translations";

export default function SettingsDropdown() {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        className={`p-1 text-sm transition-colors rounded ${
          mounted && theme === 'dark' 
            ? 'hover:bg-gray-800 text-gray-200' 
            : 'hover:bg-gray-100 text-gray-900'
        }`}
        aria-label={t('settings')}
        title={t('settings')}
      >
        <span>⚙️</span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 sm:w-56 rounded-md shadow-lg z-50 ${
          mounted && theme === 'dark' 
            ? 'bg-gray-800 border border-gray-600' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className="py-1">
            {/* Language Section */}
            <div className={`px-3 py-2 border-b ${
              mounted && theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <div className={`text-xs font-medium mb-2 ${
                mounted && theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
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
                        ? mounted && theme === 'dark'
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-blue-100 text-blue-700'
                        : mounted && theme === 'dark'
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
                mounted && theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={toggle}
      className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
        mounted && theme === 'dark'
          ? 'hover:bg-gray-700 text-gray-200'
          : 'hover:bg-gray-100 text-gray-900'
      }`}
    >
      {mounted && theme === 'dark' ? t('light') : t('dark')}
    </button>
  );
}
