import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useKeyboardControls, PointerLockControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useGameStore } from "../store/useGameStore";
import { Bullet } from "./Bullet";
import { useShallow } from "zustand/shallow";

const MOVE_SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export function Player() {
  const controlsRef = useRef<any>(null);
  const body = useRef<any>(null);
  const { camera } = useThree();
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [bullets, setBullets] = useState<any[]>([]);

  const { shoot, ammo, isGameActive, wave } = useGameStore(
    useShallow((state) => ({
      shoot: state.actions.shoot,
      ammo: state.ammo,
      isGameActive: state.isGameActive,
      wave: state.wave,
    }))
  );
  const [muzzleFlash, setMuzzleFlash] = useState(false);

  // ✅ This effect now unlocks the cursor whenever the game is not active
  useEffect(() => {
    if (!isGameActive && controlsRef.current?.isLocked) {
      controlsRef.current.unlock();
    }
  }, [isGameActive]);

  useEffect(() => {
    if (wave === 1 && body.current) {
      body.current.setTranslation({ x: 0, y: 1, z: 0 }, true);
      body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, [wave]);

  useFrame((state) => {
    if (!isGameActive || !body.current) return;
    const { forward, backward, left, right } = getKeys();
    frontVector.set(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    sideVector.set((left ? 1 : 0) - (right ? 1 : 0), 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(MOVE_SPEED)
      .applyEuler(state.camera.rotation);
    body.current.setLinvel(
      { x: direction.x, y: body.current.linvel().y, z: direction.z },
      true
    );
    const playerPosition = body.current.translation();
    state.camera.position.set(
      playerPosition.x,
      playerPosition.y + 0.8,
      playerPosition.z
    );
  });

  useEffect(() => {
    const handleShoot = () => {
      // Use the isGameActive flag from the store to control shooting
      if (
        document.pointerLockElement &&
        useGameStore.getState().ammo > 0 &&
        useGameStore.getState().isGameActive
      ) {
        useGameStore.getState().actions.shoot();
        new Audio("/gunshot.mp3").play();
        setMuzzleFlash(true);
        setTimeout(() => setMuzzleFlash(false), 50);

        const newBulletId = Date.now();
        const playerPosition = body.current.translation();
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);

        setBullets((prev) => [
          ...prev,
          {
            id: newBulletId,
            position: playerPosition,
            direction: cameraDirection,
          },
        ]);
      }
    };

    document.addEventListener("mousedown", handleShoot);
    return () => document.removeEventListener("mousedown", handleShoot);
  }, [camera]); // Dependencies are simplified as state is read directly

  return (
    <>
      <PointerLockControls ref={controlsRef} />
      <RigidBody
        ref={body}
        name="player_body"
        position={[0, 1, 0]}
        colliders="cuboid"
        lockRotations
      >
        <mesh castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="lightblue" visible={false} />
          {muzzleFlash && (
            <pointLight
              position={[0, 0.2, -0.6]}
              intensity={50}
              color="yellow"
              distance={1}
            />
          )}
        </mesh>
      </RigidBody>
      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          position={bullet.position}
          direction={bullet.direction}
        />
      ))}
    </>
  );
}
