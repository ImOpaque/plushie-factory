import { useEffect } from "react";
import { TICK_INTERVAL_MS } from "../data/gameConstants";
import { useGameStore } from "../stores/gameStore";

/**
 * Runs the incremental game tick at TICKS_PER_SECOND (see gameConstants).
 */
export function useGameTick(enabled: boolean): void {
  const tick = useGameStore((s) => s.tick);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      tick();
    }, TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [enabled, tick]);
}
