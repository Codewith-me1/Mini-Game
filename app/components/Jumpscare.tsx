import { useGameStore } from "../store/useGameStore";

export function Jumpscare() {
  const jumpscare = useGameStore((state) => state.jumpscare);

  if (!jumpscare.active || !jumpscare.image) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black animate-pulse"
      style={{
        backgroundImage: `url(${jumpscare.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
