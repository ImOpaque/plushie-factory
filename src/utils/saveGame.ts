import { get, set } from "idb-keyval";
import {
  emptyBuildingCounts,
  sanitizeBuildingCounts,
  type BuildingCounts,
} from "../data/buildings";

export const SAVE_KEY = "plushie-factory-save-v1";

export type SavePayload = {
  plushies: number;
  clickValue: number;
  buildingsOwned: BuildingCounts;
  passiveAcc: number;
  totalClicks: number;
  stuffing: number;
  playtimeSeconds: number;
};

function isLegacySave(value: Record<string, unknown>): boolean {
  return (
    typeof value.plushies === "number" &&
    Number.isFinite(value.plushies) &&
    typeof value.clickValue === "number" &&
    Number.isFinite(value.clickValue)
  );
}

function clampInt(n: unknown, fallback: number, min: number): number {
  if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
  return Math.max(min, Math.floor(n));
}

function clampNonNegFloat(n: unknown, fallback: number): number {
  if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
  return Math.max(0, n);
}

export async function loadGame(): Promise<SavePayload | null> {
  const raw = await get<unknown>(SAVE_KEY);
  if (raw === null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!isLegacySave(o)) return null;

  const buildingsOwned = o.buildingsOwned
    ? sanitizeBuildingCounts(o.buildingsOwned)
    : emptyBuildingCounts();

  const passiveAcc = clampNonNegFloat(o.passiveAcc, 0);

  return {
    plushies: Math.max(0, Math.floor(o.plushies as number)),
    clickValue: Math.max(1, Math.floor(o.clickValue as number)),
    buildingsOwned,
    passiveAcc,
    totalClicks: clampInt(o.totalClicks, 0, 0),
    stuffing: clampInt(o.stuffing, 0, 0),
    playtimeSeconds: clampNonNegFloat(o.playtimeSeconds, 0),
  };
}

export async function saveGame(payload: SavePayload): Promise<void> {
  await set(SAVE_KEY, {
    plushies: Math.max(0, Math.floor(payload.plushies)),
    clickValue: Math.max(1, Math.floor(payload.clickValue)),
    buildingsOwned: payload.buildingsOwned,
    passiveAcc: Math.max(0, payload.passiveAcc),
    totalClicks: Math.max(0, Math.floor(payload.totalClicks)),
    stuffing: Math.max(0, Math.floor(payload.stuffing)),
    playtimeSeconds: Math.max(0, payload.playtimeSeconds),
  });
}
