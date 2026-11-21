"use client"

import Image from "next/image";
import FavoriteIcon from "@mui/icons-material/Favorite";

type ChampionContainerProps = {
  image?: string | null;
  name?: string;
  life?: number | null;
  omniId?: number | null;
  playerName?: string;
  avatarImage?: string | null;
  avatarFrame?: string | null;
};

export default function ChampionContainer({
  image,
  name,
  life,
  omniId,
  playerName,
  avatarImage,
  avatarFrame,
}: ChampionContainerProps) {

  return (
    <div className="flex flex-col items-center">
      <div className="w-45 h-45 overflow-hidden relative z-10 border-3 border-[var(--accent)]">
        <Image
          src={image || "/Diana.jpg"}
          alt={name || "Champion"}
          fill
          className="object-cover object-[center_26%] scale-140 origin-[center_26%]"
          sizes="140px"
          priority
        />
      </div>
      <div className="w-45 text-center border-3 border-t-0 border-[var(--accent)] py-1">
        <span className="text-[var(--text)] text-md font-bold">{name || "Champion Name"}</span>
      </div>
      <div className="w-full flex items-center justify-between gap-2 relative px-2">
        <div className="p-0 px-3 bg-[var(--accent-soft)] mt-1 text-sm">
          0 - 0
        </div>
        <Image src="/firetransparent.png" alt="Fire Icon" width={30} height={30} unoptimized className="absolute top-[-10] left-1/2 -translate-x-1/2"/>
        <div className="flex items-center gap-1 p-0 px-3 bg-[var(--accent-soft)] mt-1 text-sm">
          <FavoriteIcon sx={{ color: "#FFFFFF", fontSize: 16 }} />
          <span className="font-bold">{life ?? "15"}</span>
        </div>
      </div>

      {avatarImage && (
        <div className="w-45 h-15 relative aspect-square mt-2">
          <Image
            src={avatarImage}
            alt={name || "Player"}
            fill
            unoptimized
            className="object-cover opacity-80"
            sizes="180px"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center bg-gradient-to-t from-black/70 via-black/20 to-transparent">
            <span className="text-black text-md font-bold leading-tight">
              {playerName || "Player Name"}
            </span>
            {omniId != null && (
              <span className="text-xs text-black">#{omniId}</span>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
