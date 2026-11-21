"use client"

import Image from "next/image";
import { Spirit } from "../../lib/match-state";

const SPIRIT_ART: Record<Spirit, { image: string; name: string }> = {
  fire: { image: "/spirits/fire.png", name: "Spirit of Fire" },
  water: { image: "/spirits/water.jpg", name: "Spirit of Water" },
  wind: { image: "/spirits/wind.jpg", name: "Spirit of Wind" },
};

type ChampionContainerProps = {
  image?: string | null;
  name?: string;
  spirit?: Spirit | null;
};

export default function ChampionContainer({ image, name, spirit }: ChampionContainerProps) {
  const spiritArt = !image && !name && spirit ? SPIRIT_ART[spirit] : null;

  return (
    <div className="flex flex-col w-full shrink-0">
      <div className="w-full aspect-[3/4] overflow-hidden relative z-10 border-3 border-[var(--accent)]">
        {spiritArt ? (
          <Image
            src={spiritArt.image}
            alt={spiritArt.name}
            fill
            className="object-cover"
            sizes="240px"
            priority
          />
        ) : (
          <Image
            src={image || "/Diana.jpg"}
            alt={name || "Champion"}
            fill
            className="object-cover scale-[2] origin-[center_16%]"
            sizes="480px"
            priority
          />
        )}
      </div>
      <div className="w-full text-center border-3 border-t-0 border-[var(--accent)] bg-[var(--surface)] py-1 px-1">
        <span className="text-[var(--text)] text-md font-bold leading-tight">
          {spiritArt?.name ?? name ?? "Champion Name"}
        </span>
      </div>
    </div>
  );
}
