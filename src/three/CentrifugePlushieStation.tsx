import { useMemo, useRef } from "react";
import type { RefObject } from "react";
import { CylinderGeometry, Group, MeshStandardMaterial, SphereGeometry } from "three";
import { PlushieBear } from "./PlushieBear";

type CentrifugePlushieStationProps = {
  onPlushieClick: () => void;
  spawnAnchorRef: RefObject<Group>;
};

const NEON = "#22d0ff";
const NEON_DEEP = "#0a6a9e";
const HULL = "#2a3344";
const STEEL = "#9aa8bc";
const SLIDE = "#3a4558";

/**
 * Root near the belt; inner group **Y = π** so the hollow chamber + glass face **+world Z** (belt).
 * Outlet is wrapped in a second **Y = π** so the slide + spout world pose stays correct.
 * Glass uses cheap transparent standard material (no transmission).
 */
export function CentrifugePlushieStation({
  onPlushieClick,
  spawnAnchorRef,
}: CentrifugePlushieStationProps) {
  const userBearRotRef = useRef<Group>(null);

  const hullMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: HULL,
        roughness: 0.48,
        metalness: 0.72,
        envMapIntensity: 0.85,
      }),
    []
  );

  const steelMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: STEEL,
        roughness: 0.32,
        metalness: 0.88,
        envMapIntensity: 0.75,
      }),
    []
  );

  const neonTubeMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: NEON,
        emissive: NEON,
        emissiveIntensity: 1.55,
        roughness: 0.28,
        metalness: 0.4,
        toneMapped: true,
      }),
    []
  );

  const neonDimMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: NEON_DEEP,
        emissive: NEON,
        emissiveIntensity: 0.58,
        roughness: 0.42,
        metalness: 0.55,
        toneMapped: true,
      }),
    []
  );

  const chamberBackMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#040a10",
        emissive: NEON,
        emissiveIntensity: 0.42,
        roughness: 0.94,
        metalness: 0.1,
        toneMapped: true,
      }),
    []
  );

  /** Fast “glass”: no MeshPhysical transmission (major GPU saver). */
  const glassMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#d4ecff",
        transparent: true,
        opacity: 0.28,
        metalness: 0.92,
        roughness: 0.06,
        envMapIntensity: 1.05,
        depthWrite: false,
      }),
    []
  );

  const gaugeFaceMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#0a1624",
        emissive: NEON,
        emissiveIntensity: 0.7,
        roughness: 0.42,
        metalness: 0.42,
        toneMapped: true,
      }),
    []
  );

  const slideMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: SLIDE,
        roughness: 0.4,
        metalness: 0.78,
        envMapIntensity: 0.7,
      }),
    []
  );

  const rivetGeo = useMemo(() => new SphereGeometry(0.012, 4, 4), []);
  const cableGeo = useMemo(() => new CylinderGeometry(0.034, 0.03, 0.34, 6), []);

  const rivetPositions: [number, number, number][] = useMemo(
    () => [
      [-0.34, 0.74, 0.328],
      [0.34, 0.74, 0.328],
      [-0.34, 0.36, 0.328],
      [0.34, 0.36, 0.328],
    ],
    []
  );

  return (
    <group name="plushie_maker_root" position={[-0.02, 0.06, -0.06]}>
      {/* π on Y: hollow + glass face +world Z (belt); outlet nested with second π keeps slide/spawn world pose */}
      <group name="plushie_maker_inner" rotation={[0, Math.PI, 0]}>
        {/* --- Shell: deeper in Z so bear stays inside --- */}
        <mesh position={[0, -0.52, -0.08]} castShadow receiveShadow material={hullMat}>
          <boxGeometry args={[1.2, 0.2, 0.92]} />
        </mesh>
        <mesh position={[0, -0.38, -0.06]} castShadow={false} receiveShadow material={hullMat}>
          <boxGeometry args={[1.02, 0.16, 0.82]} />
        </mesh>

        <mesh position={[0, 0.14, -0.06]} castShadow receiveShadow material={hullMat}>
          <boxGeometry args={[0.92, 0.9, 0.86]} />
        </mesh>
        <mesh position={[0, 0.66, -0.06]} castShadow={false} material={hullMat}>
          <cylinderGeometry args={[0.43, 0.47, 0.18, 12]} />
        </mesh>
        <mesh position={[0, 0.76, -0.06]} castShadow={false} material={hullMat}>
          <sphereGeometry args={[0.45, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>

        <mesh position={[0, 0.36, -0.38]} material={chamberBackMat}>
          <planeGeometry args={[0.82, 0.76]} />
        </mesh>
        <pointLight
          position={[0, 0.42, -0.06]}
          intensity={0.88}
          color={NEON}
          distance={1.55}
          decay={2}
        />

        {/* Bear centered in chamber, clear of hull +Z wall */}
        <group ref={userBearRotRef} position={[0, 0.3, -0.12]}>
          <group scale={0.34}>
            <PlushieBear
              onPlushieClick={onPlushieClick}
              gltfFitTargetMaxDim={0.66}
              dragRotateParentRef={userBearRotRef}
            />
          </group>
        </group>

        {/* Glass slightly proud of hull +Z face (~0.37) */}
        <mesh position={[0, 0.36, 0.34]} material={glassMat} castShadow={false} receiveShadow={false}>
          <planeGeometry args={[0.64, 0.68]} />
        </mesh>

        <mesh position={[0, 0.74, 0.328]} castShadow={false} material={steelMat}>
          <boxGeometry args={[0.74, 0.09, 0.048]} />
        </mesh>
        <mesh position={[-0.33, 0.36, 0.328]} castShadow={false} material={steelMat}>
          <boxGeometry args={[0.045, 0.72, 0.048]} />
        </mesh>
        <mesh position={[0.33, 0.36, 0.328]} castShadow={false} material={steelMat}>
          <boxGeometry args={[0.045, 0.72, 0.048]} />
        </mesh>
        <mesh position={[0, 0.74, 0.328]} material={neonDimMat}>
          <boxGeometry args={[0.58, 0.016, 0.034]} />
        </mesh>
        <mesh position={[0, -0.02, 0.328]} castShadow={false} material={steelMat}>
          <boxGeometry args={[0.74, 0.055, 0.048]} />
        </mesh>

        {rivetPositions.map((p, i) => (
          <mesh key={i} position={p} geometry={rivetGeo} material={steelMat} castShadow={false} />
        ))}

        <mesh position={[-0.38, 0.82, -0.2]} castShadow={false} material={hullMat}>
          <cylinderGeometry args={[0.05, 0.054, 0.06, 6]} />
        </mesh>
        <mesh
          position={[-0.38, 0.9, -0.2]}
          rotation={[0.38, 0, -0.22]}
          geometry={cableGeo}
          material={neonTubeMat}
          castShadow={false}
        />
        <mesh position={[0.38, 0.82, -0.18]} castShadow={false} material={hullMat}>
          <cylinderGeometry args={[0.05, 0.054, 0.06, 6]} />
        </mesh>
        <mesh
          position={[0.38, 0.9, -0.18]}
          rotation={[0.4, 0, 0.24]}
          geometry={cableGeo}
          material={neonTubeMat}
          castShadow={false}
        />

        <mesh position={[0.48, 0.32, -0.06]} castShadow={false} material={hullMat}>
          <boxGeometry args={[0.1, 0.56, 0.09]} />
        </mesh>
        <mesh position={[0.48, 0.32, -0.015]} material={neonDimMat}>
          <boxGeometry args={[0.034, 0.44, 0.016]} />
        </mesh>
        <mesh position={[0.48, 0.46, -0.01]} material={neonTubeMat}>
          <boxGeometry args={[0.046, 0.032, 0.02]} />
        </mesh>

        <group position={[-0.44, -0.26, 0.06]}>
          <mesh castShadow={false} material={hullMat} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.096, 0.096, 0.04, 12]} />
          </mesh>
          <mesh position={[0, 0, 0.024]} material={gaugeFaceMat} rotation={[0, 0, 0.35]}>
            <circleGeometry args={[0.06, 14]} />
          </mesh>
          <mesh position={[0, 0, 0.028]} material={steelMat}>
            <torusGeometry args={[0.064, 0.009, 6, 18]} />
          </mesh>
        </group>

        <group rotation={[0, Math.PI, 0]}>
          <group name="outlet_slide" position={[0, -0.44, 0]}>
            <mesh position={[0, 0.08, 0.14]} castShadow={false} material={hullMat}>
              <boxGeometry args={[0.52, 0.12, 0.28]} />
            </mesh>
            <mesh position={[0, -0.02, 0.3]} rotation={[0.5, 0, 0]} castShadow={false} material={slideMat}>
              <boxGeometry args={[0.34, 0.04, 0.5]} />
            </mesh>
            <mesh position={[-0.19, -0.05, 0.3]} rotation={[0.5, 0, 0]} castShadow={false} material={slideMat}>
              <boxGeometry args={[0.035, 0.075, 0.52]} />
            </mesh>
            <mesh position={[0.19, -0.05, 0.3]} rotation={[0.5, 0, 0]} castShadow={false} material={slideMat}>
              <boxGeometry args={[0.035, 0.075, 0.52]} />
            </mesh>
            <mesh position={[0, -0.12, 0.5]} rotation={[0.88, 0, 0]} castShadow={false} material={slideMat}>
              <boxGeometry args={[0.3, 0.035, 0.34]} />
            </mesh>
            <mesh position={[0, -0.18, 0.68]} rotation={[1.02, 0, 0]} castShadow={false} material={slideMat}>
              <boxGeometry args={[0.26, 0.03, 0.2]} />
            </mesh>
          </group>
        </group>

        <group ref={spawnAnchorRef} position={[-0.02, -0.48, -0.26]} name="spout_spawn" />
      </group>
    </group>
  );
}
