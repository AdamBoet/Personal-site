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
    if (!pinned) setHoverPos({ x: e.clientX, y: e.clientY });
  }, [pinned]);

  const handleTileClick = useCallback((e: React.MouseEvent<HTMLDivElement>, card: ScoredCard) => {
    e.stopPropagation();
    if (pinned?.note_id === card.note_id) { setPinned(null); return; }
    setPinnedPos({ x: e.clientX, y: e.clientY });
    setPinned(card);
  }, [pinned]);

  const activeCard = pinned ?? hovered;
  const tooltipX = pinned ? pinnedPos.x : hoverPos.x;
  const tooltipY = pinned ? pinnedPos.y : hoverPos.y;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setHovered(null); setPinned(null); }}
      onClick={() => setPinned(null)}
    >
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}
      >
        {cards.map((card) => (
          <div
            key={card.note_id}
            className={tileClass()}
            style={tileStyle(scoreMap.get(card.note_id), isDark)}
            onMouseEnter={() => { if (!pinned) setHovered(card); }}
            onMouseLeave={() => { if (!pinned) setHovered(null); }}
            onClick={(e) => handleTileClick(e, card)}
          >
            <span className="text-xl leading-none select-none">{card.character}</span>
            <span className="text-[10px] text-zinc-500 mt-1 tabular-nums">{card.rank}</span>
          </div>
        ))}
      </div>

      {activeCard && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltipX + 18,
            top: tooltipY - 12,
            ...(tooltipX > (typeof window !== "undefined" ? window.innerWidth - 240 : 9999)
              ? { left: "auto", right: typeof window !== "undefined" ? window.innerWidth - tooltipX + 18 : 18 }
              : {}),
          }}
        >
          <Tooltip card={activeCard} percentile={scoreMap.get(activeCard.note_id)} />
        </div>
      )}
    </div>
  );
}
