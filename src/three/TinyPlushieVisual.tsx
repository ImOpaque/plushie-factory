import { memo } from "react";
import { MeshStandardMaterial } from "three";

const FUR = "#9d744f";
const FUR_LIGHT = "#c49b72";

/** One material set shared by all conveyor drops (avoids per-instance GPU material alloc). */
const DROP_BODY = new MeshStandardMaterial({
  color: FUR,
  roughness: 0.92,
  metalness: 0.06,
  envMapIntensity: 0.28,
});
const DROP_HEAD = new MeshStandardMaterial({
  color: FUR_LIGHT,
  roughness: 0.9,
  metalness: 0.05,
  envMapIntensity: 0.26,
});
const DROP_EAR = new MeshStandardMaterial({
  color: FUR,
  roughness: 0.92,
  metalness: 0.05,
});

type TinyPlushieVisualProps = {
  /** `drop`: cheaper materials, fewer shadows (conveyor instances). */
  variant?: "default" | "drop";
};

/**
 * Lightweight plush read at tiny scale (no outlines) for conveyor drops.
 */
export const TinyPlushieVisual = memo(function TinyPlushieVisual({
  variant = "default",
}: TinyPlushieVisualProps) {
  if (variant === "drop") {
    return (
      <group name="tiny_plush_visual_drop">
        <mesh castShadow={false} receiveShadow position={[0, 0.045, 0]} material={DROP_BODY}>
          <capsuleGeometry args={[0.035, 0.055, 6, 8]} />
        </mesh>
        <mesh castShadow={false} receiveShadow position={[0, 0.11, 0.02]} material={DROP_HEAD}>
          <sphereGeometry args={[0.055, 10, 8]} />
        </mesh>
        <mesh castShadow={false} position={[-0.038, 0.125, 0]} material={DROP_EAR}>
          <sphereGeometry args={[0.022, 6, 6]} />
        </mesh>
        <mesh castShadow={false} position={[0.038, 0.125, 0]} material={DROP_EAR}>
          <sphereGeometry args={[0.022, 6, 6]} />
        </mesh>
      </group>
    );
  }

  return (
    <group name="tiny_plush_visual">
      <mesh castShadow receiveShadow position={[0, 0.045, 0]}>
        <capsuleGeometry args={[0.035, 0.055, 6, 10]} />
        <meshPhysicalMaterial
          color={FUR}
          roughness={0.9}
          metalness={0.04}
          clearcoat={0.08}
          envMapIntensity={0.35}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.11, 0.02]}>
        <sphereGeometry args={[0.055, 14, 12]} />
        <meshPhysicalMaterial
          color={FUR_LIGHT}
          roughness={0.88}
          metalness={0.03}
          envMapIntensity={0.32}
        />
      </mesh>
      <mesh castShadow position={[-0.038, 0.125, 0]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshPhysicalMaterial color={FUR} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.038, 0.125, 0]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshPhysicalMaterial color={FUR} roughness={0.9} />
      </mesh>
    </group>
  );
});
