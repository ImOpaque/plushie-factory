import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
} from "react";
import { TransformControls } from "@react-three/drei";
import { Group } from "three";
import type { SceneEntityId } from "../../data/sceneLayoutRegistry";
import { useSceneLayoutTransform } from "../../hooks/useSceneLayoutTransform";
import { useSceneEditorStore } from "../../stores/sceneEditorStore";

type SceneLayoutEntityProps = {
  id: SceneEntityId;
  children: ReactNode;
  /** Same group used for drag-rotate on the hero bear. */
  comboRef?: RefObject<Group | null>;
};

export function SceneLayoutEntity({ id, children, comboRef }: SceneLayoutEntityProps) {
  const [groupObj, setGroupObj] = useState<Group | null>(null);
  const innerRef = useRef<Group | null>(null);

  const setGroupRef = useCallback(
    (g: Group | null) => {
      innerRef.current = g;
      if (comboRef) (comboRef as MutableRefObject<Group | null>).current = g;
      setGroupObj(g);
    },
    [comboRef]
  );

  const t = useSceneLayoutTransform(id);
  const enabled = useSceneEditorStore((s) => s.enabled);
  const selected = useSceneEditorStore((s) => s.selectedId === id);
  const mode = useSceneEditorStore((s) => s.transformMode);
  const gizmoDragging = useSceneEditorStore((s) => s.gizmoDragging);
  const patchTransform = useSceneEditorStore((s) => s.patchTransform);
  const setSelectedId = useSceneEditorStore((s) => s.setSelectedId);
  const setGizmoDragging = useSceneEditorStore((s) => s.setGizmoDragging);

  useLayoutEffect(() => {
    const g = innerRef.current;
    if (!g || gizmoDragging) return;
    g.position.set(t.position[0], t.position[1], t.position[2]);
    g.rotation.set(t.rotation[0], t.rotation[1], t.rotation[2]);
    g.scale.set(t.scale[0], t.scale[1], t.scale[2]);
    g.updateMatrixWorld();
  }, [t, gizmoDragging]);

  return (
    <>
      <group
        ref={setGroupRef}
        name={`layout_${id}`}
        onPointerDown={(e) => {
          if (!enabled) return;
          e.stopPropagation();
          setSelectedId(id);
        }}
      >
        {children}
      </group>
      {enabled && selected && groupObj ? (
        <TransformControls
          key={id}
          object={groupObj}
          mode={mode}
          onMouseDown={() => setGizmoDragging(true)}
          onMouseUp={() => {
            setGizmoDragging(false);
            const o = innerRef.current;
            if (!o) return;
            patchTransform(id, {
              position: [o.position.x, o.position.y, o.position.z],
              rotation: [o.rotation.x, o.rotation.y, o.rotation.z],
              scale: [o.scale.x, o.scale.y, o.scale.z],
            });
          }}
        />
      ) : null}
    </>
  );
}
