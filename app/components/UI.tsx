import { useGameStore } from "../store/useGameStore";
import { useShallow } from "zustand/shallow";

export function UI() {
  const { ammo, wave } = useGameStore(
    useShallow((state) => ({
      ammo: state.ammo,
      wave: state.wave,
    }))
  );

  return (
    <div className="fixed top-0 left-0 z-10 p-4 font-mono text-lg text-white">
      <div>Wave: {wave}</div>
      <div>Ammo: {ammo}</div>
      {/* All conditional screens have been removed */}
    </div>
  );
}
