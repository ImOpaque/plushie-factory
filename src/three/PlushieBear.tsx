import { Suspense, useRef } from "react";
import type { RefObject } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Group } from "three";
import { ClassicTeddyBearContent } from "./PlushieBearClassic";
import { PlushieBearGltf } from "./PlushieBearGltf";

type PlushieBearProps = {
  onPlushieClick: () => void;
  /** Passed through to GLB normalization (ignored for classic mesh). */
  gltfFitTargetMaxDim?: number;
  /** When set, drag on the plush rotates this group; light taps still count as clicks. */
  dragRotateParentRef?: RefObject<Group>;
};

const GLTF_URL = import.meta.env.VITE_TEDDY_GLTF_URL?.trim();

const BASE_Y = 0.05;
const BOB_AMP = 0.038;
const BOB_FREQ = 1.75;
const TAP_MOVE_PX = 12;

/**
 * Clickable plush: optional external GLB (`VITE_TEDDY_GLTF_URL`), otherwise the
 * built-in classic teddy with cartoon outlines on body/head.
 */
export function PlushieBear({
  onPlushieClick,
  gltfFitTargetMaxDim,
  dragRotateParentRef,
}: PlushieBearProps) {
  const rootRef = useRef<Group>(null);
  const squashRef = useRef(0);
  const pointerDragRef = useRef<{
    pointerId: number;
    lastX: number;
    lastY: number;
    totalMove: number;
  } | null>(null);

  useFrame((state, delta) => {
    const root = rootRef.current;
    if (!root) return;

    const t = state.clock.elapsedTime;
    root.position.y = BASE_Y + Math.sin(t * BOB_FREQ) * BOB_AMP;

    squashRef.current = Math.max(0, squashRef.current - delta * 3.8);
    const k = squashRef.current;
    root.scale.set(1 + k * 0.12, 1 - k * 0.14, 1 + k * 0.08);
  });

  const captureTarget = (e: ThreeEvent<PointerEvent>) => {
    const el = e.nativeEvent?.target;
    if (el && "setPointerCapture" in el && typeof el.setPointerCapture === "function") {
      el.setPointerCapture(e.pointerId);
    }
  };

  const releaseCapture = (e: ThreeEvent<PointerEvent>) => {
    const el = e.nativeEvent?.target;
    if (el && "releasePointerCapture" in el && typeof el.releasePointerCapture === "function") {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
  };

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    squashRef.current = 1;
    if (!dragRotateParentRef) {
      onPlushieClick();
    }
    pointerDragRef.current = {
      pointerId: e.pointerId,
      lastX: e.clientX,
      lastY: e.clientY,
      totalMove: 0,
    };
    captureTarget(e);
  };

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    const s = pointerDragRef.current;
    if (!s || e.pointerId !== s.pointerId) return;
    if ((e.buttons & 1) === 0) return;

    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.totalMove += Math.abs(dx) + Math.abs(dy);

    const parent = dragRotateParentRef?.current;
    if (parent && s.totalMove > TAP_MOVE_PX) {
      parent.rotation.y -= dx * 0.0065;
      parent.rotation.x -= dy * 0.0065;
      parent.rotation.x = Math.max(-0.82, Math.min(0.82, parent.rotation.x));
    }
  };

  const endPointer = (e: ThreeEvent<PointerEvent>) => {
    const s = pointerDragRef.current;
    if (!s || e.pointerId !== s.pointerId) return;
    pointerDragRef.current = null;
    releaseCapture(e);
    if (dragRotateParentRef && s.totalMove <= TAP_MOVE_PX) {
      onPlushieClick();
    }
  };

  return (
    <group
      ref={rootRef}
      position={[0, BASE_Y, 0]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onPointerLeave={(e) => {
        if (pointerDragRef.current?.pointerId === e.pointerId) {
          releaseCapture(e);
          pointerDragRef.current = null;
        }
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {GLTF_URL ? (
        <Suspense
          fallback={
            <Html center>
              <span className="rounded-lg border border-white/10 bg-surface-card px-3 py-1.5 font-body text-xs text-silver-muted">
                Loading plush…
              </span>
            </Html>
          }
        >
          <PlushieBearGltf url={GLTF_URL} fitTargetMaxDim={gltfFitTargetMaxDim} />
        </Suspense>
      ) : (
        <ClassicTeddyBearContent />
      )}
    </group>
  );
}
