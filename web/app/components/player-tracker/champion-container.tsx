"use client"

import Image from "next/image";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MatchWinCounter from "./match-win-counter";

type ChampionContainerProps = {
  image?: string | null;
  name?: string;
  life?: number | null;
  wins: number;
  side?: "left" | "right";
};

export default function ChampionContainer({
  image,
  name,
  life,
  wins,
  side = "left",
}: ChampionContainerProps) {
  const isRight = side === "right";

  return (
    <div className="flex flex-col w-full shrink-0">
      <div className="w-full aspect-[3/4] overflow-hidden relative z-10 border-3 border-[var(--accent)]">
        <Image
          src={image || "/Diana.jpg"}
          alt={name || "Champion"}
          fill
          className="object-cover scale-[2] origin-[center_16%]"
          sizes="480px"
          priority
        />
      </div>
      <div className="w-full text-center border-3 border-t-0 border-[var(--accent)] py-1 px-1">
        <span className="text-[var(--text)] text-md font-bold leading-tight">{name || "Champion Name"}</span>
      </div>
      <div className={`w-full flex items-center justify-between gap-2 relative px-1 mt-2 ${isRight ? "flex-row-reverse" : ""}`}>
        <MatchWinCounter wins={wins} side={side} />
        <Image src="/firetransparent.png" alt="Fire Icon" width={30} height={30} unoptimized className="absolute top-[-12] left-1/2 -translate-x-1/2"/>
        <div className="flex items-center gap-1 px-3 bg-[var(--accent-soft)] text-sm">
          <FavoriteIcon sx={{ color: "#FFFFFF", fontSize: 16 }} />
          <span className="font-bold">{life ?? "15"}</span>
        </div>
      </div>
    </div>
  );
}
