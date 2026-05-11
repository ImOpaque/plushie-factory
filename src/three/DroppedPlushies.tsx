import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Clone, useGLTF } from "@react-three/drei";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  useAfterPhysicsStep,
} from "@react-three/rapier";
import type { Group, Object3D } from "three";
import { Vector3 } from "three";
import { useGameStore } from "../stores/gameStore";
import { createPreparedPlushieGltfClone } from "./plushieGltfPrepare";
import { TinyPlushieVisual } from "./TinyPlushieVisual";

const GLTF_URL = import.meta.env.VITE_TEDDY_GLTF_URL?.trim();

const MAX_DROPS = 8;
const BELT_TOP_Y = -0.515;
const BELT_CENTER_Z = 0.25;
const BELT_HALF_X = 1.78;
const BELT_HALF_Z = 0.64;
const BELT_SURFACE_VX = 0.78;
/** Slide volume (world): under spout → belt. */
const SLIDE_X = { min: -0.52, max: 0.58 } as const;
const SLIDE_Z = { min: -0.05, max: 0.48 } as const;
const SLIDE_Y = { min: -0.66, max: -0.34 } as const;
/** Remove once deep in collection bin. */
const DESPAWN_X_MIN = 2.32;
const DESPAWN_BIN_DEPTH_Y = -0.46;
const DROP_GLTF_FIT = 0.13;

type DropItem = { id: string; position: Vector3 };

function randomId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type SingleDropProps = {
  item: DropItem;
  onRemove: (id: string) => void;
  gltfPrototype: Object3D | null;
};

function SingleDroppedPlushie({ item, onRemove, gltfPrototype }: SingleDropProps) {
  const rb = useRef<RapierRigidBody>(null);
  const seededImpulse = useRef(false);

  useFrame(() => {
    const body = rb.current;
    if (!body || seededImpulse.current) return;
    seededImpulse.current = true;
    body.wakeUp();
    const zBias = (BELT_CENTER_Z - item.position.z) * 0.4;
    body.setLinvel(
      {
        x: 0.06 + Math.random() * 0.1,
        y: -0.38 - Math.random() * 0.18,
        z: zBias + (Math.random() - 0.5) * 0.06,
      },
      true
    );
  });

  useAfterPhysicsStep(() => {
    const body = rb.current;
    if (!body) return;

    const t = body.translation();
    if (t.x > DESPAWN_X_MIN && t.y < DESPAWN_BIN_DEPTH_Y) {
      onRemove(item.id);
      return;
    }

    const v = body.linvel();

    const inSlide =
      t.x >= SLIDE_X.min &&
      t.x <= SLIDE_X.max &&
      t.z >= SLIDE_Z.min &&
      t.z <= SLIDE_Z.max &&
      t.y >= SLIDE_Y.min &&
      t.y <= SLIDE_Y.max;

    if (inSlide) {
      body.wakeUp();
      const dz = BELT_CENTER_Z - t.z;
      body.setLinvel(
        {
          x: v.x * 0.88 + 0.12,
          y: v.y * 0.82 - 0.22,
          z: v.z * 0.75 + dz * 0.55,
        },
        true
      );
      return;
    }

    const onBelt =
      t.y >= BELT_TOP_Y - 0.28 &&
      t.y <= BELT_TOP_Y + 0.38 &&
      Math.abs(t.z - BELT_CENTER_Z) < BELT_HALF_Z &&
      t.x > -BELT_HALF_X - 0.25 &&
      t.x < BELT_HALF_X + 0.75;

    if (!onBelt) return;

    body.wakeUp();

    const inBin = t.x > 1.82 && t.x < 2.52 && t.y < -0.4 && Math.abs(t.z - BELT_CENTER_Z) < 0.38;
    const carryBlend = inBin ? 0.22 : 0.38;
    const targetVx = inBin ? Math.min(v.x, 0.25) : BELT_SURFACE_VX;

    body.setLinvel(
      {
        x: v.x + (targetVx - v.x) * carryBlend,
        y: inBin ? v.y * 0.72 - 0.06 : v.y * 0.86,
        z: v.z * 0.78,
      },
      true
    );

    const w = body.angvel();
    body.setAngvel({ x: w.x * 0.91, y: w.y * 0.88, z: w.z * 0.91 }, true);
  });

  const useGltf = Boolean(gltfPrototype);

  return (
    <RigidBody
      ref={rb}
      position={[item.position.x, item.position.y, item.position.z]}
      colliders={false}
      linearDamping={0.12}
      angularDamping={0.65}
      restitution={0.06}
      friction={0.45}
      mass={0.38}
      canSleep
    >
      {useGltf ? (
        <CuboidCollider args={[0.085, 0.1, 0.07]} position={[0, 0.1, 0]} friction={0.55} />
      ) : (
        <CuboidCollider args={[0.065, 0.085, 0.055]} position={[0, 0.07, 0]} friction={0.55} />
      )}
      <group>
        {useGltf && gltfPrototype ? (
          <Clone object={gltfPrototype} deep castShadow={false} receiveShadow={false} />
        ) : (
          <TinyPlushieVisual />
        )}
      </group>
    </RigidBody>
  );
}

function useSpawnDrops(spawnAnchorRef: React.RefObject<Group>) {
  const plushieTapNonce = useGameStore((s) => s.plushieTapNonce);
  const lastNonce = useRef(plushieTapNonce);
  const [drops, setDrops] = useState<DropItem[]>([]);
  const spawnScratch = useRef(new Vector3());

  useFrame(() => {
    if (plushieTapNonce <= lastNonce.current) return;

    const anchor = spawnAnchorRef.current;
    if (!anchor) return;

    const missed = plushieTapNonce - lastNonce.current;
    lastNonce.current = plushieTapNonce;

    anchor.getWorldPosition(spawnScratch.current);

    setDrops((prev) => {
      const next = [...prev];
      for (let i = 0; i < missed; i++) {
        const p = spawnScratch.current.clone();
        p.x += (Math.random() - 0.5) * 0.05;
        p.y += (Math.random() - 0.5) * 0.03;
        p.z += (Math.random() - 0.5) * 0.05;
        next.push({ id: randomId(), position: p });
      }
      if (next.length > MAX_DROPS) next.splice(0, next.length - MAX_DROPS);
      return next;
    });
  });

  const remove = useCallback((id: string) => {
    setDrops((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { drops, remove };
}

function DroppedPlushiesGltfInner({
  url,
  spawnAnchorRef,
}: {
  url: string;
  spawnAnchorRef: React.RefObject<Group>;
}) {
  const gltf = useGLTF(url);
  const prototype = useMemo(
    () => createPreparedPlushieGltfClone(gltf.scene, DROP_GLTF_FIT, "none"),
    [gltf.scene]
  );

  const { drops, remove } = useSpawnDrops(spawnAnchorRef);

  return (
    <group name="dropped_plushies">
      {drops.map((item) => (
        <SingleDroppedPlushie
          key={item.id}
          item={item}
          onRemove={remove}
          gltfPrototype={prototype}
        />
      ))}
    </group>
  );
}

function DroppedPlushiesGltf({
  url,
  spawnAnchorRef,
}: {
  url: string;
  spawnAnchorRef: React.RefObject<Group>;
}) {
  return (
    <Suspense fallback={null}>
      <DroppedPlushiesGltfInner url={url} spawnAnchorRef={spawnAnchorRef} />
    </Suspense>
  );
}

function DroppedPlushiesTiny({ spawnAnchorRef }: { spawnAnchorRef: React.RefObject<Group> }) {
  const { drops, remove } = useSpawnDrops(spawnAnchorRef);
  return (
    <group name="dropped_plushies">
      {drops.map((item) => (
        <SingleDroppedPlushie
          key={item.id}
          item={item}
          onRemove={remove}
          gltfPrototype={null}
        />
      ))}
    </group>
  );
}

type DroppedPlushiesProps = {
  spawnAnchorRef: React.RefObject<Group>;
};

export function DroppedPlushies({ spawnAnchorRef }: DroppedPlushiesProps) {
  if (GLTF_URL) {
    return <DroppedPlushiesGltf url={GLTF_URL} spawnAnchorRef={spawnAnchorRef} />;
  }
  return <DroppedPlushiesTiny spawnAnchorRef={spawnAnchorRef} />;
}
