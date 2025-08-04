"use client";

import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { Player } from "./components/Player";
import { Ground } from "./components/Ground";
import { Enemy } from "./components/Enemy";
import { UI } from "./components/UI";
import { useGameStore } from "./store/useGameStore";
import { useShallow } from "zustand/shallow";
import { Crosshair } from "./components/Crosshhair";
import { Walls } from "./components/Walls";
import { Lights } from "./components/Lights";
import * as THREE from "three";
import { Jumpscare } from "./components/Jumpscare";
import { Atmosphere } from "./components/Atmosphere";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "w", "W"] },
  { name: "backward", keys: ["ArrowDown", "s", "S"] },
  { name: "left", keys: ["ArrowLeft", "a", "A"] },
  { name: "right", keys: ["ArrowRight", "d", "D"] },
];

function GameScene() {
  const enemies = useGameStore((state) => state.enemies);

  return (
    <Suspense fallback={null}>
      <fog attach="fog" args={["#000000", 10, 35]} />

      {/* <Lights /> */}
      <Atmosphere />
      <Physics gravity={[0, -9.81, 0]}>
        <Player />
        {enemies.map((enemy) => (
          <Enemy
            key={enemy.id}
            id={enemy.id}
            initialPosition={enemy.position}
            type={enemy.type}
          />
        ))}
        <Ground />
        <Walls />
      </Physics>
    </Suspense>
  );
}

function StartOverlay() {
  const { isGameActive } = useGameStore(
    useShallow((state) => ({
      isGameActive: state.isGameActive,
    }))
  );
  if (isGameActive) return null;
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <h1 className="text-4xl text-white font-mono">Click to Play</h1>
    </div>
  );
}

export default function Home() {
  const startGame = useGameStore((state) => state.actions.startGame);
  return (
    <div className="w-screen h-screen">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows={{ type: THREE.PCFSoftShadowMap }}
          onClick={() => {
            const { isGameActive } = useGameStore.getState();
            if (!isGameActive) {
              startGame();
            }
          }}
        >
          <GameScene />
        </Canvas>
      </KeyboardControls>
      <UI />
      <StartOverlay />
      <Crosshair />
      <Jumpscare />
    </div>
  );
}
