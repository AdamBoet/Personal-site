"use client";

import { useState, useCallback } from "react";
import { tileClass, Tooltip, type HanziCard } from "./CharacterGrid";

export type ScoredCard = HanziCard & { score: number };

export default function HardCardsRow({
  cards,
  scoreMap,
}: {
  cards: ScoredCard[];
  scoreMap: Map<number, number>;
}) {
  const [hovered, setHovered] = useState<ScoredCard | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div onMouseMove={handleMouseMove}>
      <div className="flex gap-1.5 flex-wrap">
        {cards.map((card) => (
          <div
            key={card.note_id}
            className={tileClass(scoreMap.get(card.note_id))}
            style={{ width: 52 }}
            onMouseEnter={() => setHovered(card)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="text-xl leading-none select-none">{card.character}</span>
            <span className="text-[10px] text-zinc-500 mt-1 tabular-nums">{card.rank}</span>
          </div>
        ))}
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
