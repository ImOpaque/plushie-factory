import { Sparkles } from "lucide-react";
import { useGameStore } from "../../stores/gameStore";
import { formatNumber } from "../../utils/formatNumber";
import { PlushieStage } from "./PlushieStage";

export function CenterStage() {
  const totalClicks = useGameStore((s) => s.totalClicks);

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-white/[0.1] bg-surface-card/35 p-2 shadow-[0_12px_48px_rgba(0,0,0,0.5)] ring-1 ring-royal/15 backdrop-blur-md sm:p-3">
        <div className="relative flex min-h-[min(52vh,480px)] flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-surface-hover/40 to-surface/80 ring-1 ring-inset ring-white/[0.04]">
          <PlushieStage />

          <div className="pointer-events-none absolute right-3 top-10 z-[2] flex items-center gap-1 rounded-full border border-amber-400/35 bg-amber-500/10 px-2.5 py-1 font-display text-[0.6rem] font-bold uppercase tracking-wider text-amber-100/90 shadow-panel ring-1 ring-amber-400/20 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-amber-300" aria-hidden />
            Golden
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-surface via-surface/90 to-transparent pb-4 pt-20">
            <div className="text-center">
              <div className="font-body text-[0.65rem] font-bold uppercase tracking-[0.28em] text-silver-muted">
                Click counter
              </div>
              <div className="mt-1 bg-gradient-to-br from-silver-bright to-silver bg-clip-text font-numbers text-3xl tabular-nums text-transparent drop-shadow-[0_0_20px_rgba(107,140,255,0.25)] sm:text-4xl">
                {formatNumber(totalClicks)} clicks
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
