"use client";

import { useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { tileClass, tileStyle, Tooltip, type HanziCard } from "./CharacterGrid";

export type ScoredCard = HanziCard & { score: number };

export default function HardCardsRow({
  cards,
  scoreMap,
}: {
  cards: ScoredCard[];
  scoreMap: Map<number, number>;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [hovered, setHovered] = useState<ScoredCard | null>(null);
  const [pinned, setPinned] = useState<ScoredCard | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [pinnedPos, setPinnedPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setHoverPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleTileClick = useCallback((e: React.MouseEvent<HTMLDivElement>, card: ScoredCard) => {
    e.stopPropagation();
    if (pinned?.note_id === card.note_id) { setPinned(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setPinnedPos({ x: rect.left + rect.width / 2, y: rect.top });
    setPinned(card);
  }, [pinned]);

  const showPinnedOverlay = !hovered && !!pinned;

  return (
    <div onMouseMove={handleMouseMove} onClick={() => setPinned(null)}>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}
      >
        {cards.map((card) => (
          <div
            key={card.note_id}
            className={tileClass()}
            style={tileStyle(scoreMap.get(card.note_id), isDark)}
            onMouseEnter={() => setHovered(card)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => handleTileClick(e, card)}
          >
            <span className="text-xl leading-none select-none">{card.character}</span>
            <span className="text-[10px] text-zinc-500 mt-1 tabular-nums">{card.rank}</span>
          </div>
        ))}
      </div>

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
          <Tooltip card={hovered} percentile={scoreMap.get(hovered.note_id)} />
        </div>
      )}

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
            <Tooltip card={pinned} percentile={scoreMap.get(pinned.note_id)} />
          </div>
        </>
      )}
    </div>
  );
}
