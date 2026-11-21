"use client"

import Image from "next/image";
import { PlayerState, Spirit } from "../../lib/match-state";
import ChampionContainer from "./champion-container";
import LifeTracker from "./life-tracker";
import MatchRecord from "./match-record";
import PlayerBanner from "./player-banner";

const DEFAULT_MAX_HEALTH = 30;

const SPIRIT_BACKGROUNDS: Record<Spirit, string> = {
  fire: "/spirits/fire.png",
  water: "/spirits/water.jpg",
  wind: "/spirits/wind.jpg",
};

type PlayerDisplayProps = {
  player: PlayerState;
  opponentWins: number;
};

export default function PlayerDisplay({ player, opponentWins }: PlayerDisplayProps) {
  const champion = player.champion;
  const profile = player.profile;
  const maxHealth = champion?.life ?? DEFAULT_MAX_HEALTH;

  return (
    <div className="relative h-full overflow-hidden">
      {player.spirit && (
        <Image
          src={SPIRIT_BACKGROUNDS[player.spirit]}
          alt=""
          fill
          sizes="240px"
          className="object-cover"
          priority
        />
      )}
      <div className="relative flex flex-col h-full gap-3 p-3">
        <ChampionContainer image={champion?.image} name={champion?.name} />
        <MatchRecord wins={player.wins} losses={opponentWins} />
        <LifeTracker damage={player.damage} maxHealth={maxHealth} />
        <PlayerBanner
          playerName={profile?.username ?? player.name}
          omniId={profile?.omni_id}
          avatarImage={profile?.avatar_image}
        />
      </div>
    </div>
  );
}
