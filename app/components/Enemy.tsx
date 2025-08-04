import { RigidBody } from "@react-three/rapier";
import { Image, PositionalAudio, Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useGameStore } from "../store/useGameStore";
import { useShallow } from "zustand/shallow";
import { ENEMY_TYPES } from "../config/enemies";

// ✅ CORRECTED LINE: The props object now includes `type`
export function Enemy({
  id,
  initialPosition,
  type,
}: {
  id: number;
  initialPosition: [number, number, number];
  type: number;
}) {
  const enemyRef = useRef<any>(null);
  const audioRef = useRef<any>(null);
  const { gameOver, isGameActive } = useGameStore(
    useShallow((state) => ({
      gameOver: state.actions.gameOver,
      isGameActive: state.isGameActive,
    }))
  );
  const enemyData = ENEMY_TYPES.find((e) => e.type === type) || ENEMY_TYPES[0];

  useEffect(() => {
    if (isGameActive && audioRef.current && !audioRef.current.isPlaying) {
      audioRef.current.play();
    }
  }, [isGameActive]);

  useFrame(({ scene }) => {
    if (!isGameActive || !enemyRef.current) return;
    const player = scene.getObjectByName("player_body");
    if (player) {
      const playerPosition = player.position;
      const enemyPosition = enemyRef.current.translation();
      const direction = new THREE.Vector3()
        .subVectors(playerPosition, enemyPosition)
        .normalize();
      const speed = 2;
      enemyRef.current.setLinvel(
        { x: direction.x * speed, y: 0, z: direction.z * speed },
        true
      );
    }
  });

  return (
    <RigidBody
      ref={enemyRef}
      name="enemy"
      position={initialPosition}
      colliders="cuboid"
      userData={{ type: "enemy", id: id }}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === "player_body") {
          gameOver(type);
        }
      }}
    >
      <Billboard>
        <Image url={enemyData.image} scale={[2, 2]} transparent />
      </Billboard>
      <PositionalAudio
        ref={audioRef}
        url={enemyData.sound}
        loop
        distance={10}
      />
    </RigidBody>
  );
}
