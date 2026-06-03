import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

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
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased flex">
        <Sidebar />
        <main className="flex-1 p-10">{children}</main>
      </body>
    </html>
  );
}
