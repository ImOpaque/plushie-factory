/**
 * Custom machine GLB under `public/` (default: `/models/machine.glb`).
 * Set `VITE_MACHINE_GLTF_URL=0` (or `false` / `no` / `off`) to use the built-in procedural machine only.
 */
export function resolveMachineGltfUrl(): string | null {
  const raw = import.meta.env.VITE_MACHINE_GLTF_URL?.trim();
  if (!raw) return "/models/machine.glb";
  const lower = raw.toLowerCase();
  if (lower === "0" || lower === "false" || lower === "no" || lower === "off") return null;
  return raw;
}
