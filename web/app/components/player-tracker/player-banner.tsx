"use client"

import Image from "next/image";

type PlayerBannerProps = {
  playerName?: string;
  omniId?: number | null;
  avatarImage?: string | null;
};

export default function PlayerBanner({ playerName, omniId, avatarImage }: PlayerBannerProps) {
  return (
    <div className="w-full h-16 relative shrink-0 overflow-hidden border-3 border-[var(--accent)] bg-[var(--panel)]">
      {avatarImage && (
        <Image
          src={avatarImage}
          alt={playerName || "Player"}
          fill
          unoptimized
          className="object-cover opacity-80"
          sizes="240px"
        />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center bg-gradient-to-t from-black/80 via-black/30 to-transparent">
        <span className="text-white text-md font-bold leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          {playerName || "Player Name"}
        </span>
        {omniId != null && (
          <span className="text-xs text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">#{omniId}</span>
        )}
      </div>
    </div>
  );
}
