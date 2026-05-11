import { Box3, Mesh, type Object3D, Vector3 } from "three";

/** Scale + center imported machine so it sits sensibly in the stage (same idea as plushie fit). */
export function fitMachineGltfToStage(
  root: Object3D,
  maxDim = 1.38,
  pivotYOffset = 0
): void {
  root.scale.setScalar(1);
  root.position.set(0, 0, 0);
  root.updateMatrixWorld(true);
  const box = new Box3().setFromObject(root);
  const size = box.getSize(new Vector3());
  const maxD = Math.max(size.x, size.y, size.z, 1e-6);
  const s = maxDim / maxD;
  root.scale.setScalar(s);
  root.updateMatrixWorld(true);
  const box2 = new Box3().setFromObject(root);
  const center = box2.getCenter(new Vector3());
  root.position.set(-center.x, -center.y + pivotYOffset, -center.z);
}

export function applyMachineGltfShadowDefaults(root: Object3D): void {
  root.traverse((obj) => {
    if (obj instanceof Mesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });
}
