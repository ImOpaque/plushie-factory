import { resolveMachineGltfUrl } from "../data/machineModel";
import { CentrifugeMachineGltfWithBoundary } from "./CentrifugeMachineGltf";
import { CentrifugePlushieStationProcedural } from "./CentrifugePlushieStationProcedural";

type CentrifugePlushieStationProps = {
  onPlushieClick: () => void;
};

/**
 * Plushie machine: loads `public/models/machine.glb` by default (scene editor **machine** moves the whole root).
 * Set `VITE_MACHINE_GLTF_URL=0` to force the built-in procedural fallback only.
 */
export function CentrifugePlushieStation({ onPlushieClick }: CentrifugePlushieStationProps) {
  const url = resolveMachineGltfUrl();
  if (!url) {
    return <CentrifugePlushieStationProcedural onPlushieClick={onPlushieClick} />;
  }
  return <CentrifugeMachineGltfWithBoundary url={url} onPlushieClick={onPlushieClick} />;
}
