"use client";

import { useLanguage } from "@/components";

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t('welcome')}</h1>
      <p className="text-sm">{t('appDescription')}</p>
      <div className="flex gap-3">
        <a className="border rounded px-3 py-2" href="/builder">{t('builder')}</a>
        <a className="border rounded px-3 py-2" href="/watch">{t('checkSchema')}</a>
      </div>
    </div>
  );
}
