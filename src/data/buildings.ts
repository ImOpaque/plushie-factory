import type { LucideIcon } from "lucide-react";
import {
  Box,
  Hand,
  Hammer,
  Scissors,
  Sparkles,
} from "lucide-react";

/**
 * Each additional unit costs baseCost * COST_SCALING^owned (Cookie Clicker style).
 */
export const COST_SCALING = 1.15;

export const BUILDING_IDS = [
  "hand_stitcher",
  "sewing_machine",
  "plushie_press",
  "stuffing_cannon",
  "toy_workshop",
] as const;

export type BuildingId = (typeof BUILDING_IDS)[number];

export type BuildingDef = {
  id: BuildingId;
  name: string;
  baseCost: number;
  /** Plushies produced per second per owned building. */
  plushiesPerSecond: number;
  icon: LucideIcon;
};

export const BUILDINGS: BuildingDef[] = [
  {
    id: "hand_stitcher",
    name: "Hand Stitcher",
    baseCost: 15,
    plushiesPerSecond: 0.1,
    icon: Hand,
  },
  {
    id: "sewing_machine",
    name: "Sewing Machine",
    baseCost: 100,
    plushiesPerSecond: 0.5,
    icon: Scissors,
  },
  {
    id: "plushie_press",
    name: "Plushie Press",
    baseCost: 500,
    plushiesPerSecond: 2,
    icon: Box,
  },
  {
    id: "stuffing_cannon",
    name: "Stuffing Cannon",
    baseCost: 3000,
    plushiesPerSecond: 10,
    icon: Sparkles,
  },
  {
    id: "toy_workshop",
    name: "Toy Workshop",
    baseCost: 12000,
    plushiesPerSecond: 40,
    icon: Hammer,
  },
];

export const BUILDING_BY_ID: Record<BuildingId, BuildingDef> = BUILDINGS.reduce(
  (acc, def) => {
    acc[def.id] = def;
    return acc;
  },
  {} as Record<BuildingId, BuildingDef>
);

export type BuildingCounts = Record<BuildingId, number>;

export function emptyBuildingCounts(): BuildingCounts {
  return BUILDING_IDS.reduce(
    (acc, id) => {
      acc[id] = 0;
      return acc;
    },
    {} as BuildingCounts
  );
}

/** Normalizes unknown save data to valid building counts (unknown keys ignored). */
export function sanitizeBuildingCounts(raw: unknown): BuildingCounts {
  const base = emptyBuildingCounts();
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;
  for (const id of BUILDING_IDS) {
    const v = o[id];
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
      base[id] = Math.floor(v);
    }
  }
  return base;
}

/**
 * Cost for the next purchase when the player already owns `owned` copies.
 * next cost = baseCost * COST_SCALING^owned
 */
export function nextPurchaseCost(baseCost: number, owned: number): number {
  return Math.ceil(baseCost * COST_SCALING ** owned);
}

export function totalPlushiesPerSecond(owned: BuildingCounts): number {
  let sum = 0;
  for (const def of BUILDINGS) {
    sum += (owned[def.id] ?? 0) * def.plushiesPerSecond;
  }
  return sum;
}
