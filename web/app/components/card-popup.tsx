"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PopupCard } from "../lib/match-state";

type CardPopupProps = {
  card: PopupCard | null;
};

const FADE_MS = 400;

export default function CardPopup({ card }: CardPopupProps) {
  const [rendered, setRendered] = useState<PopupCard | null>(card);
  const [visible, setVisible] = useState(Boolean(card));
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (removeTimer.current) {
      clearTimeout(removeTimer.current);
      removeTimer.current = null;
    }

    if (card) {
      setRendered(card);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    setVisible(false);
    removeTimer.current = setTimeout(() => setRendered(null), FADE_MS);
    return () => {
      if (removeTimer.current) clearTimeout(removeTimer.current);
    };
  }, [card]);

  if (!rendered || !rendered.image) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 transition-all ease-out"
      style={{
        transitionDuration: `${FADE_MS}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <div className="relative w-72 aspect-[5/7] drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
        <Image
          src={rendered.image}
          alt={rendered.name}
          fill
          sizes="288px"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
