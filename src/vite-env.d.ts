/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional GLB/GLTF under `public/` (e.g. `/models/teddy.glb`). Omitted = built-in teddy. */
  readonly VITE_TEDDY_GLTF_URL?: string;
  /**
   * Machine GLB. Default `/models/machine.glb`. Set `0` / `false` / `no` / `off` to use procedural machine only.
   */
  readonly VITE_MACHINE_GLTF_URL?: string;
}
