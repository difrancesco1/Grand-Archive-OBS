"use client"

import Image from "next/image";

type ChampionContainerProps = {
  image?: string | null;
  name?: string;
};

export default function ChampionContainer({ image, name }: ChampionContainerProps) {
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
    </div>
  );
}
