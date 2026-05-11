export type Vec3Tuple = [number, number, number];

export type SceneTransform = {
  position: Vec3Tuple;
  rotation: Vec3Tuple;
  scale: Vec3Tuple;
};

export const IDENTITY_TRANSFORM: SceneTransform = {
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
};

export const SCENE_ENTITY_IDS = [
  "factory_stage",
  "machine",
  "spout_anchor",
  "hero_bear",
  "light_hemisphere",
  "light_key",
  "light_fill",
  "light_point",
] as const;

export type SceneEntityId = (typeof SCENE_ENTITY_IDS)[number];

export const SCENE_ENTITY_META: Record<
  SceneEntityId,
  { label: string; category: string; hint?: string }
> = {
  factory_stage: {
    label: "Factory floor & belt",
    category: "Stage",
    hint: "Floor, conveyor, rails, walls, basket",
  },
  machine: { label: "Plushie machine", category: "Stage", hint: "Hull, glass, slide" },
  spout_anchor: {
    label: "Drop spout",
    category: "Stage",
    hint: "Where mini plushies spawn (not the models themselves)",
  },
  hero_bear: {
    label: "Click plushie",
    category: "Stage",
    hint: "Hero bear pivot (inside machine)",
  },
  light_hemisphere: { label: "Hemisphere light", category: "Lighting" },
  light_key: { label: "Key directional", category: "Lighting", hint: "Casts shadows" },
  light_fill: { label: "Fill directional", category: "Lighting" },
  light_point: { label: "Warm point light", category: "Lighting" },
};

/** Baseline transforms (game defaults before any editor overrides). */
export const SCENE_LAYOUT_DEFAULTS: Record<SceneEntityId, SceneTransform> = {
  factory_stage: { ...IDENTITY_TRANSFORM },
  machine: {
    position: [-0.02, 0.06, -0.06],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  spout_anchor: {
    position: [0, -0.42, 0.2],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  hero_bear: {
    position: [0, 0.3, -0.12],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  light_hemisphere: { ...IDENTITY_TRANSFORM },
  light_key: {
    position: [2.8, 5.5, 3.8],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  light_fill: {
    position: [-3.5, 3.2, -1.8],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  light_point: {
    position: [0, 2.15, 0.9],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
};

export type SceneExtras = {
  ambientIntensity: number;
  envIntensity: number;
};

export const SCENE_EXTRAS_DEFAULTS: SceneExtras = {
  ambientIntensity: 0.42,
  envIntensity: 0.32,
};

/** Saved layout deltas (IndexedDB). */
export type SceneLayoutOverrides = Partial<
  Record<SceneEntityId, Partial<{ position?: Vec3Tuple; rotation?: Vec3Tuple; scale?: Vec3Tuple }>>
>;

function finiteVec3(v: Vec3Tuple | undefined, base: Vec3Tuple): Vec3Tuple {
  if (!v || v.length !== 3) return [...base];
  return [
    Number.isFinite(v[0]) ? v[0] : base[0],
    Number.isFinite(v[1]) ? v[1] : base[1],
    Number.isFinite(v[2]) ? v[2] : base[2],
  ];
}

/** Merge saved overrides onto defaults for one entity. */
export function getMergedEntityTransform(
  id: SceneEntityId,
  overrides: SceneLayoutOverrides
): SceneTransform {
  const base = SCENE_LAYOUT_DEFAULTS[id];
  const o = overrides[id];
  if (!o) {
    return {
      position: [...base.position],
      rotation: [...base.rotation],
      scale: [...base.scale],
    };
  }
  const pos = finiteVec3(o.position, base.position);
  const rot = finiteVec3(o.rotation, base.rotation);
  const scl = finiteVec3(o.scale, base.scale);
  const scaleSafe: Vec3Tuple = [
    scl[0] === 0 ? base.scale[0] : scl[0],
    scl[1] === 0 ? base.scale[1] : scl[1],
    scl[2] === 0 ? base.scale[2] : scl[2],
  ];
  return { position: pos, rotation: rot, scale: scaleSafe };
}

export type SceneExtrasPartial = Partial<SceneExtras>;

export function getMergedExtras(partial: SceneExtrasPartial): SceneExtras {
  const d = SCENE_EXTRAS_DEFAULTS;
  return {
    ambientIntensity:
      typeof partial.ambientIntensity === "number" && Number.isFinite(partial.ambientIntensity)
        ? partial.ambientIntensity
        : d.ambientIntensity,
    envIntensity:
      typeof partial.envIntensity === "number" && Number.isFinite(partial.envIntensity)
        ? partial.envIntensity
        : d.envIntensity,
  };
}
