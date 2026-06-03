import stats from "@/data/anki-stats.json";
import hanziCards from "@/data/hanzi-cards.json";
import CharacterGrid, { type HanziCard } from "./CharacterGrid";
import HardCardsRow from "./HardCardsRow";
import FormulaInfo from "./FormulaInfo";

const YEARLY_GOAL = 1500;
const CARDS_PER_DAY = 5;

export default function HanziPage() {
  const { learnedCount, updatedAt, year, dayOfYear, daysInYear } = stats;

  const goalPct = Math.round(Math.min(learnedCount / YEARLY_GOAL, 1) * 100);
  const remaining = Math.max(YEARLY_GOAL - learnedCount, 0);
  const yearPct = Math.round((dayOfYear / daysInYear) * 100);
  const paceDelta = goalPct - yearPct;

  const expectedByNow = dayOfYear * CARDS_PER_DAY;
  const cardDelta = learnedCount - expectedByNow;
  const daysDelta = Math.round(Math.abs(cardDelta) / CARDS_PER_DAY);

  const daysLeftInYear = daysInYear - dayOfYear;
  const daysNeeded = Math.ceil(remaining / CARDS_PER_DAY);
  const daysCanSkip = Math.max(0, daysLeftInYear - daysNeeded);

  const updatedStr = new Date(updatedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const cards = hanziCards as HanziCard[];

  // Difficulty score — three relative components:
  //   lapse_rate     = lapses / reps          (how often you forget, relative to reviews)
  //   lapse_absolute = lapses / maxLapses     (absolute forgetting count, normalized)
  //   interval_diff  = 1 - min(interval,90)/90  (short interval = keeps coming back = hard)
  const maxLapses = Math.max(
    ...cards.filter((c) => c.lapses != null).map((c) => c.lapses!),
    1
  );

  const scoredCards = cards
    .filter((c) => (c.reps ?? 0) > 0 && c.interval != null && c.lapses != null)
    .map((c) => {
      const lapseRate = c.lapses! / Math.max(c.reps!, 1);
      const lapseAbsolute = c.lapses! / maxLapses;
      const intervalDiff = 1 - Math.min(c.interval!, 90) / 90;
      const raw = lapseRate * 0.45 + lapseAbsolute * 0.20 + intervalDiff * 0.35;
      return { ...c, raw };
    })
    .sort((a, b) => a.raw - b.raw);

  const scoreMap = new Map<number, number>();
  scoredCards.forEach((c, i) => {
    scoreMap.set(c.note_id, scoredCards.length > 1 ? i / (scoredCards.length - 1) : 0.5);
  });

  const hardCards = [...scoredCards]
    .reverse()
    .slice(0, 10)
    .map((c) => ({ ...c, score: c.raw }));

  const hasScores = scoreMap.size > 0;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">汉字 Hanzi</h1>
        <p className="mt-1 text-sm text-zinc-500">Character progress · {year}</p>
      </div>

      {/* Row 1: Words learned · Yearly pace · Skip budget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Words learned */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
          <div className="flex items-end gap-3">
            <span className="text-5xl sm:text-6xl font-bold tabular-nums">{learnedCount.toLocaleString()}</span>
            <span className="pb-2 text-zinc-400 text-sm">/ {YEARLY_GOAL.toLocaleString()}</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full rounded-full bg-green-500" style={{ width: `${goalPct}%` }} />
            </div>
            <div className="flex justify-end text-xs text-zinc-500">
              <span>{remaining.toLocaleString()} to go</span>
            </div>
          </div>
        </div>

        {/* Yearly pace: goal% vs year% */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Yearly pace</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-semibold tabular-nums">{goalPct}%</p>
              <p className="text-xs text-zinc-500 mt-0.5">goal reached</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{yearPct}%</p>
              <p className="text-xs text-zinc-500 mt-0.5">year passed</p>
            </div>
          </div>
          <p className={`text-xs font-semibold ${paceDelta >= 0 ? "text-green-400" : "text-red-400"}`}>
            {paceDelta >= 0 ? "+" : ""}{paceDelta}% vs year passed
          </p>
        </div>

        {/* Skip budget */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Skip budget</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={`text-2xl font-semibold tabular-nums ${cardDelta < 0 ? "text-red-400" : "text-zinc-100"}`}>
                {daysDelta}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">days skipped</p>
            </div>
            <div>
              <p className={`text-2xl font-semibold tabular-nums ${daysCanSkip > 0 ? "text-zinc-100" : "text-red-400"}`}>
                {daysCanSkip}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">can still skip</p>
            </div>
          </div>
          <p className="text-xs text-zinc-600">
            {daysNeeded}d needed · {daysLeftInYear}d left in year
          </p>
        </div>

      </div>

      {/* Hardest cards */}
      {hardCards.length > 0 && (
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-zinc-400">Hardest to remember</h2>
            <p className="text-xs text-zinc-600 mt-0.5">High lapse rate + short interval — the ones you keep forgetting</p>
          </div>
          <HardCardsRow cards={hardCards} scoreMap={scoreMap} />
        </div>
      )}

      {/* Character grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-semibold text-zinc-400">All {learnedCount} characters</h2>
          {hasScores && (
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950 border border-emerald-700/50 inline-block" />
                Easy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-950 border border-amber-700/50 inline-block" />
                Harder
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-red-950 border border-red-700/60 inline-block" />
                Hardest
              </span>
              <FormulaInfo />
            </div>
          )}
        </div>
        <CharacterGrid cards={cards} scoreMap={hasScores ? scoreMap : undefined} />
      </div>

      <p className="text-xs text-zinc-600">Updated {updatedStr}</p>
    </div>
  );
}
