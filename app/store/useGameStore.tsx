import { create } from "zustand";
import { ENEMY_TYPES } from "../config/enemies";

interface EnemyState {
  id: number;
  position: [number, number, number];
  type: number;
}

interface GameState {
  ammo: number;
  wave: number;
  enemies: EnemyState[];
  // 1. We no longer need 'gameOver' or 'victory' states, it's always 'playing'
  gameState: "playing";
  isGameActive: boolean;
  jumpscare: { active: boolean; image: string | null };
  actions: {
    shoot: () => void;
    addAmmo: (amount: number) => void;
    enemyDefeated: (enemyId: number) => void;
    spawnWave: (waveNumber: number) => void;
    gameOver: (enemyType: number) => void;
    restart: () => void;
    startGame: () => void;
  };
}

const MAX_WAVE = 10;

const useGameStore = create<GameState>((set, get) => ({
  ammo: 20,
  wave: 0,
  enemies: [],
  gameState: "playing",
  isGameActive: false,
  jumpscare: { active: false, image: null },
  actions: {
    shoot: () => {
      set((state) => ({ ammo: Math.max(0, state.ammo - 1) }));
    },
    addAmmo: (amount) => {
      set((state) => ({ ammo: state.ammo + amount }));
    },
    enemyDefeated: (enemyId) => {
      get().actions.addAmmo(Math.floor(Math.random() * 3) + 1);
      const remainingEnemies = get().enemies.filter(
        (enemy) => enemy.id !== enemyId
      );
      set({ enemies: remainingEnemies });

      if (remainingEnemies.length === 0) {
        if (get().wave >= MAX_WAVE) {
          // 2. On victory, wait 1.5s then automatically restart
          setTimeout(() => get().actions.restart(), 1500);
        } else {
          setTimeout(() => {
            get().actions.spawnWave(get().wave + 1);
          }, 1000);
        }
      }
    },
    spawnWave: (waveNumber) => {
      const enemyTypesToSpawn = Math.min(
        Math.floor(waveNumber / 3) + 1,
        ENEMY_TYPES.length
      );
      const newEnemies = Array.from({ length: waveNumber * 2 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 15 + Math.random() * 5;
        return {
          id: Date.now() + i,
          position: [Math.cos(angle) * radius, 1, Math.sin(angle) * radius] as [
            number,
            number,
            number
          ],
          type: Math.floor(Math.random() * enemyTypesToSpawn),
        };
      });
      set({ enemies: newEnemies, wave: waveNumber });
    },
    gameOver: (enemyType) => {
      // Prevent gameOver from being called multiple times
      if (!get().isGameActive) return;
      set({ isGameActive: false });

      new Audio("/jumpscare-sound.mp3").play();
      const enemyData = ENEMY_TYPES.find((e) => e.type === enemyType);
      set({ jumpscare: { active: true, image: enemyData?.image || null } });

      // 3. After the jumpscare, automatically restart the game
      setTimeout(() => {
        set({ jumpscare: { active: false, image: null } });
        get().actions.restart();
      }, 700);
    },
    restart: () => {
      set({
        ammo: 20,
        wave: 0,
        enemies: [],
        gameState: "playing",
        isGameActive: false,
      });
    },
    startGame: () => {
      set({ isGameActive: true });
      if (get().wave === 0) {
        get().actions.spawnWave(1);
      }
    },
  },
}));

export { useGameStore };
