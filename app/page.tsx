import stats from "@/data/anki-stats.json";

const YEARLY_GOAL = 1000;

export default function Dashboard() {
  const { learnedCount, updatedAt, year } = stats;
  const progress = Math.min(learnedCount / YEARLY_GOAL, 1);
  const remaining = Math.max(YEARLY_GOAL - learnedCount, 0);
  const pct = Math.round(progress * 100);

  const updated = new Date(updatedAt);
  const updatedStr = updated.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
            Adam's Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Personal life stats</p>
        </div>

        {/* Hanzi card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">汉字</span>
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">
                Hanzi Progress
              </h2>
              <p className="text-xs text-zinc-500">{year} · goal {YEARLY_GOAL.toLocaleString()} characters</p>
            </div>
          </div>

          {/* Big number */}
          <div className="flex items-end gap-3">
            <span className="text-6xl font-bold tabular-nums text-zinc-100">
              {learnedCount.toLocaleString()}
            </span>
            <span className="pb-2 text-zinc-400 text-sm">
              / {YEARLY_GOAL.toLocaleString()} learned
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{pct}% complete</span>
              <span>{remaining.toLocaleString()} to go</span>
            </div>
          </div>

          <p className="text-xs text-zinc-600">Updated {updatedStr}</p>
        </div>
      </div>
    </main>
  );
}
