import { useEffect } from "react";
import { useGameStore } from "../stores/gameStore";
import { loadGame } from "../utils/saveGame";

/**
 * Loads save from IndexedDB once on mount and merges into the game store.
 */
export function useHydrateGame(): void {
  const hydrateFromSave = useGameStore((s) => s.hydrateFromSave);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const data = await loadGame();
      if (cancelled) return;
      hydrateFromSave(data);
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrateFromSave]);
}
