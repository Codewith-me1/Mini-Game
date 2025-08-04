import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

const wallMaterial = new THREE.MeshStandardMaterial({ color: "#222" });
const wallSize = { x: 50, y: 5, z: 1 };

export function Walls() {
  return (
    <>
      <RigidBody type="fixed" position={[0, wallSize.y / 2, -25]}>
        <mesh material={wallMaterial} castShadow receiveShadow>
          <boxGeometry args={[wallSize.x, wallSize.y, wallSize.z]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, wallSize.y / 2, 25]}>
        <mesh material={wallMaterial} castShadow receiveShadow>
          <boxGeometry args={[wallSize.x, wallSize.y, wallSize.z]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[-25, wallSize.y / 2, 0]}>
        <mesh material={wallMaterial} castShadow receiveShadow>
          <boxGeometry args={[wallSize.z, wallSize.y, wallSize.x]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[25, wallSize.y / 2, 0]}>
        <mesh material={wallMaterial} castShadow receiveShadow>
          <boxGeometry args={[wallSize.z, wallSize.y, wallSize.x]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" position={[0, wallSize.y, 0]}>
        <mesh material={wallMaterial} receiveShadow>
          <boxGeometry args={[wallSize.x, wallSize.z, wallSize.x]} />
        </mesh>
      </RigidBody>
    </>
  );
}
