"use client";

import { usePathname } from "next/navigation";
import { ThemeToggle, LanguageToggle, useLanguage } from "@/components";
import Link from "next/link";

export default function HeaderNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const linkClass = (path: string) => {
    const base = "hover:underline";
    return isActive(path) ? `${base} font-bold underline` : base;
  };

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className={`font-semibold ${linkClass("/")}`}>{t('formBuilder')}</Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link className={linkClass("/builder")} href="/builder">{t('builder')}</Link>
          <Link className={linkClass("/watch")} href="/watch">{t('checkSchema')}</Link>
          <LanguageToggle />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
