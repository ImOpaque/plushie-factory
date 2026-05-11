import { getGPUTier } from "detect-gpu";
import {
  ACESFilmicToneMapping,
  BasicShadowMap,
  PCFShadowMap,
  SRGBColorSpace,
} from "three";
import type { WebGLRenderer } from "three";

/**
 * Baseline Three settings for the factory canvas (sync).
 */
export function applyFactoryRendererDefaults(gl: WebGLRenderer): void {
  try {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.12;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = PCFShadowMap;
    gl.outputColorSpace = SRGBColorSpace;
    const pr =
      typeof window !== "undefined"
        ? Math.min(window.devicePixelRatio ?? 1, 1.45)
        : 1;
    gl.setPixelRatio(pr);
  } catch (e) {
    console.error("[applyFactoryRendererDefaults]", e);
  }
}

/**
 * Async GPU tier (detect-gpu): downgrades shadows + pixel ratio on weak GPUs.
 */
export function scheduleRendererAdaptiveQuality(
  gl: WebGLRenderer,
  glContext: WebGLRenderingContext | WebGL2RenderingContext
): void {
  void getGPUTier({ glContext })
    .then((info) => {
      const tier = typeof info.tier === "number" ? info.tier : 2;
      if (tier <= 1) {
        gl.setPixelRatio(1);
        gl.shadowMap.type = BasicShadowMap;
      } else if (tier <= 2) {
        gl.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 1.2));
        gl.shadowMap.type = BasicShadowMap;
      }
      gl.shadowMap.needsUpdate = true;
    })
    .catch((e) => {
      console.warn("[scheduleRendererAdaptiveQuality] detect-gpu failed", e);
    });
}
