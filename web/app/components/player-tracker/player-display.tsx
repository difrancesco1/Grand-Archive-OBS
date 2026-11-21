"use client"

import { PlayerState, Spirit } from "../../lib/match-state";
import ChampionContainer from "./champion-container";
import LifeTracker from "./life-tracker";
import MatchRecord from "./match-record";
import PlayerBanner from "./player-banner";

const DEFAULT_MAX_HEALTH = 15;

const SPIRIT_BACKGROUNDS: Record<Spirit, string> = {
  fire: "linear-gradient(to bottom, #100B09 0%, #2B1610 25%, #391D12 45%, #9B663D 75%, #DAB565 100%)",
  water: "url(/spirits/water-bg.jpg) center / cover no-repeat",
  wind: "url(/spirits/wind-bg.jpg) center / cover no-repeat",
};

type PlayerDisplayProps = {
  player: PlayerState;
  opponentWins: number;
};

export default function PlayerDisplay({ player, opponentWins }: PlayerDisplayProps) {
  const champion = player.champion;
  const profile = player.profile;
  const maxHealth = champion?.life ?? DEFAULT_MAX_HEALTH;
  const background = player.spirit ? SPIRIT_BACKGROUNDS[player.spirit] : undefined;

  return (
    <div className="h-full overflow-hidden" style={{ background }}>
      <div className="flex flex-col h-full gap-3 p-3">
        <ChampionContainer image={champion?.image} name={champion?.name} spirit={player.spirit} />
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
