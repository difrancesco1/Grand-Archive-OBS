"use client"

import { useEffect, useRef, useState } from "react";

type LifeTrackerProps = {
  damage: number;
  maxHealth: number;
  side?: "left" | "right";
};

type FlashSegment = {
  id: number;
  leftPct: number;
  widthPct: number;
};

const FLASH_DURATION_MS = 900;

export default function LifeTracker({ damage, maxHealth, side = "left" }: LifeTrackerProps) {
  const isRight = side === "right";
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

    const rightPct = ((maxHealth - prev) / maxHealth) * 100;
    const leftPct = ((maxHealth - damage) / maxHealth) * 100;
    const id = ++flashIdRef.current;
    const segment: FlashSegment = {
      id,
      leftPct,
      widthPct: rightPct - leftPct,
    };

    setFlashes((current) => [...current, segment]);

    const timeout = setTimeout(() => {
      setFlashes((current) => current.filter((f) => f.id !== id));
    }, FLASH_DURATION_MS);

    return () => clearTimeout(timeout);
  }, [damage, maxHealth]);

  return (
    <div
      className={`w-58 h-14 bg-black/60 absolute bottom-5 leading-tight flex items-center gap-2 z-8 pt-3 ${
        isRight
          ? "rounded-l-2xl right-[-14] pr-5 pl-3 flex-row-reverse"
          : "rounded-r-2xl left-[-14] pl-5 pr-3"
      }`}
    >
      <div className="relative flex-1 h-6 bg-[#2C0000] rounded-md overflow-hidden">
        <div
          className={`absolute inset-y-0 bg-green-500 transition-[width] duration-300 ease-out z-0 ${
            isRight ? "right-0" : "left-0"
          }`}
          style={{ width: `${healthPercent}%` }}
        />
        {flashes.map((flash) => (
          <div
            key={flash.id}
            className="absolute inset-y-0 pointer-events-none z-10"
            style={{
              [isRight ? "right" : "left"]: `${flash.leftPct}%`,
              width: `${flash.widthPct}%`,
              animation: `damage-flash ${FLASH_DURATION_MS}ms ease-out forwards`,
            }}
          />
        ))}
      </div>
      <span
        className={`text-white text-sm font-bold tabular-nums min-w-[2.5rem] ${
          isRight ? "text-left" : "text-right"
        }`}
      >
        {currentHealth}/{maxHealth}
      </span>
    </div>
  );
}
