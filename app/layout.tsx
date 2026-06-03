import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import ThemeToggle from "./components/ThemeToggle";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Adam's Dashboard",
  description: "Personal life stats",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen antialiased flex">
        <Providers>
          <Sidebar />
          <main className="flex-1 p-4 sm:p-8 pb-24 md:pb-8">{children}</main>
          <BottomNav />
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
