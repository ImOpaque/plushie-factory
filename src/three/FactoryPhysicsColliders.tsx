import { CuboidCollider } from "@react-three/rapier";

/**
 * Static colliders: one continuous belt surface, rails, collection bin (no overlap with belt).
 */
export function FactoryPhysicsColliders() {
  return (
    <group name="factory_physics">
      <CuboidCollider
        position={[0.15, -0.545, 0.25]}
        args={[2.08, 0.03, 0.675]}
        friction={0.2}
        restitution={0.04}
      />
      <CuboidCollider
        position={[-1.95, -0.48, 0.25]}
        args={[0.03, 0.07, 0.725]}
        friction={0.4}
        restitution={0.08}
      />
      <CuboidCollider
        position={[1.95, -0.48, 0.25]}
        args={[0.03, 0.07, 0.725]}
        friction={0.4}
        restitution={0.08}
      />

      {/* Basket: floor below belt plane, walls clear of main belt span x < 1.82 */}
      <CuboidCollider
        position={[2.1, -0.585, 0.25]}
        args={[0.24, 0.045, 0.36]}
        friction={0.5}
        restitution={0.04}
      />
      <CuboidCollider
        position={[2.38, -0.455, 0.25]}
        args={[0.035, 0.2, 0.36]}
        friction={0.35}
        restitution={0.05}
      />
      <CuboidCollider
        position={[2.1, -0.455, 0.07]}
        args={[0.24, 0.2, 0.035]}
        friction={0.35}
        restitution={0.05}
      />
      <CuboidCollider
        position={[2.1, -0.455, 0.43]}
        args={[0.24, 0.2, 0.035]}
        friction={0.35}
        restitution={0.05}
      />
    </group>
  );
}
