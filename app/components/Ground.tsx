import { RigidBody } from "@react-three/rapier";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Ground() {
  // Load the floor texture
  const floorTexture = useTexture("/floor_texture.jpg");
  // Allow the texture to repeat
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(25, 25); // Repeat the texture 25 times in each direction

  return (
    <RigidBody type="fixed" restitution={0.1} position={[0, -0.5, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[50, 1, 50]} />
        {/* Apply the texture via the 'map' property */}
        <meshStandardMaterial map={floorTexture} color="gray" />
      </mesh>
    </RigidBody>
  );
}
