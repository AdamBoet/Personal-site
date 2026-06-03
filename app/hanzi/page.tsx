import stats from "@/data/anki-stats.json";
import hanziCards from "@/data/hanzi-cards.json";
import CharacterGrid, { type HanziCard } from "./CharacterGrid";

const YEARLY_GOAL = 1000;

export default function HanziPage() {
  const { learnedCount, updatedAt, year, dayOfYear, daysInYear } = stats;

  const progress = Math.min(learnedCount / YEARLY_GOAL, 1);
  const pct = Math.round(progress * 100);
  const remaining = Math.max(YEARLY_GOAL - learnedCount, 0);

  const yearProgress = dayOfYear / daysInYear;
  const onTrack = progress >= yearProgress;
  const expectedByNow = Math.round(YEARLY_GOAL * yearProgress);
  const delta = learnedCount - expectedByNow;

  const updatedStr = new Date(updatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const cards = hanziCards as HanziCard[];

  // Legend counts
  const mature = cards.filter((c) => c.queue === 2 && (c.interval ?? 0) >= 21).length;
  const young = cards.filter((c) => c.queue === 2 && (c.interval ?? 0) < 21).length;
  const learning = cards.filter((c) => c.queue === 1).length;
  const noData = cards.filter((c) => c.queue === undefined).length;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">汉字 Hanzi</h1>
        <p className="mt-1 text-sm text-zinc-500">Character progress · {year}</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Main progress */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
          <div className="flex items-end gap-3">
            <span className="text-6xl font-bold tabular-nums">{learnedCount.toLocaleString()}</span>
            <span className="pb-2 text-zinc-400 text-sm">/ {YEARLY_GOAL.toLocaleString()}</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{pct}% of yearly goal</span>
              <span>{remaining.toLocaleString()} to go</span>
            </div>
          </div>
        </div>

        {/* Pace */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Pace</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-semibold tabular-nums">{expectedByNow.toLocaleString()}</p>
              <p className="text-xs text-zinc-500 mt-0.5">expected by today</p>
            </div>
            <div>
              <p
                className={`text-2xl font-semibold tabular-nums ${
                  delta >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {delta >= 0 ? "+" : ""}
                {delta.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {onTrack ? "ahead of pace" : "behind pace"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Character grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-400">All {learnedCount} characters</h2>
          {noData === 0 && (
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-900 border border-emerald-500/60 inline-block" />
                Mature ({mature})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-900 border border-amber-600/50 inline-block" />
                Young ({young})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-950 border border-blue-700/50 inline-block" />
                Learning ({learning})
              </span>
            </div>
          )}
        </div>

        <CharacterGrid cards={cards} />
      </div>

      <p className="text-xs text-zinc-600">Updated {updatedStr}</p>
    </div>
  );
}
