/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional GLB/GLTF under `public/` (e.g. `/models/teddy.glb`). Omitted = built-in teddy. */
  readonly VITE_TEDDY_GLTF_URL?: string;
}
