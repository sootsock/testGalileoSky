"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

export default function HeaderNav() {
  const pathname = usePathname();

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
        <Link href="/" className={`font-semibold ${linkClass("/")}`}>Form Builder</Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link className={linkClass("/builder")} href="/builder">Builder</Link>
          <Link className={linkClass("/watch")} href="/watch">Check Schema</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
