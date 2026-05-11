import { useLayoutEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { Object3D } from "three";
import {
  applyFactoryPlushieGltfSurface,
  fitAndCenterPlushieGltfRoot,
} from "./plushieGltfPrepare";

type PlushieBearGltfProps = {
  url: string;
  /** Largest axis length after normalization (default matches main stage teddy). */
  fitTargetMaxDim?: number;
};

/**
 * Loads an authored plush from GLB/GLTF. Hides stray line geometry (common artifact),
 * softens harsh materials, and boosts readability for our factory lighting.
 */
export function PlushieBearGltf({ url, fitTargetMaxDim }: PlushieBearGltfProps) {
  const targetDim = fitTargetMaxDim ?? 1.45;
  const gltf = useGLTF(url);
  const root = useMemo(() => gltf.scene.clone(true) as Object3D, [gltf.scene]);

  useLayoutEffect(() => {
    try {
      applyFactoryPlushieGltfSurface(root, "full");
      fitAndCenterPlushieGltfRoot(root, targetDim);
    } catch (e) {
      console.error("[PlushieBearGltf] prepare failed", e);
    }
  }, [root, targetDim]);

  return <primitive object={root} />;
}
