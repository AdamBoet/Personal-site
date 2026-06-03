"use client";

import { useState, useRef, useEffect } from "react";

export default function FormulaInfo() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-zinc-600 hover:text-zinc-400 transition-colors text-sm leading-none"
        aria-label="Show difficulty formula"
      >
        ⓘ
      </button>

      {open && (
        <div className="absolute right-0 top-6 z-50 w-72 rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl p-4 space-y-3 text-xs">
          <p className="text-zinc-300 font-semibold text-sm">Difficulty formula</p>

          <div className="rounded-lg bg-zinc-800 px-3 py-2 font-mono text-zinc-200 leading-relaxed">
            <p>score =</p>
            <p className="pl-3">lapse_rate &times; <span className="text-amber-400">0.45</span></p>
            <p className="pl-3">+ lapses &times; <span className="text-amber-400">0.20</span></p>
            <p className="pl-3">+ interval_diff &times; <span className="text-amber-400">0.35</span></p>
          </div>

          <div className="space-y-2 text-zinc-400">
            <div>
              <span className="text-zinc-200">lapse_rate</span> = lapses ÷ reviews
              <p className="text-zinc-600 mt-0.5">how often you forget, relative to total reviews</p>
            </div>
            <div>
              <span className="text-zinc-200">lapses</span> = your lapses ÷ hardest card&apos;s lapses
              <p className="text-zinc-600 mt-0.5">absolute forgetting count, normalised 0–1</p>
            </div>
            <div>
              <span className="text-zinc-200">interval_diff</span> = 1 − min(interval, 90) ÷ 90
              <p className="text-zinc-600 mt-0.5">short interval means card keeps coming back</p>
            </div>
          </div>

          <p className="text-zinc-600 border-t border-zinc-800 pt-2">
            Score is percentile-ranked across all cards — colours show easiest 25% → hardest 25%.
          </p>
        </div>
      )}
    </div>
  );
}
