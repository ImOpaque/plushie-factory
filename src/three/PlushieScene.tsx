import { useRef } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Group, MOUSE, type WebGLRenderer } from "three";
import { DEFAULT_STAGE_ID } from "../data/stageEnvironments";
import { CentrifugePlushieStation } from "./CentrifugePlushieStation";
import { DroppedPlushies } from "./DroppedPlushies";
import { FactoryEnvironment, applyFactoryRendererDefaults } from "./FactoryEnvironment";
import { scheduleRendererAdaptiveQuality } from "./factoryRendererProfile";
import { FactoryPhysicsColliders } from "./FactoryPhysicsColliders";

type PlushieSceneProps = {
  onPlushieClick: () => void;
};

/**
 * Factory conveyor stage, bright cartoon-friendly lighting, plushie centerpiece.
 */
export function PlushieScene({ onPlushieClick }: PlushieSceneProps) {
  const spoutSpawnRef = useRef<Group>(null!);

  return (
    <>
      <color attach="background" args={["#12151c"]} />

      <hemisphereLight args={["#b8c8f0", "#2a2420", 0.55]} />
      <ambientLight intensity={0.42} color="#d8e4ff" />

      <directionalLight
        castShadow
        position={[2.8, 5.5, 3.8]}
        intensity={1.35}
        color="#fff8f2"
        shadow-mapSize={[512, 512]}
        shadow-camera-far={28}
        shadow-camera-near={0.4}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-4}
        shadow-bias={-0.00006}
        shadow-normalBias={0.035}
      />

      <directionalLight
        position={[-3.5, 3.2, -1.8]}
        intensity={0.42}
        color="#9ec0ff"
      />

      <pointLight position={[0, 2.15, 0.9]} intensity={0.38} color="#ffe8d0" distance={14} decay={2} />

      <Environment
        preset="warehouse"
        resolution={128}
        environmentIntensity={0.32}
      />

      {DEFAULT_STAGE_ID === "factory_v1" ? <FactoryEnvironment /> : null}

      <CentrifugePlushieStation
        onPlushieClick={onPlushieClick}
        spawnAnchorRef={spoutSpawnRef}
      />

      <Physics
        gravity={[0, -16.2, 0]}
        colliders={false}
        numSolverIterations={3}
        numAdditionalFrictionIterations={2}
      >
        <FactoryPhysicsColliders />
        <DroppedPlushies spawnAnchorRef={spoutSpawnRef} />
      </Physics>

      <OrbitControls
        autoRotate={false}
        enablePan={false}
        enableZoom
        zoomSpeed={0.85}
        minDistance={1.75}
        maxDistance={9.5}
        minPolarAngle={Math.PI / 4.55}
        maxPolarAngle={Math.PI / 2.04}
        target={[0.28, 0.46, 0.2]}
        maxAzimuthAngle={Math.PI / 2.85}
        minAzimuthAngle={-Math.PI / 2.85}
        mouseButtons={{
          LEFT: MOUSE.ROTATE,
          MIDDLE: MOUSE.DOLLY,
          RIGHT: MOUSE.PAN,
        }}
      />
    </>
  );
}

export function onFactoryCanvasCreated(state: {
  gl: WebGLRenderer;
}): void {
  applyFactoryRendererDefaults(state.gl);
  const ctx = state.gl.getContext();
  if (ctx) scheduleRendererAdaptiveQuality(state.gl, ctx);
}
