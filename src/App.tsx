import { useGameStore } from "./stores/gameStore";
import { TopBar } from "./components/layout/TopBar";
import { BottomBar } from "./components/layout/BottomBar";
import { LeftPanel } from "./components/layout/LeftPanel";
import { CenterStage } from "./components/game/CenterStage";
import { BuildingList } from "./components/game/BuildingList";
import { useHydrateGame } from "./hooks/useHydrateGame";
import { useAutoSave } from "./hooks/useAutoSave";
import { useGameTick } from "./hooks/useGameTick";

export function App() {
  const hasHydrated = useGameStore((s) => s.hasHydrated);

  useHydrateGame();
  useAutoSave(hasHydrated);
  useGameTick(hasHydrated);

  if (!hasHydrated) {
    return (
      <div className="flex h-full items-center justify-center font-body text-lg text-silver-muted">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <TopBar />

      <div className="mx-auto flex w-full max-w-[1600px] min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-5 lg:flex-row lg:gap-5">
        <div className="order-2 flex min-h-0 lg:order-1 lg:h-full lg:w-[300px] lg:shrink-0 xl:w-[320px]">
          <LeftPanel />
        </div>

        <div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col lg:order-2 lg:h-full">
          <CenterStage />
        </div>

        <div className="order-3 flex min-h-0 lg:h-full lg:w-[360px] lg:shrink-0 xl:w-[380px]">
          <BuildingList />
        </div>
      </div>

      <BottomBar />
    </div>
  );
}
