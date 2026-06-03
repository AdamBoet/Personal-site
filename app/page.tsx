import stats from "@/data/anki-stats.json";
import Link from "next/link";

const YEARLY_GOAL = 1500;

export default function Overview() {
  const { learnedCount, year, dayOfYear, daysInYear } = stats;
  const goalPct = Math.round(Math.min(learnedCount / YEARLY_GOAL, 1) * 100);
  const yearPct = Math.round((dayOfYear / daysInYear) * 100);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-zinc-500">{year}</p>
      </div>

      <Link
        href="/hanzi"
        className="group block rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-lg">字</span>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">汉字 Hanzi</span>
          </div>
          <span className="text-xs text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">View →</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-end gap-1">
            <span className="text-5xl font-bold tabular-nums">{learnedCount.toLocaleString()}</span>
            <span className="pb-0.5 text-zinc-400 dark:text-zinc-500 text-xs">/ {YEARLY_GOAL.toLocaleString()}</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 bg-red-500/60" style={{ width: `${yearPct}%`, backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.15) 5px, rgba(255,255,255,0.15) 10px)" }} />
              <div className="absolute inset-y-0 left-0 bg-green-500" style={{ width: `${goalPct}%`, backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.15) 5px, rgba(255,255,255,0.15) 10px)" }} />
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-green-600 dark:text-green-500 font-medium">{goalPct}%</span>
              <span className="text-red-600 dark:text-red-400 font-medium">{yearPct}% year</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
