"use client"

import Image from "next/image";

type ChampionContainerProps = {
  image?: string | null;
  name?: string;
};

export default function ChampionContainer({ image, name }: ChampionContainerProps) {

  return (
    <div className="w-35 h-25 rounded-3xl overflow-hidden relative z-10 border-4 border-[#BB8D8B]">
      <Image
        src={image || "/Diana.jpg"}
        alt={name || "Champion"}
        fill
        className=
          
             "object-cover object-[center_19%] scale-135 origin-[center_15%]"
        
        sizes="140px"
        priority
      />
    </div>
  );
}
