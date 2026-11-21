"use client"

import { PlayerState } from "../../lib/match-state";
import ChampionContainer from "./champion-container";
import LifeTracker from "./life-tracker";
import PlayerBanner from "./player-banner";

const DEFAULT_MAX_HEALTH = 30;

type PlayerDisplayProps = {
  player: PlayerState;
  side?: "left" | "right";
};

export default function PlayerDisplay({ player, side = "left" }: PlayerDisplayProps) {
  const champion = player.champion;
  const profile = player.profile;
  const maxHealth = champion?.life ?? DEFAULT_MAX_HEALTH;

  return (
    <div className="flex flex-col h-full gap-3 p-3">
      <ChampionContainer
        image={champion?.image}
        name={champion?.name}
        life={champion?.life}
        wins={player.wins}
        side={side}
      />
      <LifeTracker damage={player.damage} maxHealth={maxHealth} />
      <PlayerBanner
        playerName={profile?.username ?? player.name}
        omniId={profile?.omni_id}
        avatarImage={profile?.avatar_image}
      />
    </div>
  );
}
