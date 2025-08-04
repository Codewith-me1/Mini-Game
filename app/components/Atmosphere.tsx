import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, GodRays } from "@react-three/postprocessing";

const lightColor = new THREE.Color("#ffddaa");

// 1. Define an interface for the props our component will accept
interface LightBulbProps {
  position: [number, number, number];
}

// 2. Update the forwardRef signature to use our new props interface
const LightBulb = React.forwardRef<THREE.Mesh, LightBulbProps>((props, ref) => {
  const pointLightRef = useRef<any>(null);
  useFrame(() => {
    if (pointLightRef.current) {
      if (Math.random() > 0.97) {
        pointLightRef.current.intensity = 20 + Math.random() * 20;
      } else {
        pointLightRef.current.intensity = THREE.MathUtils.lerp(
          pointLightRef.current.intensity,
          25,
          0.02
        );
      }
    }
  });

  return (
    // 3. The `...props` spread now correctly includes the typed `position` prop
    <mesh {...props} ref={ref}>
      <pointLight
        ref={pointLightRef}
        // ✅ The biggest optimization: turn off expensive shadows for these lights
        castShadow={false}
        color={lightColor}
        intensity={25}
        distance={15}
      />
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial
        color={lightColor}
        emissive={lightColor}
        emissiveIntensity={2}
      />
    </mesh>
  );
});
LightBulb.displayName = "LightBulb";

export function Atmosphere() {
  const lightRefs = useMemo(
    () => Array.from({ length: 6 }, () => React.createRef<THREE.Mesh>()),
    []
  );

  return (
    <>
      <ambientLight intensity={0.01} />

      <LightBulb ref={lightRefs[0]} position={[-15, 4.5, -15]} />
      <LightBulb ref={lightRefs[1]} position={[15, 4.5, -15]} />
      <LightBulb ref={lightRefs[2]} position={[-15, 4.5, 15]} />
      <LightBulb ref={lightRefs[3]} position={[15, 4.5, 15]} />
      <LightBulb ref={lightRefs[4]} position={[0, 4.5, -15]} />
      <LightBulb ref={lightRefs[5]} position={[0, 4.5, 15]} />

      <EffectComposer>
        <Bloom
          intensity={0.5} // The bloom intensity.
          luminanceThreshold={0.2} // A threshold to filter out weak lights
          luminanceSmoothing={0.9} // smoothness of the luminance threshold.
          height={1000} // render height
        />
      </EffectComposer>
    </>
  );
}
