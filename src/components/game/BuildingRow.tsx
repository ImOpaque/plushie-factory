import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  BUILDING_BY_ID,
  nextPurchaseCost,
  type BuildingId,
} from "../../data/buildings";
import { useGameStore } from "../../stores/gameStore";
import { formatBigNumber, formatRate } from "../../utils/formatNumber";

type BuildingRowProps = {
  id: BuildingId;
};

export const BuildingRow = memo(function BuildingRow({ id }: BuildingRowProps) {
  const def = BUILDING_BY_ID[id];
  const Icon = def.icon;
  const { plushies, owned, buyBuilding } = useGameStore(
    useShallow((s) => ({
      plushies: s.plushies,
      owned: s.buildingsOwned[id],
      buyBuilding: s.buyBuilding,
    }))
  );
  const cost = nextPurchaseCost(def.baseCost, owned);
  const canAfford = plushies >= cost;
  const pPerSec = owned * def.plushiesPerSecond;

  return (
    <div className="flex items-stretch gap-3 rounded-2xl border border-white/[0.06] bg-surface-hover/50 px-3 py-3 shadow-inner ring-1 ring-white/[0.03]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center self-center rounded-2xl bg-royal/18 text-royal-glow ring-1 ring-royal/30">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-display text-sm font-bold leading-tight text-silver-bright sm:text-base">
          {def.name}
        </div>
        <div className="mt-1.5 font-body text-[0.7rem] leading-snug text-silver-muted sm:text-xs">
          <span className="font-numbers text-silver">
            {formatBigNumber(cost)}
          </span>
          <span className="text-silver-dim"> · </span>
          <span>{owned} owned</span>
          <span className="text-silver-dim"> · </span>
          <span className="text-royal-bright/90">
            +{formatRate(pPerSec)}/s
          </span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-stretch justify-center gap-1">
        <button
          type="button"
          disabled={!canAfford}
          onClick={() => buyBuilding(id)}
          className="min-w-[4.25rem] rounded-xl bg-royal px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.12em] text-silver-bright shadow-royal transition enabled:hover:bg-royal-bright enabled:hover:shadow-[0_0_20px_rgba(74,110,247,0.5)] enabled:active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-35"
        >
          Buy
        </button>
      </div>
    </div>
  );
});
