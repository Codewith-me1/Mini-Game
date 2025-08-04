import * as THREE from "three";
// 1. Import useRef and useFrame to manage the flickering effect
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const lightColor = new THREE.Color("#ffddaa");

function LightBulb(props: any) {
  // 2. Create a ref for the pointLight to access its properties
  const lightRef = useRef<any>(null);

  // 3. Add the flickering logic inside a useFrame hook
  useFrame((state) => {
    if (lightRef.current) {
      // Add a random flicker effect
      if (Math.random() > 0.95) {
        lightRef.current.intensity = 10 + Math.random() * 10;
      } else {
        // Slowly return to base intensity
        lightRef.current.intensity = THREE.MathUtils.lerp(
          lightRef.current.intensity,
          20,
          0.01
        );
      }
    }
  });

  return (
    <mesh {...props}>
      <pointLight
        ref={lightRef} // Attach the ref
        castShadow
        color={lightColor}
        intensity={20}
        distance={12}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.001}
      />
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color={lightColor} />
    </mesh>
  );
}

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.02} />
      {/* Place light bulbs around the room */}
      <LightBulb position={[-15, 4.5, -15]} />
      <LightBulb position={[15, 4.5, -15]} />
      <LightBulb position={[-15, 4.5, 15]} />
      <LightBulb position={[15, 4.5, 15]} />
      {/* 4. Add two more lights */}
      <LightBulb position={[0, 4.5, -15]} />
      <LightBulb position={[0, 4.5, 15]} />
    </>
  );
}
