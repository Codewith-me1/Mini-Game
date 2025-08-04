import React from "react";

export function Crosshair() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
      <div className="h-1 w-8 bg-white opacity-50"></div>
      <div className="absolute h-8 w-1 bg-white opacity-50"></div>
    </div>
  );
}
