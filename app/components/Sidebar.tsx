"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Overview", icon: "⊞" },
  { href: "/hanzi", label: "汉字 Hanzi", icon: "字" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-52 shrink-0 border-r border-zinc-800 min-h-screen p-4 flex-col gap-1">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest px-3 mb-3">
        Adam
      </p>
      {nav.map(({ href, label, icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-zinc-800 text-zinc-100 font-medium"
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
            }`}
          >
            <span className="text-base w-5 text-center">{icon}</span>
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
