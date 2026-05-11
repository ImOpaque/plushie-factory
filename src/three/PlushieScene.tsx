import { useMemo, useRef } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Group, MOUSE, Vector3, type WebGLRenderer } from "three";
import { DEFAULT_STAGE_ID } from "../data/stageEnvironments";
import { useSceneExtrasMerged } from "../hooks/useSceneLayoutTransform";
import { useSceneEditorStore } from "../stores/sceneEditorStore";
import { CentrifugePlushieStation } from "./CentrifugePlushieStation";
import { DroppedPlushies } from "./DroppedPlushies";
import { FactoryEnvironment, applyFactoryRendererDefaults } from "./FactoryEnvironment";
import { scheduleRendererAdaptiveQuality } from "./factoryRendererProfile";
import { FactoryPhysicsColliders } from "./FactoryPhysicsColliders";
import { SceneLayoutEntity } from "./sceneEditor/SceneLayoutEntity";
import { SceneLayoutTransformOnly } from "./sceneEditor/SceneLayoutTransformOnly";

type PlushieSceneProps = {
  onPlushieClick: () => void;
};

/**
 * Factory conveyor stage, bright cartoon-friendly lighting, plushie centerpiece.
 */
export function PlushieScene({ onPlushieClick }: PlushieSceneProps) {
  const spoutSpawnRef = useRef<Group>(null);
  const gizmoDragging = useSceneEditorStore((s) => s.gizmoDragging);
  const extras = useSceneExtrasMerged();
  const orbitTarget = useMemo(() => new Vector3(0.28, 0.46, 0.2), []);

  return (
    <>
      <color attach="background" args={["#12151c"]} />

      <SceneLayoutEntity id="light_hemisphere">
        <hemisphereLight args={["#b8c8f0", "#2a2420", 0.55]} />
      </SceneLayoutEntity>
      <ambientLight intensity={extras.ambientIntensity} color="#d8e4ff" />

      <SceneLayoutEntity id="light_key">
        <directionalLight
          castShadow
          position={[0, 0, 0]}
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
      </SceneLayoutEntity>

      <SceneLayoutEntity id="light_fill">
        <directionalLight position={[0, 0, 0]} intensity={0.42} color="#9ec0ff" />
      </SceneLayoutEntity>

      <SceneLayoutEntity id="light_point">
        <pointLight position={[0, 0, 0]} intensity={0.38} color="#ffe8d0" distance={14} decay={2} />
      </SceneLayoutEntity>

      <Environment
        preset="warehouse"
        resolution={128}
        environmentIntensity={extras.envIntensity}
      />

      {DEFAULT_STAGE_ID === "factory_v1" ? (
        <SceneLayoutEntity id="factory_stage">
          <FactoryEnvironment />
        </SceneLayoutEntity>
      ) : null}

      <SceneLayoutEntity id="machine">
        <CentrifugePlushieStation onPlushieClick={onPlushieClick} />
      </SceneLayoutEntity>

      <SceneLayoutEntity id="spout_anchor">
        <group ref={spoutSpawnRef} name="spout_spawn" />
      </SceneLayoutEntity>

      <Physics
        gravity={[0, -16.2, 0]}
        colliders={false}
        numSolverIterations={3}
        numAdditionalFrictionIterations={2}
      >
        {DEFAULT_STAGE_ID === "factory_v1" ? (
          <SceneLayoutTransformOnly id="factory_stage">
            <FactoryPhysicsColliders />
          </SceneLayoutTransformOnly>
        ) : null}
        <DroppedPlushies spawnAnchorRef={spoutSpawnRef} />
      </Physics>

      <OrbitControls
        enabled={!gizmoDragging}
        autoRotate={false}
        enablePan={false}
        enableZoom
        zoomSpeed={0.85}
        minDistance={1.75}
        maxDistance={9.5}
        minPolarAngle={Math.PI / 4.55}
        maxPolarAngle={Math.PI / 2.04}
        target={orbitTarget}
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
