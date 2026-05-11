import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, LinearFilter, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace } from "three";

/**
 * Basic industrial “conveyor line” stage: floor, animated belt, rails, back wall, strip lights.
 * Default cosmetic background for the plushie centerpiece.
 */
export function FactoryEnvironment() {
  const beltTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 8;
    const g = c.getContext("2d");
    if (!g) throw new Error("2d context");
    const stripe = 8;
    for (let x = 0; x < c.width; x += stripe) {
      g.fillStyle = x % (stripe * 2) === 0 ? "#3d424d" : "#2a2e38";
      g.fillRect(x, 0, stripe, c.height);
    }
    g.fillStyle = "rgba(255,255,255,0.06)";
    for (let i = 0; i < 16; i++) {
      g.fillRect(i * 8, 0, 1, c.height);
    }
    const tex = new CanvasTexture(c);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(6, 1);
    tex.colorSpace = SRGBColorSpace;
    tex.minFilter = tex.magFilter = LinearFilter;
    tex.anisotropy = 2;
    return tex;
  }, []);

  useFrame((_, delta) => {
    beltTex.offset.x -= delta * 0.52;
  });

  const floorMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#323844",
        roughness: 0.88,
        metalness: 0.35,
        envMapIntensity: 0.55,
      }),
    []
  );

  const beltMat = useMemo(
    () =>
      new MeshStandardMaterial({
        map: beltTex,
        color: "#9aa6bc",
        roughness: 0.58,
        metalness: 0.52,
        envMapIntensity: 0.75,
      }),
    [beltTex]
  );

  const wallMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#1a1d24",
        roughness: 0.92,
        metalness: 0.1,
        envMapIntensity: 0.4,
      }),
    []
  );

  const railMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#4a5568",
        roughness: 0.45,
        metalness: 0.72,
        envMapIntensity: 0.75,
      }),
    []
  );

  const emissiveStripMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#dfe8ff",
        emissive: "#7a9cff",
        emissiveIntensity: 1.15,
        roughness: 0.38,
        metalness: 0.22,
        toneMapped: true,
      }),
    []
  );

  const basketMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#252a34",
        roughness: 0.55,
        metalness: 0.55,
        envMapIntensity: 0.55,
      }),
    []
  );

  const basketRimMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: "#3d4a5c",
        emissive: "#1a5080",
        emissiveIntensity: 0.2,
        roughness: 0.42,
        metalness: 0.7,
        toneMapped: true,
        polygonOffset: true,
        polygonOffsetFactor: -1.5,
        polygonOffsetUnits: -1,
      }),
    []
  );

  return (
    <group name="factory_stage">
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.58, 0]}
        receiveShadow
        material={floorMat}
      >
        <planeGeometry args={[14, 10]} />
      </mesh>

      {/* Single belt surface (no overlapping lip — avoids z-fighting) */}
      <mesh position={[0.18, -0.545, 0.25]} receiveShadow material={beltMat}>
        <boxGeometry args={[4.15, 0.06, 1.35]} />
      </mesh>

      {/* Collection basket: level with belt, open toward -X; rim uses polygon offset */}
      <group position={[2.1, -0.545, 0.25]} name="collection_basket">
        <mesh receiveShadow material={basketMat} position={[0, -0.055, 0]}>
          <boxGeometry args={[0.54, 0.1, 0.8]} />
        </mesh>
        <mesh receiveShadow material={basketMat} position={[0.28, 0.05, 0]}>
          <boxGeometry args={[0.06, 0.36, 0.76]} />
        </mesh>
        <mesh receiveShadow material={basketMat} position={[0, 0.05, -0.34]}>
          <boxGeometry args={[0.48, 0.36, 0.06]} />
        </mesh>
        <mesh receiveShadow material={basketMat} position={[0, 0.05, 0.34]}>
          <boxGeometry args={[0.48, 0.36, 0.06]} />
        </mesh>
        <mesh
          position={[0, 0.12, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          receiveShadow
          material={basketRimMat}
          renderOrder={2}
        >
          <torusGeometry args={[0.29, 0.02, 6, 20]} />
        </mesh>
      </group>

      {[-1.95, 1.95].map((x) => (
        <mesh
          key={x}
          position={[x, -0.48, 0.25]}
          receiveShadow
          material={railMat}
        >
          <boxGeometry args={[0.06, 0.14, 1.45]} />
        </mesh>
      ))}

      <mesh position={[0, 0.55, -2.35]} receiveShadow material={wallMat}>
        <planeGeometry args={[12, 4.2]} />
      </mesh>

      <mesh
        position={[-3.6, 0.15, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        material={wallMat}
      >
        <planeGeometry args={[8, 3.2]} />
      </mesh>
      <mesh
        position={[3.6, 0.15, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        material={wallMat}
      >
        <planeGeometry args={[8, 3.2]} />
      </mesh>

      <mesh position={[0, 2.35, -0.5]} material={emissiveStripMat}>
        <boxGeometry args={[2.85, 0.08, 3.6]} />
      </mesh>

      <mesh position={[0, 1.85, -2.28]} material={wallMat}>
        <boxGeometry args={[12.2, 0.12, 0.15]} />
      </mesh>

      <mesh position={[0, -0.2, -2.15]} rotation={[0.08, 0, 0]} material={railMat}>
        <boxGeometry args={[2.2, 0.04, 0.35]} />
      </mesh>
    </group>
  );
}

export { applyFactoryRendererDefaults } from "./factoryRendererProfile";
