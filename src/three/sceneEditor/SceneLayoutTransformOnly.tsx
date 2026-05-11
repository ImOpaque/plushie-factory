import { type ReactNode } from "react";
import type { SceneEntityId } from "../../data/sceneLayoutRegistry";
import { useSceneLayoutTransform } from "../../hooks/useSceneLayoutTransform";

/** Same transform as `SceneLayoutEntity` but no picking or gizmo (for physics mirror). */
export function SceneLayoutTransformOnly({
  id,
  children,
}: {
  id: SceneEntityId;
  children: ReactNode;
}) {
  const t = useSceneLayoutTransform(id);
  return (
    <group name={`layout_physics_${id}`} position={t.position} rotation={t.rotation} scale={t.scale}>
      {children}
    </group>
  );
}
