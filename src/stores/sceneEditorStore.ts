import { create } from "zustand";
import { get as idbGet, set as idbSet } from "idb-keyval";
import type {
  SceneEntityId,
  SceneExtras,
  SceneExtrasPartial,
  SceneLayoutOverrides,
  SceneTransform,
} from "../data/sceneLayoutRegistry";
import {
  getMergedEntityTransform,
  getMergedExtras,
  SCENE_ENTITY_IDS,
  SCENE_LAYOUT_DEFAULTS,
} from "../data/sceneLayoutRegistry";

export const SCENE_EDITOR_STORAGE_KEY = "pf-scene-editor-layout-v1";

export type TransformMode = "translate" | "rotate" | "scale";

export type SceneEditorPersisted = {
  overrides: SceneLayoutOverrides;
  extras: SceneExtrasPartial;
};

function vec3Differs(a: readonly [number, number, number], b: readonly [number, number, number]): boolean {
  return a[0] !== b[0] || a[1] !== b[1] || a[2] !== b[2];
}

export type SceneEditorState = {
  enabled: boolean;
  selectedId: SceneEntityId | null;
  transformMode: TransformMode;
  gizmoDragging: boolean;
  overrides: SceneLayoutOverrides;
  extrasPartial: SceneExtrasPartial;
  hydrated: boolean;
  unsaved: boolean;

  setEnabled: (v: boolean) => void;
  toggleEnabled: () => void;
  setSelectedId: (id: SceneEntityId | null) => void;
  setTransformMode: (m: TransformMode) => void;
  setGizmoDragging: (v: boolean) => void;

  getTransform: (id: SceneEntityId) => SceneTransform;
  patchTransform: (id: SceneEntityId, patch: Partial<SceneTransform>) => void;
  patchTransformField: (
    id: SceneEntityId,
    key: keyof SceneTransform,
    axis: 0 | 1 | 2,
    value: number
  ) => void;
  resetEntity: (id: SceneEntityId) => void;
  resetAll: () => void;

  getExtras: () => SceneExtras;
  patchExtras: (patch: SceneExtrasPartial) => void;

  hydrateFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
  markSaved: () => void;
};

function isEntityId(s: string): s is SceneEntityId {
  return (SCENE_ENTITY_IDS as readonly string[]).includes(s);
}

export const useSceneEditorStore = create<SceneEditorState>((set, get) => ({
  enabled: false,
  selectedId: null,
  transformMode: "translate",
  gizmoDragging: false,
  overrides: {},
  extrasPartial: {},
  hydrated: false,
  unsaved: false,

  setEnabled: (v) => set({ enabled: v, selectedId: v ? get().selectedId : null }),
  toggleEnabled: () => {
    const next = !get().enabled;
    set({ enabled: next, selectedId: next ? get().selectedId : null });
  },
  setSelectedId: (id) => set({ selectedId: id }),
  setTransformMode: (m) => set({ transformMode: m }),
  setGizmoDragging: (v) => set({ gizmoDragging: v }),

  getTransform: (id) => getMergedEntityTransform(id, get().overrides),

  patchTransform: (id, patch) => {
    const cur = getMergedEntityTransform(id, get().overrides);
    const next: SceneTransform = {
      position: patch.position ?? cur.position,
      rotation: patch.rotation ?? cur.rotation,
      scale: patch.scale ?? cur.scale,
    };
    const base = SCENE_LAYOUT_DEFAULTS[id];
    const o = get().overrides;
    const mergedOverride: NonNullable<SceneLayoutOverrides[SceneEntityId]> = {};
    if (vec3Differs(next.position, base.position)) mergedOverride.position = next.position;
    if (vec3Differs(next.rotation, base.rotation)) mergedOverride.rotation = next.rotation;
    if (vec3Differs(next.scale, base.scale)) mergedOverride.scale = next.scale;
    const nextOverrides = { ...o };
    if (Object.keys(mergedOverride).length === 0) delete nextOverrides[id];
    else nextOverrides[id] = mergedOverride;
    set({ overrides: nextOverrides, unsaved: true });
  },

  patchTransformField: (id, key, axis, value) => {
    const t = get().getTransform(id);
    const arr = [...t[key]] as [number, number, number];
    arr[axis] = value;
    get().patchTransform(id, { [key]: arr } as Partial<SceneTransform>);
  },

  resetEntity: (id) => {
    const o = { ...get().overrides };
    delete o[id];
    set({ overrides: o, unsaved: true });
  },

  resetAll: () =>
    set({
      overrides: {},
      extrasPartial: {},
      unsaved: true,
    }),

  getExtras: () => getMergedExtras(get().extrasPartial),

  patchExtras: (patch) => {
    set({
      extrasPartial: { ...get().extrasPartial, ...patch },
      unsaved: true,
    });
  },

  hydrateFromStorage: async () => {
    try {
      const raw = await idbGet(SCENE_EDITOR_STORAGE_KEY);
      if (!raw || typeof raw !== "object") {
        set({ hydrated: true });
        return;
      }
      const p = raw as SceneEditorPersisted;
      const overrides: SceneEditorPersisted["overrides"] = {};
      if (p.overrides && typeof p.overrides === "object") {
        for (const k of Object.keys(p.overrides)) {
          if (isEntityId(k)) overrides[k] = p.overrides[k];
        }
      }
      const extrasPartial =
        p.extras && typeof p.extras === "object" ? (p.extras as SceneExtrasPartial) : {};
      set({ overrides, extrasPartial, hydrated: true, unsaved: false });
    } catch (e) {
      console.error("[sceneEditorStore] hydrateFromStorage", e);
      set({ hydrated: true });
    }
  },

  saveToStorage: async () => {
    const s = get();
    const payload: SceneEditorPersisted = {
      overrides: s.overrides,
      extras: s.extrasPartial,
    };
    await idbSet(SCENE_EDITOR_STORAGE_KEY, payload);
    set({ unsaved: false });
  },

  markSaved: () => set({ unsaved: false }),
}));
