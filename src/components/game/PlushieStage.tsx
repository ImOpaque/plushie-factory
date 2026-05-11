import { Suspense, useCallback, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Html, useGLTF } from "@react-three/drei";
import { AnimatePresence } from "framer-motion";
import { PlushieScene, onFactoryCanvasCreated } from "../../three/PlushieScene";
import { useGameStore } from "../../stores/gameStore";
import {
  FloatingClickPopup,
  type FloatingPopupItem,
} from "./FloatingClickPopup";

const POPUP_REMOVE_MS = 950;

const TEDDY_GLTF = import.meta.env.VITE_TEDDY_GLTF_URL?.trim();

export function PlushieStage() {
  const [popups, setPopups] = useState<FloatingPopupItem[]>([]);

  useEffect(() => {
    if (TEDDY_GLTF) {
      useGLTF.preload(TEDDY_GLTF);
    }
  }, []);

  const handlePlushieClick = useCallback(() => {
    const { clickValue, incrementPlushies } = useGameStore.getState();
    incrementPlushies();
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
    const offsetX = (Math.random() - 0.5) * 100;
    setPopups((prev) => [...prev, { id, amount: clickValue, offsetX }]);
    window.setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, POPUP_REMOVE_MS);
  }, []);

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col select-none">
      <p className="pointer-events-none absolute left-1/2 top-3 z-[1] -translate-x-1/2 text-center font-body text-[0.7rem] font-medium uppercase tracking-[0.2em] text-silver-muted">
        Click the plushie
      </p>

      <Canvas
        shadows
        className="touch-none min-h-[min(42vh,380px)] w-full flex-1 rounded-2xl ring-1 ring-white/[0.06]"
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        dpr={[1, 1.5]}
        camera={{ position: [2.35, 1.72, 3.25], fov: 33, near: 0.1, far: 80 }}
        onCreated={onFactoryCanvasCreated}
      >
        <Suspense
          fallback={
            <Html center>
              <span className="rounded-xl border border-white/[0.08] bg-surface-card/95 px-4 py-2 font-display text-sm text-silver-muted shadow-panel">
                Stitching 3D…
              </span>
            </Html>
          }
        >
          <AdaptiveDpr />
          <PlushieScene onPlushieClick={handlePlushieClick} />
        </Suspense>
      </Canvas>

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        aria-hidden
      >
        <AnimatePresence>
          {popups.map((item) => (
            <FloatingClickPopup key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
