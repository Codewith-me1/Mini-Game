import { RigidBody } from "@react-three/rapier";
import { useGameStore } from "../store/useGameStore";

export function Bullet({
  position,
  direction,
}: {
  position: any;
  direction: any;
}) {
  const enemyDefeated = useGameStore((state) => state.actions.enemyDefeated);

  return (
    <RigidBody
      position={[position.x, position.y + 0.5, position.z]}
      colliders="ball"
      linearVelocity={[direction.x * 50, direction.y * 50, direction.z * 50]}
      // ✅ Enable Continuous Collision Detection to prevent tunneling
      ccd={true}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.userData?.type === "enemy") {
          new Audio("/enemy-dead.mp3").play();
          enemyDefeated(other.rigidBodyObject.userData.id);
        }
      }}
    >
      <mesh>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
    </RigidBody>
  );
}
