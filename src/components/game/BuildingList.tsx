import { BUILDINGS } from "../../data/buildings";
import { BuildingRow } from "./BuildingRow";

export function BuildingList() {
  return (
    <aside className="flex h-full min-h-0 w-full min-w-0 flex-col lg:max-w-[360px] xl:max-w-[380px]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-card/50 shadow-panel ring-1 ring-royal/10 backdrop-blur-sm">
        <div className="bg-royal px-4 py-2.5 shadow-royal/20">
          <h2 className="text-center font-display text-sm font-bold uppercase tracking-[0.2em] text-silver-bright">
            Buildings
          </h2>
          <p className="mt-1 text-center font-body text-[0.65rem] text-silver-muted/90">
            Buy ×1 / ×10 / Max — multi-buy coming later
          </p>
        </div>

        <div className="thin-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3 sm:p-4">
          {BUILDINGS.map((b) => (
            <BuildingRow key={b.id} id={b.id} />
          ))}
        </div>
      </div>
    </aside>
  );
}
