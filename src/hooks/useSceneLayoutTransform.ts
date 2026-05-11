import { useMemo } from "react";
import type { SceneEntityId } from "../data/sceneLayoutRegistry";
import { getMergedEntityTransform, getMergedExtras } from "../data/sceneLayoutRegistry";
import { useSceneEditorStore } from "../stores/sceneEditorStore";

export function useSceneLayoutTransform(id: SceneEntityId) {
  const overrides = useSceneEditorStore((s) => s.overrides);
  return useMemo(() => getMergedEntityTransform(id, overrides), [id, overrides]);
}

export function useSceneExtrasMerged() {
  const extrasPartial = useSceneEditorStore((s) => s.extrasPartial);
  return useMemo(() => getMergedExtras(extrasPartial), [extrasPartial]);
}
