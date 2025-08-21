import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <ToastProvider>
            <header className="border-b border-black/10 dark:border-white/10">
              <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
                <a href="/" className="font-semibold">Form Builder</a>
                <nav className="flex items-center gap-3 text-sm">
                  <a className="hover:underline" href="/builder">Builder</a>
                  <a className="hover:underline" href="/fill">Fill</a>
                  <a className="hover:underline" href="/watch">Watch</a>
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            <main className="mx-auto max-w-5xl px-4 py-6">
              {children}
            </main>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
