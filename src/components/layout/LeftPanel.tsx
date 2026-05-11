import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { totalPlushiesPerSecond } from "../../data/buildings";
import { useGameStore } from "../../stores/gameStore";
import { formatBigNumber, formatRate } from "../../utils/formatNumber";
import { formatPlaytime } from "../../utils/formatPlaytime";

const ACHIEVEMENTS_TRACKED = 12;

type TabId = "stats" | "upgrades";

function StatCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-surface-hover/60 px-3 py-3 shadow-inner ring-1 ring-white/[0.03]">
      <div className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-silver-muted">
        {label}
      </div>
      <div className="mt-1.5 font-numbers text-lg leading-none text-silver-bright sm:text-xl">
        {value}
      </div>
    </div>
  );
}

export function LeftPanel() {
  const [tab, setTab] = useState<TabId>("stats");
  const clickValue = useGameStore((s) => s.clickValue);
  const buildingsOwned = useGameStore((s) => s.buildingsOwned);
  const playtimeSeconds = useGameStore((s) => s.playtimeSeconds);
  const totalClicks = useGameStore((s) => s.totalClicks);
  const achievementsUnlocked = totalClicks >= 1 ? 1 : 0;

  const perSec = totalPlushiesPerSecond(buildingsOwned);

  return (
    <aside className="flex h-full min-h-0 w-full min-w-0 flex-col lg:max-w-[300px] xl:max-w-[320px]">
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-card/50 shadow-panel ring-1 ring-royal/10 backdrop-blur-sm">
        <div className="bg-royal px-4 py-2.5 text-center font-display text-sm font-bold uppercase tracking-[0.2em] text-silver-bright shadow-royal/20">
          My Factory
        </div>

        <div className="flex border-b border-white/[0.06] bg-surface-raised/80">
          <button
            type="button"
            onClick={() => setTab("stats")}
            className={`relative flex-1 py-2.5 text-center font-display text-xs font-bold uppercase tracking-[0.18em] transition ${
              tab === "stats"
                ? "text-silver-bright"
                : "text-silver-muted hover:text-silver"
            }`}
          >
            Stats
            {tab === "stats" ? (
              <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-royal-bright" />
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setTab("upgrades")}
            className={`relative flex-1 py-2.5 text-center font-display text-xs font-bold uppercase tracking-[0.18em] transition ${
              tab === "upgrades"
                ? "text-silver-bright"
                : "text-silver-muted hover:text-silver"
            }`}
          >
            Upgrades
            {tab === "upgrades" ? (
              <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-royal-bright" />
            ) : null}
          </button>
        </div>

        <div className="p-3 sm:p-4">
          {tab === "stats" ? (
            <div className="grid grid-cols-2 gap-2.5">
              <StatCell label="Per second" value={`${formatRate(perSec)}/s`} />
              <StatCell
                label="Click power"
                value={formatBigNumber(clickValue)}
              />
              <StatCell label="Passive boost" value="×1" />
              <StatCell label="Click boost" value="×1" />
              <StatCell
                label="Achievements"
                value={`${achievementsUnlocked}/${ACHIEVEMENTS_TRACKED}`}
              />
              <StatCell
                label="Playtime"
                value={formatPlaytime(playtimeSeconds)}
              />
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-royal/25 bg-surface-hover/40 px-4 py-8 text-center font-body text-sm text-silver-muted">
              Upgrades shop arrives in a later phase.
            </p>
          )}

          <div className="mt-4 rounded-2xl border border-white/[0.06] bg-surface-hover/50 p-3 ring-1 ring-royal/10">
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-royal/20 text-royal-glow ring-1 ring-royal/30">
                <span className="font-numbers text-lg">★</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-sm font-bold text-silver-bright">
                  First Stitch
                </div>
                <p className="mt-1 font-body text-xs leading-relaxed text-silver-muted">
                  Click the plushie once. More achievements will track your
                  factory milestones.
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-raised">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-royal to-royal-glow transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        (achievementsUnlocked / ACHIEVEMENTS_TRACKED) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                className="rounded-lg p-1 text-silver-muted hover:bg-white/5 hover:text-silver-bright"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-royal-bright" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
              </div>
              <button
                type="button"
                className="rounded-lg p-1 text-silver-muted hover:bg-white/5 hover:text-silver-bright"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
