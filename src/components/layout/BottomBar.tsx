import { useState } from "react";
import { Zap } from "lucide-react";

const TICKER_TEXT =
  "Tip: Buy your first Hand Stitcher to start passive income. Golden plushies and prestige stuffing will arrive in later updates.";

export function BottomBar() {
  const [muted, setMuted] = useState(false);

  return (
    <footer className="border-t border-white/[0.08] bg-surface-raised/95 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
        <div className="flex shrink-0 items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.14em] text-silver-muted">
          <Zap className="h-4 w-4 text-royal-glow" aria-hidden />
          Active boosts
          <span className="rounded-lg border border-white/[0.06] bg-surface-card px-2 py-1 font-numbers normal-case tracking-normal text-silver-dim">
            None
          </span>
        </div>

        <div className="relative min-h-[1.5rem] flex-1 overflow-hidden rounded-xl border border-white/[0.06] bg-surface-card/60 py-1.5 pl-3 pr-3 ring-1 ring-royal/5">
          <div className="overflow-hidden">
            <div className="inline-flex w-max animate-marquee whitespace-nowrap font-body text-sm text-silver">
              <span className="inline-block pr-16 text-silver-muted">
                {TICKER_TEXT}
              </span>
              <span className="inline-block pr-16 text-silver-muted">
                {TICKER_TEXT}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-silver-muted">
            Mute
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={muted}
            onClick={() => setMuted((m) => !m)}
            className={`relative h-7 w-12 rounded-full border transition ${
              muted
                ? "border-silver-dim bg-surface-hover"
                : "border-royal/40 bg-royal/30"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-silver-bright shadow transition-all ${
                muted ? "left-0.5" : "left-6"
              }`}
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
