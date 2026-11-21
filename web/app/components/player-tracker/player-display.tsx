"use client"

import { PlayerState } from "../../lib/match-state";
import ChampionContainer from "./champion-container";
import LifeTracker from "./life-tracker";

const DEFAULT_MAX_HEALTH = 30;

type PlayerDisplayProps = {
  player: PlayerState;
  side?: "left" | "right";
};

export default function PlayerDisplay({ player, side = "left" }: PlayerDisplayProps) {
  const isRight = side === "right";
  const champion = player.champion;
  const profile = player.profile;
  const maxHealth = champion?.life ?? DEFAULT_MAX_HEALTH;

  return (
    <div className={`flex relative h-full justify-center pt-8 ${isRight ? "flex-row-reverse" : ""}`}>
      <div className="flex flex-col items-center">
        <ChampionContainer
          image={champion?.image}
          name={champion?.name}
          life={champion?.life}
          omniId={profile?.omni_id}
          playerName={profile?.username ?? player.name}
          avatarImage={profile?.avatar_image}
          avatarFrame={profile?.avatar_frame}
        />
        <LifeTracker damage={player.damage} maxHealth={maxHealth} side={side} />
      </div>
    </div>
  );
}
