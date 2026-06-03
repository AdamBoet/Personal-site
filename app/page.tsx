import stats from "@/data/anki-stats.json";
import Link from "next/link";

const YEARLY_GOAL = 1500;

export default function Overview() {
  const { learnedCount, year } = stats;
  const pct = Math.round(Math.min(learnedCount / YEARLY_GOAL, 1) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-zinc-500">{year}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Link href="/hanzi" className="group block rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">字</span>
              <span className="text-sm font-medium text-zinc-300">汉字 Hanzi</span>
            </div>
            <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">View →</span>
          </div>
          <p className="text-4xl font-bold tabular-nums">{learnedCount.toLocaleString()}</p>
          <p className="text-xs text-zinc-500 mt-1">of {YEARLY_GOAL.toLocaleString()} goal · {pct}%</p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full bg-red-500" style={{ width: `${pct}%` }} />
          </div>
        </Link>
      </div>
    </div>
  );
}
