import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useGLTF } from "@react-three/drei";
import type { Object3D } from "three";
import { Group } from "three";
import { PlushieBear } from "./PlushieBear";
import { CentrifugePlushieStationProcedural } from "./CentrifugePlushieStationProcedural";
import { applyMachineGltfShadowDefaults, fitMachineGltfToStage } from "./machineGltfPrepare";
import { SceneLayoutEntity } from "./sceneEditor/SceneLayoutEntity";

type MachineGltfProps = {
  url: string;
  onPlushieClick: () => void;
};

type BoundaryProps = { children: ReactNode; fallback: ReactNode };
type BoundaryState = { failed: boolean };

/**
 * If `machine.glb` fails to parse or render, swap to the built-in procedural machine.
 */
export class MachineGltfErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.warn("[MachineGltf] using procedural fallback:", error.message, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function CentrifugeMachineGltfInner({ url, onPlushieClick }: MachineGltfProps) {
  const gltf = useGLTF(url);
  const root = useMemo(() => gltf.scene.clone(true) as Object3D, [gltf.scene]);
  const userBearRotRef = useRef<Group>(null);

  useLayoutEffect(() => {
    try {
      applyMachineGltfShadowDefaults(root);
      fitMachineGltfToStage(root, 1.38, 0);
    } catch (e) {
      console.error("[CentrifugeMachineGltf] prepare failed", e);
    }
  }, [root]);

  return (
    <group name="plushie_maker_root">
      <primitive object={root} />
      <SceneLayoutEntity id="hero_bear" comboRef={userBearRotRef}>
        <group scale={0.34}>
          <PlushieBear
            onPlushieClick={onPlushieClick}
            gltfFitTargetMaxDim={0.66}
            dragRotateParentRef={userBearRotRef}
          />
        </group>
      </SceneLayoutEntity>
      <pointLight
        position={[0, 0.55, 0.15]}
        intensity={0.42}
        color="#22d0ff"
        distance={2.4}
        decay={2}
      />
    </group>
  );
}

export function CentrifugeMachineGltfWithBoundary({ url, onPlushieClick }: MachineGltfProps) {
  return (
    <MachineGltfErrorBoundary
      fallback={<CentrifugePlushieStationProcedural onPlushieClick={onPlushieClick} />}
    >
      <CentrifugeMachineGltfInner url={url} onPlushieClick={onPlushieClick} />
    </MachineGltfErrorBoundary>
  );
}
