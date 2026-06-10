"use client"

import { PlayerState } from "../../lib/match-state";
import ChampionContainer from "./champion-container";
import LifeTracker from "./life-tracker";
import MatchWinCounter from "./match-win-counter";
import TextBox from "./text-box";

const DEFAULT_MAX_HEALTH = 30;
const MAX_WINS = 2;

type PlayerDisplayProps = {
  player: PlayerState;
  side?: "left" | "right";
};

export default function PlayerDisplay({ player, side = "left" }: PlayerDisplayProps) {
  const isRight = side === "right";
  const champion = player.champion;
  const maxHealth = champion?.life ?? DEFAULT_MAX_HEALTH;

  return (
    <div className={`flex relative ${isRight ? "flex-row-reverse" : ""}`}>
      <ChampionContainer image={champion?.image} name={champion?.name} />
      <MatchWinCounter wins={player.wins} maxWins={MAX_WINS} side={side} />

      <div className="flex flex-col gap-2 relative">
        <TextBox
          side={side}
          championName={champion?.name}
          playerName={player.name}
        />
        <LifeTracker damage={player.damage} maxHealth={maxHealth} side={side} />
      </div>
    </div>
  );
}
