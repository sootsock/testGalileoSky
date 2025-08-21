import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Form Builder",
  description: "Next.js form builder and filler with local validation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b border-black/10 dark:border-white/10">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-semibold">Form Builder</a>
            <nav className="flex gap-4 text-sm">
              <a className="hover:underline" href="/builder">Builder</a>
              <a className="hover:underline" href="/fill">Fill</a>
              <a className="hover:underline" href="https://nextjs.org" target="_blank" rel="noreferrer">Next.js</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
