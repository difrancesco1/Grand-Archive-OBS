"use client"

import { useEffect, useRef, useState } from "react";

type LifeTrackerProps = {
  damage: number;
  maxHealth: number;
};

type FlashSegment = {
  id: number;
  bottomPct: number;
  heightPct: number;
};

const FLASH_DURATION_MS = 900;

function fillColor(percent: number) {
  if (percent > 50) return "#8DBF9A";
  if (percent > 25) return "#D9B66A";
  return "#C97A6B";
}

export default function LifeTracker({ damage, maxHealth }: LifeTrackerProps) {
  const currentHealth = Math.max(0, maxHealth - damage);
  const healthPercent =
    maxHealth > 0 ? Math.min(100, (currentHealth / maxHealth) * 100) : 0;

  const prevDamageRef = useRef(damage);
  const flashIdRef = useRef(0);
  const [flashes, setFlashes] = useState<FlashSegment[]>([]);

  useEffect(() => {
    const prev = prevDamageRef.current;
    prevDamageRef.current = damage;

    if (damage <= prev || maxHealth <= 0) return;

    const topPct = (Math.max(0, maxHealth - prev) / maxHealth) * 100;
    const bottomPct = (Math.max(0, maxHealth - damage) / maxHealth) * 100;
    const id = ++flashIdRef.current;
    const segment: FlashSegment = {
      id,
      bottomPct,
      heightPct: topPct - bottomPct,
    };

    setFlashes((current) => [...current, segment]);

    const timeout = setTimeout(() => {
      setFlashes((current) => current.filter((f) => f.id !== id));
    }, FLASH_DURATION_MS);

    return () => clearTimeout(timeout);
  }, [damage, maxHealth]);

  return (
    <div className="relative w-full flex-1 min-h-0 bg-[var(--surface)] overflow-hidden border-3 border-[var(--accent)]">
      <div
        className="absolute inset-x-0 bottom-0 transition-[height,background-color] duration-300 ease-out z-0"
        style={{ height: `${healthPercent}%`, backgroundColor: fillColor(healthPercent) }}
      />
      {flashes.map((flash) => (
        <div
          key={flash.id}
          className="absolute inset-x-0 pointer-events-none z-10"
          style={{
            bottom: `${flash.bottomPct}%`,
            height: `${flash.heightPct}%`,
            animation: `damage-flash ${FLASH_DURATION_MS}ms ease-out forwards`,
          }}
        />
      ))}
      {maxHealth > 0 && (
        <div
          className="absolute inset-0 pointer-events-none z-[5]"
          style={{
            backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.12) 1px, transparent 1px)",
            backgroundSize: `100% ${100 / maxHealth}%`,
            backgroundPosition: "bottom",
          }}
        />
      )}
      <div className="absolute inset-x-0 top-3 z-20 flex flex-col items-center text-[var(--text)]">
        <span className="text-6xl font-bold tabular-nums leading-none">{currentHealth}</span>
        <span className="text-sm font-bold tabular-nums mt-1">/ {maxHealth}</span>
      </div>
    </div>
  );
}
