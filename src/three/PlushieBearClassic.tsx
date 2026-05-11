import { Outlines } from "@react-three/drei";

const FUR = "#9d744f";
const FUR_LIGHT = "#c49b72";
const FUR_DEEP = "#6e5038";
const SNOUT = "#d9b89a";
const PAD = "#5c4334";
const NOSE = "#1a1210";
const EYE = "#0a0808";
const SHEEN = "#f2dcc8";

const furPhysical = {
  color: FUR,
  emissive: FUR_DEEP,
  emissiveIntensity: 0.06,
  roughness: 0.9,
  metalness: 0.03,
  clearcoat: 0.1,
  clearcoatRoughness: 0.55,
  sheen: 1,
  sheenRoughness: 0.45,
  sheenColor: SHEEN,
  envMapIntensity: 0.35,
} as const;

/**
 * Classic sitting teddy: separate smooth meshes (no CSG) so silhouette reads
 * clearly — body, head, ears, snout, limbs, pads.
 */
export function ClassicTeddyBearContent() {
  return (
    <>
      <mesh castShadow receiveShadow position={[0, 0.3, 0]} scale={[1.05, 0.88, 0.96]}>
        <sphereGeometry args={[0.48, 40, 36]} />
        <meshPhysicalMaterial {...furPhysical} color={FUR} />
        <Outlines
          thickness={0.016}
          color="#040508"
          opacity={0.82}
          transparent
          screenspace
          angle={Math.PI / 5}
          toneMapped={false}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.58, 0.34]} scale={[0.92, 0.75, 0.55]}>
        <sphereGeometry args={[0.22, 28, 24]} />
        <meshPhysicalMaterial {...furPhysical} color={FUR_LIGHT} roughness={0.88} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.82, 0.04]} scale={[0.95, 0.92, 0.88]}>
        <sphereGeometry args={[0.34, 40, 36]} />
        <meshPhysicalMaterial {...furPhysical} color={FUR_LIGHT} />
        <Outlines
          thickness={0.014}
          color="#040508"
          opacity={0.78}
          transparent
          screenspace
          angle={Math.PI / 5}
          toneMapped={false}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[-0.32, 0.98, -0.02]} scale={[1.05, 1, 0.85]}>
        <sphereGeometry args={[0.12, 22, 20]} />
        <meshPhysicalMaterial {...furPhysical} color={FUR} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.32, 0.98, -0.02]} scale={[1.05, 1, 0.85]}>
        <sphereGeometry args={[0.12, 22, 20]} />
        <meshPhysicalMaterial {...furPhysical} color={FUR} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.76, 0.32]} scale={[1.15, 0.88, 1.1]}>
        <sphereGeometry args={[0.13, 28, 24]} />
        <meshPhysicalMaterial
          color={SNOUT}
          roughness={0.78}
          metalness={0.02}
          sheen={0.6}
          sheenRoughness={0.5}
          sheenColor="#fff2e6"
        />
      </mesh>

      <mesh castShadow position={[0, 0.78, 0.44]} scale={[0.1, 0.08, 0.09]}>
        <sphereGeometry args={[1, 20, 18]} />
        <meshPhysicalMaterial
          color={NOSE}
          roughness={0.25}
          metalness={0.4}
          clearcoat={0.55}
          clearcoatRoughness={0.2}
        />
      </mesh>

      <mesh castShadow position={[-0.1, 0.84, 0.33]} scale={0.048}>
        <sphereGeometry args={[1, 16, 14]} />
        <meshPhysicalMaterial
          color={EYE}
          roughness={0.15}
          metalness={0.5}
          clearcoat={0.45}
        />
      </mesh>
      <mesh castShadow position={[0.1, 0.84, 0.33]} scale={0.048}>
        <sphereGeometry args={[1, 16, 14]} />
        <meshPhysicalMaterial
          color={EYE}
          roughness={0.15}
          metalness={0.5}
          clearcoat={0.45}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[-0.48, 0.42, 0.08]} rotation={[0.15, 0, 0.55]}>
        <capsuleGeometry args={[0.09, 0.34, 8, 20]} />
        <meshPhysicalMaterial {...furPhysical} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.48, 0.42, 0.08]} rotation={[0.15, 0, -0.55]}>
        <capsuleGeometry args={[0.09, 0.34, 8, 20]} />
        <meshPhysicalMaterial {...furPhysical} />
      </mesh>

      <mesh castShadow receiveShadow position={[-0.22, 0.06, 0.16]} scale={[1, 0.85, 1.05]}>
        <capsuleGeometry args={[0.1, 0.18, 6, 16]} />
        <meshPhysicalMaterial {...furPhysical} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.22, 0.06, 0.16]} scale={[1, 0.85, 1.05]}>
        <capsuleGeometry args={[0.1, 0.18, 6, 16]} />
        <meshPhysicalMaterial {...furPhysical} />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.18, 0.05, -0.2]} scale={[1, 0.85, 1.05]}>
        <capsuleGeometry args={[0.1, 0.18, 6, 16]} />
        <meshPhysicalMaterial {...furPhysical} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.18, 0.05, -0.2]} scale={[1, 0.85, 1.05]}>
        <capsuleGeometry args={[0.1, 0.18, 6, 16]} />
        <meshPhysicalMaterial {...furPhysical} />
      </mesh>

      <mesh position={[-0.22, -0.02, 0.16]} rotation={[1.25, 0, 0]} scale={[1, 1, 0.35]}>
        <circleGeometry args={[0.09, 20]} />
        <meshStandardMaterial color={PAD} roughness={0.82} />
      </mesh>
      <mesh position={[0.22, -0.02, 0.16]} rotation={[1.25, 0, 0]} scale={[1, 1, 0.35]}>
        <circleGeometry args={[0.09, 20]} />
        <meshStandardMaterial color={PAD} roughness={0.82} />
      </mesh>
      <mesh position={[-0.18, -0.03, -0.2]} rotation={[1.2, 0, 0]} scale={[1, 1, 0.35]}>
        <circleGeometry args={[0.09, 20]} />
        <meshStandardMaterial color={PAD} roughness={0.82} />
      </mesh>
      <mesh position={[0.18, -0.03, -0.2]} rotation={[1.2, 0, 0]} scale={[1, 1, 0.35]}>
        <circleGeometry args={[0.09, 20]} />
        <meshStandardMaterial color={PAD} roughness={0.82} />
      </mesh>

      <mesh position={[0, 0.52, 0.36]} rotation={[1.28, 0, 0]}>
        <torusGeometry args={[0.16, 0.011, 8, 40, Math.PI * 1.45]} />
        <meshStandardMaterial
          color="#5c4030"
          roughness={0.8}
          transparent
          opacity={0.75}
        />
      </mesh>
    </>
  );
}
