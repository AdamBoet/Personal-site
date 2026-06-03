import stats from "@/data/anki-stats.json";
import hanziCards from "@/data/hanzi-cards.json";
import CharacterGrid, { LegendSwatches, type HanziCard } from "./CharacterGrid";
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

  const totalSkipBudget = daysInYear - Math.ceil(YEARLY_GOAL / CARDS_PER_DAY);
  const daysLeftInYear = daysInYear - dayOfYear;
  const daysNeeded = Math.ceil(remaining / CARDS_PER_DAY);
  const daysCanSkip = Math.max(0, daysLeftInYear - daysNeeded);
  const daysToCatchup = Math.max(0, Math.ceil(
    (YEARLY_GOAL * dayOfYear - daysInYear * learnedCount) /
    (CARDS_PER_DAY * daysInYear - YEARLY_GOAL)
  ));


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
    .slice(0, 15)
    .map((c) => ({ ...c, score: c.raw }));

  const now = Date.now();
  const comingDueCards = [...scoredCards]
    .reverse()
    .filter((c) => {
      if (!c.mod || !c.interval) return false;
      const diffDays = Math.floor(((c.mod + c.interval * 86400) * 1000 - now) / 86400000);
      return diffDays >= 0 && diffDays <= 3;
    })
    .slice(0, 15)
    .map((c) => ({ ...c, score: c.raw }));

  const hasScores = scoreMap.size > 0;

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Anki 汉字 Character Progress</h1>
        <p className="mt-1 text-sm text-zinc-500">{year} · Updated {updatedStr}</p>
      </div>

      {/* Combined progress + skip budget */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">

          {/* Progress */}
          <div className="flex-1 space-y-4 text-center">
            <div className="flex items-end justify-center gap-1">
              <span className="text-4xl sm:text-5xl font-bold tabular-nums">{learnedCount.toLocaleString()}</span>
              <span className="pb-0.5 text-zinc-400 dark:text-zinc-500 text-xs">/ {YEARLY_GOAL.toLocaleString()}</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 bg-red-500/60" style={{ width: `${yearPct}%`, backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.15) 5px, rgba(255,255,255,0.15) 10px)" }} />
                <div className="absolute inset-y-0 left-0 bg-green-500" style={{ width: `${goalPct}%`, backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.15) 5px, rgba(255,255,255,0.15) 10px)" }} />
              </div>
              <div className="flex items-center justify-center gap-3 text-xs">
                <span className="text-green-600 dark:text-green-500 font-medium">{goalPct}%</span>
                <span className="text-red-600 dark:text-red-400 font-medium">{yearPct}% year</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch bg-zinc-100 dark:bg-zinc-800" />
          <div className="block sm:hidden h-px w-full bg-zinc-100 dark:bg-zinc-800" />

          {/* Skip budget */}
          <div className="flex flex-col items-center sm:items-start justify-center gap-2 text-sm sm:min-w-52 text-center sm:text-left">
            <p>
              <span className={`font-bold ${cardDelta < 0 ? "text-red-500" : ""}`}>{daysDelta} days</span>
              {" skipped"}
            </p>
            <p className="text-zinc-500 dark:text-zinc-400">
              {"skip no more than "}
              <span className={`font-bold ${daysCanSkip <= 0 ? "text-red-500" : "text-zinc-700 dark:text-zinc-200"}`}>{daysCanSkip} days</span>
            </p>
            <p className="text-zinc-500 dark:text-zinc-400">
              {daysToCatchup > 0 ? (
                <>
                  {"stay consistent for "}
                  <span className="font-bold text-amber-500">{daysToCatchup} days</span>
                  {" to catch up"}
                </>
              ) : (
                <>you&apos;re on pace</>
              )}
            </p>
          </div>

        </div>

      </div>

      {/* Hardest cards */}
      {hardCards.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Hardest to remember</h2>
          <HardCardsRow cards={hardCards} scoreMap={scoreMap} />
        </div>
      )}


      {/* Character grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">All {learnedCount} characters</h2>
          {hasScores && (
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <LegendSwatches />
              <FormulaInfo />
            </div>
          )}
        </div>
        <CharacterGrid cards={cards} scoreMap={hasScores ? scoreMap : undefined} />
      </div>

      <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center">Updated {updatedStr}</p>
    </div>
  );
}
