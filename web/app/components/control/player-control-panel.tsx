"use client"

import Image from "next/image";
import { useState } from "react";
import { MatchActions, PlayerId, PlayerState } from "../../lib/match-state";
import ChampionSearch from "../player-tracker/champion-search";
import PlayerSearch from "../player-tracker/player-search";

const DEFAULT_MAX_HEALTH = 30;
const MAX_WINS = 2;

type PlayerControlPanelProps = {
  playerId: PlayerId;
  player: PlayerState;
  actions: MatchActions;
  eventId: string;
};

export default function PlayerControlPanel({
  playerId,
  player,
  actions,
  eventId,
}: PlayerControlPanelProps) {
  const [name, setName] = useState(player.name);
  const champion = player.champion;
  const profile = player.profile;
  const maxHealth = champion?.life ?? DEFAULT_MAX_HEALTH;
  const currentHealth = Math.max(0, maxHealth - player.damage);

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-[#1E1E1E] border border-[#3A3A3A] p-5">
      
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[#CAB378]">
        Player {playerId}
      </h2>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-zinc-400">GA Player</span>
        <PlayerSearch
          eventId={eventId}
          onSelect={(selected) => {
            setName(selected.username);
            actions.setPlayerProfile(playerId, selected);
          }}
        />
        {profile && (
          <div className="flex items-center gap-3 rounded-lg bg-[#2C2C2C] px-3 py-2">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-black/30">
              {profile.avatar_image && (
                <Image
                  src={profile.avatar_image}
                  alt={profile.username}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              )}
              {profile.avatar_frame && (
                <Image
                  src={profile.avatar_frame}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              )}
            </span>
            <div className="flex-1">
              <p className="text-sm text-white">{profile.username}</p>
              <p className="text-xs text-zinc-400">
                #{profile.omni_id}
                {profile.country ? ` · ${profile.country}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => actions.clearPlayerProfile(playerId)}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="flex flex-col gap-1 text-xs text-zinc-400">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                actions.setName(playerId, e.target.value);
              }}
              className="rounded-lg bg-[#2C2C2C] text-white text-sm px-3 py-2 border border-[#4C4C4C] outline-none focus:border-[#CAB378]"
            />
          </label>
          <label htmlFor="champion" className="text-xs text-zinc-400">Champion
            <ChampionSearch
              onSelect={(selected) => actions.setChampion(playerId, selected)}
            />
          </label>
        </div>
        
        {champion && (
          <div className="flex items-center gap-3 rounded-lg bg-[#2C2C2C] px-3 py-2">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-black/30">
              {champion.image && (
                <Image
                  src={champion.image}
                  alt={champion.name}
                  fill
                  sizes="48px"
                  className="object-cover object-top"
                />
              )}
            </span>
            <div className="flex-1">
              <p className="text-sm text-white">{champion.name}</p>
              <p className="text-xs text-zinc-400">Life {champion.life ?? "-"}</p>
            </div>
            <button
              type="button"
              onClick={() => actions.setChampion(playerId, null)}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">Life</span>
          <span className="text-sm font-bold tabular-nums text-white">
            {currentHealth}/{maxHealth}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => actions.removeDamage(playerId)}
            className="flex-1 rounded-lg bg-[#3A3A3A] py-2 text-lg font-bold text-green-400 hover:bg-[#4A4A4A]"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => actions.addDamage(playerId)}
            className="flex-1 rounded-lg bg-[#3A3A3A] py-2 text-lg font-bold text-red-400 hover:bg-[#4A4A4A]"
          >
            -
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">Match wins</span>
          <span className="text-sm font-bold tabular-nums text-white">
            {player.wins}/{MAX_WINS}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => actions.addWin(playerId)}
            className="flex-1 rounded-lg bg-[#3A3A3A] py-2 text-lg font-bold text-white hover:bg-[#4A4A4A]"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => actions.removeWin(playerId)}
            className="flex-1 rounded-lg bg-[#3A3A3A] py-2 text-lg font-bold text-white hover:bg-[#4A4A4A]"
          >
            -
          </button>

        </div>
      </div>
    </div>
  );
}
