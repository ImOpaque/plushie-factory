import { memo } from "react";

const FUR = "#9d744f";
const FUR_LIGHT = "#c49b72";

/**
 * Lightweight plush read at tiny scale (no outlines) for conveyor drops.
 */
export const TinyPlushieVisual = memo(function TinyPlushieVisual() {
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
