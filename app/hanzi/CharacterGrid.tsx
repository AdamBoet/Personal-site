"use client";

import { useState, useCallback, useRef } from "react";

export interface HanziCard {
  character: string;
  rank: number;
  pronunciation: string;
  front: string;
  note_id: number;
  card_id?: number;
  interval?: number;
  reps?: number;
  lapses?: number;
  factor?: number;
  queue?: number;
  due?: number;
  type?: number;
  mod?: number | null;
}

// percentile 0 = easiest (green), 0.5 = yellow, 1 = hardest (red)
// hue: 120 (green) → 60 (yellow) → 0 (red)
export function tileClass(): string {
  return "flex flex-col items-center justify-center rounded-lg border cursor-default py-2.5 px-1 transition-transform hover:scale-125 hover:z-10";
}

export function tileStyle(percentile?: number): Record<string, string> {
  if (percentile === undefined) {
    return { backgroundColor: "hsl(0 0% 15% / 0.7)", borderColor: "hsl(0 0% 28% / 0.4)" };
  }
  const hue = Math.round(120 * (1 - percentile));
  return {
    backgroundColor: `hsl(${hue} 35% 12%)`,
    borderColor: `hsl(${hue} 30% 22%)`,
  };
}

function relativeTime(unixSeconds: number): string {
  const diffS = Date.now() / 1000 - unixSeconds;
  if (diffS < 3600) return "< 1 hr ago";
  if (diffS < 86400) return `${Math.floor(diffS / 3600)}h ago`;
  const d = Math.floor(diffS / 86400);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

function dueSoon(card: HanziCard): string | null {
  if (!card.mod || !card.interval) return null;
  const dueMs = (card.mod + card.interval * 86400) * 1000;
  const diffDays = Math.ceil((dueMs - Date.now()) / 86400000);
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due today";
  return `Due in ${diffDays}d`;
}

export function Tooltip({ card, percentile }: { card: HanziCard; percentile?: number }) {
  const due = dueSoon(card);

  const diffPct = percentile != null ? Math.round(percentile * 100) : null;
  const hue = percentile != null ? Math.round(120 * (1 - percentile)) : null;
  const diffLabel =
    percentile == null ? null
    : percentile < 0.25 ? "Easy"
    : percentile < 0.5  ? "Average"
    : percentile < 0.75 ? "Hard"
    : "Very hard";

  return (
    <div className="w-56 rounded-xl border border-zinc-700 bg-zinc-900/95 shadow-2xl p-3.5 space-y-3 backdrop-blur-sm text-sm pointer-events-none">
      <div className="flex items-start gap-3">
        <span className="text-4xl leading-none">{card.character}</span>
        <div className="min-w-0">
          <p className="text-xs text-zinc-400 leading-snug">{card.pronunciation}</p>
          <p className="text-xs text-zinc-300 leading-snug mt-0.5 line-clamp-2">{card.front}</p>
        </div>
      </div>

      {diffLabel && hue != null && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Difficulty</span>
            <span className="font-semibold" style={{ color: `hsl(${hue} 80% 60%)` }}>{diffLabel} · {diffPct}%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              style={{ width: `${diffPct}%`, backgroundColor: `hsl(${hue} 70% 50%)` }}
              className="h-full rounded-full"
            />
          </div>
        </div>
      )}

      {(card.interval != null || card.reps != null || card.lapses != null) && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          {card.interval != null && (
            <>
              <span className="text-zinc-500">Interval</span>
              <span className="text-zinc-200">{card.interval} days</span>
            </>
          )}
          {card.reps != null && (
            <>
              <span className="text-zinc-500">Reviews</span>
              <span className="text-zinc-200">{card.reps}×</span>
            </>
          )}
          {card.lapses != null && (
            <>
              <span className="text-zinc-500">Lapses</span>
              <span className={card.lapses > 0 ? "text-red-400" : "text-zinc-200"}>{card.lapses}</span>
            </>
          )}
          {due && (
            <>
              <span className="text-zinc-500">Next due</span>
              <span className={due === "Overdue" || due === "Due today" ? "text-amber-400" : "text-zinc-200"}>
                {due}
              </span>
            </>
          )}
        </div>
      )}

      <p className="text-[10px] text-zinc-600">#{card.rank} by frequency</p>
    </div>
  );
}

export default function CharacterGrid({
  cards,
  scoreMap,
}: {
  cards: HanziCard[];
  scoreMap?: Map<number, number>;
}) {
  const [hovered, setHovered] = useState<HanziCard | null>(null);
  const [pinned, setPinned] = useState<HanziCard | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [pinnedPos, setPinnedPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setHoverPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleTileClick = useCallback((e: React.MouseEvent<HTMLDivElement>, card: HanziCard) => {
    e.stopPropagation();
    if (pinned?.note_id === card.note_id) {
      setPinned(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setPinnedPos({ x: rect.left + rect.width / 2, y: rect.top });
    setPinned(card);
  }, [pinned]);

  const activeCard = hovered ?? pinned;
  const showPinnedOverlay = !hovered && !!pinned;

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} onClick={() => setPinned(null)}>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}
      >
        {cards.map((card) => (
          <div
            key={card.note_id}
            className={tileClass()}
            style={tileStyle(scoreMap?.get(card.note_id))}
            onMouseEnter={() => setHovered(card)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => handleTileClick(e, card)}
          >
            <span className="text-xl leading-none select-none">{card.character}</span>
            <span className="text-[10px] text-zinc-500 mt-1 tabular-nums">{card.rank}</span>
          </div>
        ))}
      </div>

      {/* Hover tooltip (desktop) */}
      {hovered && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: hoverPos.x + 18,
            top: hoverPos.y - 12,
            ...(hoverPos.x > (typeof window !== "undefined" ? window.innerWidth - 240 : 9999)
              ? { left: "auto", right: typeof window !== "undefined" ? window.innerWidth - hoverPos.x + 18 : 18 }
              : {}),
          }}
        >
          <Tooltip card={hovered} percentile={scoreMap?.get(hovered.note_id)} />
        </div>
      )}

      {/* Tap tooltip (mobile) */}
      {showPinnedOverlay && pinned && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPinned(null)} />
          <div
            className="fixed z-50"
            style={{
              left: pinnedPos.x,
              top: pinnedPos.y,
              transform: "translate(-50%, calc(-100% - 8px))",
            }}
          >
            <Tooltip card={pinned} percentile={scoreMap?.get(pinned.note_id)} />
          </div>
        </>
      )}
    </div>
  );
}
