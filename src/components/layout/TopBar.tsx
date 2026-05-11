import type { ReactNode } from "react";
import {
  Cloud,
  Library,
  PawPrint,
  Settings,
  Sparkles,
  Volume2,
} from "lucide-react";
import { totalPlushiesPerSecond } from "../../data/buildings";
import { useGameStore } from "../../stores/gameStore";
import { formatBigNumber } from "../../utils/formatNumber";

function NavIconButton({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-surface-card/80 text-silver-muted transition hover:border-royal/40 hover:bg-royal/15 hover:text-silver-bright"
    >
      {children}
    </button>
  );
}

export function TopBar() {
  const plushies = useGameStore((s) => s.plushies);
  const stuffing = useGameStore((s) => s.stuffing);
  const buildingsOwned = useGameStore((s) => s.buildingsOwned);
  const rate = totalPlushiesPerSecond(buildingsOwned);

  return (
    <header className="border-b border-white/[0.08] bg-surface-raised/95 shadow-panel backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-4 py-3.5 sm:px-6 lg:grid lg:grid-cols-3 lg:items-center lg:gap-6">
        <div className="flex min-w-0 items-center gap-2.5 justify-self-start">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-royal/25 text-royal-glow ring-1 ring-royal/35">
            <PawPrint className="h-6 w-6" aria-hidden />
          </div>
          <span className="font-display text-lg font-bold uppercase tracking-[0.12em] text-silver-bright sm:text-xl">
            Plushie Factory
          </span>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-center">
          <div className="flex min-w-[10rem] items-center gap-3 rounded-2xl border border-white/[0.08] bg-surface-card/90 px-5 py-3 shadow-panel ring-1 ring-royal/25">
            <Sparkles
              className="h-5 w-5 shrink-0 text-royal-glow"
              aria-hidden
            />
            <div className="min-w-0 text-left leading-tight">
              <div className="bg-gradient-to-br from-silver-bright via-silver to-silver-muted bg-clip-text font-numbers text-2xl tabular-nums text-transparent sm:text-3xl">
                {formatBigNumber(plushies)}
              </div>
              <div className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-silver-muted">
                Plushies
              </div>
              <div className="mt-0.5 font-body text-[0.65rem] text-royal-bright/90">
                +{formatBigNumber(rate)}/s passive
              </div>
            </div>
          </div>

          <div className="flex min-w-[10rem] items-center gap-3 rounded-2xl border border-white/[0.08] bg-surface-card/90 px-5 py-3 shadow-panel ring-1 ring-royal/20">
            <Cloud className="h-5 w-5 shrink-0 text-royal-glow/90" aria-hidden />
            <div className="min-w-0 text-left leading-tight">
              <div className="bg-gradient-to-br from-silver-bright via-silver to-silver-muted bg-clip-text font-numbers text-2xl tabular-nums text-transparent sm:text-3xl">
                {formatBigNumber(stuffing)}
              </div>
              <div className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-silver-muted">
                Stuffing
              </div>
              <div className="mt-0.5 font-body text-[0.65rem] text-silver-dim">
                Prestige (soon)
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-end gap-1.5 justify-self-end lg:w-auto">
          <NavIconButton label="Settings (soon)">
            <Settings className="h-5 w-5" />
          </NavIconButton>
          <NavIconButton label="Audio (soon)">
            <Volume2 className="h-5 w-5" />
          </NavIconButton>
          <NavIconButton label="Collection (soon)">
            <Library className="h-5 w-5" />
          </NavIconButton>
        </div>
      </div>
    </header>
  );
}
