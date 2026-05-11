import { create } from "zustand";
import {
  BUILDING_BY_ID,
  emptyBuildingCounts,
  nextPurchaseCost,
  totalPlushiesPerSecond,
  type BuildingCounts,
  type BuildingId,
} from "../data/buildings";
import { TICKS_PER_SECOND } from "../data/gameConstants";
import type { SavePayload } from "../utils/saveGame";

export type GameStore = {
  plushies: number;
  clickValue: number;
  buildingsOwned: BuildingCounts;
  /** Fractional plushies from passive income (applied on tick as whole units). */
  passiveAcc: number;
  /** Total manual clicks on the plushie (for stats / future achievements). */
  totalClicks: number;
  /** Prestige currency — Phase 7; kept in save for layout continuity. */
  stuffing: number;
  /** Active session playtime (advances with game tick while app is open). */
  playtimeSeconds: number;
  /**
   * Bumps on each manual plushie click so the 3D layer can spawn drops without
   * coupling callbacks through the React tree (not persisted).
   */
  plushieTapNonce: number;
  hasHydrated: boolean;
  incrementPlushies: () => void;
  buyBuilding: (id: BuildingId) => void;
  tick: () => void;
  hydrateFromSave: (payload: SavePayload | null) => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  plushies: 0,
  clickValue: 1,
  buildingsOwned: emptyBuildingCounts(),
  passiveAcc: 0,
  totalClicks: 0,
  stuffing: 0,
  playtimeSeconds: 0,
  plushieTapNonce: 0,
  hasHydrated: false,

  incrementPlushies: () => {
    const { clickValue } = get();
    set((s) => ({
      plushies: s.plushies + clickValue,
      totalClicks: s.totalClicks + 1,
      plushieTapNonce: s.plushieTapNonce + 1,
    }));
  },

  buyBuilding: (id) => {
    const def = BUILDING_BY_ID[id];
    const state = get();
    const owned = state.buildingsOwned[id] ?? 0;
    const cost = nextPurchaseCost(def.baseCost, owned);
    if (state.plushies < cost) return;
    set({
      plushies: state.plushies - cost,
      buildingsOwned: { ...state.buildingsOwned, [id]: owned + 1 },
    });
  },

  tick: () => {
    set((s) => {
      const dt = 1 / TICKS_PER_SECOND;
      const playtimeSeconds = s.playtimeSeconds + dt;
      const perSec = totalPlushiesPerSecond(s.buildingsOwned);
      if (perSec <= 0) {
        return { playtimeSeconds };
      }
      const perTick = perSec / TICKS_PER_SECOND;
      const newAcc = s.passiveAcc + perTick;
      const whole = Math.floor(newAcc);
      const frac = newAcc - whole;
      if (whole === 0) {
        return { passiveAcc: frac, playtimeSeconds };
      }
      return {
        plushies: s.plushies + whole,
        passiveAcc: frac,
        playtimeSeconds,
      };
    });
  },

  hydrateFromSave: (payload) => {
    if (payload) {
      set({
        plushies: payload.plushies,
        clickValue: payload.clickValue,
        buildingsOwned: payload.buildingsOwned,
        passiveAcc: payload.passiveAcc,
        totalClicks: payload.totalClicks,
        stuffing: payload.stuffing,
        playtimeSeconds: payload.playtimeSeconds,
        hasHydrated: true,
      });
    } else {
      set({ hasHydrated: true });
    }
  },
}));
