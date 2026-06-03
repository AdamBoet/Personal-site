"use client";

import { useState, useCallback } from "react";
import type { HanziCard } from "./CharacterGrid";

function relativeTime(unixSeconds: number): string {
  const diffS = Date.now() / 1000 - unixSeconds;
  if (diffS < 3600) return "< 1 hr ago";
  if (diffS < 86400) return `${Math.floor(diffS / 3600)}h ago`;
  const d = Math.floor(diffS / 86400);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

function Tooltip({ card }: { card: HanziCard & { score: number } }) {
  const ease = card.factor != null ? Math.round(card.factor / 10) : null;
  return (
    <div className="w-52 rounded-xl border border-zinc-700 bg-zinc-900/95 shadow-2xl p-3.5 space-y-3 backdrop-blur-sm text-sm pointer-events-none">
      <div className="flex items-start gap-3">
        <span className="text-4xl leading-none">{card.character}</span>
        <div className="min-w-0">
          <p className="text-xs text-zinc-400 leading-snug">{card.pronunciation}</p>
          <p className="text-xs text-zinc-300 leading-snug mt-0.5 line-clamp-2">{card.front}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {card.reps != null && (
          <>
            <span className="text-zinc-500">Reviews</span>
            <span className="text-zinc-200">{card.reps}×</span>
          </>
        )}
        {ease != null && (
          <>
            <span className="text-zinc-500">Ease</span>
            <span className={ease >= 250 ? "text-emerald-400" : ease >= 200 ? "text-zinc-200" : "text-amber-400"}>
              {ease}%
            </span>
          </>
        )}
        {card.lapses != null && (
          <>
            <span className="text-zinc-500">Lapses</span>
            <span className={card.lapses > 0 ? "text-red-400" : "text-zinc-200"}>{card.lapses}</span>
          </>
        )}
        {card.interval != null && (
          <>
            <span className="text-zinc-500">Interval</span>
            <span className="text-zinc-200">{card.interval} days</span>
          </>
        )}
        {card.mod != null && (
          <>
            <span className="text-zinc-500">Last studied</span>
            <span className="text-zinc-200">{relativeTime(card.mod)}</span>
          </>
        )}
      </div>
      <p className="text-[10px] text-zinc-600">#{card.rank} by frequency</p>
    </div>
  );
}

type ScoredCard = HanziCard & { score: number };

export default function HardCardsRow({ cards }: { cards: ScoredCard[] }) {
  const [hovered, setHovered] = useState<ScoredCard | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div onMouseMove={handleMouseMove}>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {cards.map((card) => {
          const ease = card.factor != null ? Math.round(card.factor / 10) : null;
          return (
            <div
              key={card.note_id}
              className="flex flex-col items-center rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-3 min-w-[60px] cursor-default hover:border-zinc-500 transition-colors shrink-0"
              onMouseEnter={() => setHovered(card)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="text-2xl leading-none select-none">{card.character}</span>
              <span className="text-xs text-zinc-400 mt-2 tabular-nums">{card.reps}×</span>
              {ease != null && (
                <span className={`text-[10px] tabular-nums ${ease < 200 ? "text-amber-400" : "text-zinc-500"}`}>
                  {ease}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      {hovered && (
        <div
          className="fixed z-50"
          style={{
            left: pos.x + 18,
            top: pos.y - 12,
            ...(pos.x > (typeof window !== "undefined" ? window.innerWidth - 240 : 9999)
              ? { left: "auto", right: typeof window !== "undefined" ? window.innerWidth - pos.x + 18 : 18 }
              : {}),
          }}
        >
          <Tooltip card={hovered} />
        </div>
      )}
    </div>
  );
}
