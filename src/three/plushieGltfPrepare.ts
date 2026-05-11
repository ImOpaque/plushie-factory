import type { Object3D } from "three";
import {
  Box3,
  DoubleSide,
  FrontSide,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Vector3,
} from "three";

export function isLineLikeGltfNode(obj: Object3D): boolean {
  const t = obj.type;
  return t === "Line" || t === "LineSegments" || t === "LineLoop";
}

export type PlushieGltfPrepareShadowMode = "full" | "none";

/**
 * Material + visibility cleanup shared by stage teddy and conveyor droplets.
 */
export function applyFactoryPlushieGltfSurface(
  root: Object3D,
  shadowMode: PlushieGltfPrepareShadowMode = "full"
): void {
  const cast = shadowMode === "full";
  const receive = shadowMode === "full";

  root.traverse((obj) => {
    if (isLineLikeGltfNode(obj)) {
      obj.visible = false;
      return;
    }

    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;

    mesh.castShadow = cast;
    mesh.receiveShadow = receive;

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const raw of mats) {
      if (!raw) continue;

      if ("flatShading" in raw) raw.flatShading = false;
      raw.depthWrite = true;
      raw.polygonOffset = false;

      if (raw.side === DoubleSide) {
        raw.side = FrontSide;
      }

      if (raw instanceof MeshPhysicalMaterial) {
        raw.envMapIntensity = Math.max(0.4, (raw.envMapIntensity ?? 1) * 1.35);
        raw.roughness = Math.min(0.95, Math.max(0.35, (raw.roughness ?? 0.75) * 0.92));
        raw.metalness = Math.min(0.45, (raw.metalness ?? 0.1) * 0.85);
        raw.sheen = Math.max(raw.sheen ?? 0, 0.35);
        raw.sheenRoughness = Math.min(
          0.85,
          Math.max(0.25, raw.sheenRoughness ?? 0.5)
        );
        raw.sheenColor.offsetHSL(0, 0.05, 0.04);
        raw.clearcoat = Math.min(0.35, (raw.clearcoat ?? 0) + 0.08);
        raw.clearcoatRoughness = Math.min(
          0.75,
          Math.max(0.2, raw.clearcoatRoughness ?? 0.45)
        );
      } else if (raw instanceof MeshStandardMaterial) {
        raw.envMapIntensity = Math.max(0.4, (raw.envMapIntensity ?? 1) * 1.35);
        raw.roughness = Math.min(0.95, Math.max(0.35, (raw.roughness ?? 0.75) * 0.92));
        raw.metalness = Math.min(0.45, (raw.metalness ?? 0.1) * 0.85);
        raw.emissiveIntensity = Math.min(
          0.22,
          Math.max(0, (raw.emissiveIntensity ?? 0) + 0.05)
        );
      }
    }
  });
}

/** Uniform scale + feet on origin (same convention as `PlushieBearGltf`). */
export function fitAndCenterPlushieGltfRoot(
  root: Object3D,
  fitTargetMaxDim: number,
  pivotYOffset = 0.02
): void {
  root.scale.setScalar(1);
  root.position.set(0, 0, 0);
  root.updateMatrixWorld(true);
  const box = new Box3().setFromObject(root);
  const size = box.getSize(new Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 1e-6);
  const s = fitTargetMaxDim / maxDim;
  root.scale.setScalar(s);
  root.updateMatrixWorld(true);
  const box2 = new Box3().setFromObject(root);
  const center = box2.getCenter(new Vector3());
  root.position.set(-center.x, -center.y + pivotYOffset, -center.z);
}

/** One prepared clone for instancing via `<Clone object={...} />` (geometries shared). */
export function createPreparedPlushieGltfClone(
  sourceScene: Object3D,
  fitTargetMaxDim: number,
  shadowMode: PlushieGltfPrepareShadowMode
): Group {
  const root = sourceScene.clone(true);
  applyFactoryPlushieGltfSurface(root, shadowMode);
  fitAndCenterPlushieGltfRoot(root, fitTargetMaxDim);
  const wrap = new Group();
  wrap.name = "prepared_plushie_gltf";
  wrap.add(root);
  return wrap;
}
