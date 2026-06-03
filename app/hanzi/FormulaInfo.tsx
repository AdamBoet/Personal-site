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
        <div className="absolute right-0 top-6 z-50 w-80 rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl p-5 space-y-5">

          <p className="text-base font-semibold text-zinc-100">Difficulty formula</p>

          {/* Formula */}
          <div className="rounded-xl bg-zinc-800 p-4 font-mono text-sm space-y-1 text-zinc-200">
            <p>score =</p>
            <p className="pl-4">lapse_rate &nbsp;&times;&nbsp; <span className="text-amber-400">0.45</span></p>
            <p className="pl-4">+ lapses &nbsp;&nbsp;&nbsp;&nbsp;&times;&nbsp; <span className="text-amber-400">0.20</span></p>
            <p className="pl-4">+ interval &nbsp;&nbsp;&times;&nbsp; <span className="text-amber-400">0.35</span></p>
          </div>

          {/* Explanations */}
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-200">lapse_rate</p>
              <p className="text-sm text-zinc-400">lapses ÷ reviews</p>
              <p className="text-xs text-zinc-600">How often you forget, relative to total reviews. Normalises for how long you've had the card.</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-200">lapses</p>
              <p className="text-sm text-zinc-400">your lapses ÷ hardest card's lapses</p>
              <p className="text-xs text-zinc-600">Absolute number of times you've forgotten. Normalised 0–1 so one card with many lapses doesn't skew the rest.</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-zinc-200">interval</p>
              <p className="text-sm text-zinc-400">1 − min(interval, 90) ÷ 90</p>
              <p className="text-xs text-zinc-600">Short interval means the card keeps coming back quickly. Capped at 90 days — anything longer is considered fully mature.</p>
            </div>
          </div>

          <p className="text-xs text-zinc-600 border-t border-zinc-800 pt-4">
            Final score is percentile-ranked across all cards. Colours show the easiest 25% through to the hardest 25%.
          </p>
        </div>
      )}
    </div>
  );
}
