"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { useLanguage } from "@/components";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="border rounded px-2 py-1 text-sm"
        aria-label={t('toggleTheme')}
        title={t('toggleTheme')}
      >
        {t('light')}
      </button>
    );
  }

  return (
    <button
      className="border rounded px-2 py-1 text-sm"
      onClick={toggle}
      aria-label={t('toggleTheme')}
      title={t('toggleTheme')}
    >
      {theme === "dark" ? t('light') : t('dark')}
    </button>
  );
}


