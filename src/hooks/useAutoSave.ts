import { useEffect } from "react";
import { useGameStore } from "../stores/gameStore";
import { saveGame } from "../utils/saveGame";

const INTERVAL_MS = 30_000;

/**
 * Persists game state to IndexedDB every 30 seconds.
 * Only runs after hydration so a slow load cannot be overwritten by default state.
 */
export function useAutoSave(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      const s = useGameStore.getState();
      void saveGame({
        plushies: s.plushies,
        clickValue: s.clickValue,
        buildingsOwned: s.buildingsOwned,
        passiveAcc: s.passiveAcc,
        totalClicks: s.totalClicks,
        stuffing: s.stuffing,
        playtimeSeconds: s.playtimeSeconds,
      });
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [enabled]);
}
