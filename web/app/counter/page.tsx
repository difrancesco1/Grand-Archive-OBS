"use client"

import { MatchActions, PlayerId, PlayerState } from "../lib/match-state";
import { useMatchState } from "../lib/match-state";

const PLAYER_COLORS: Record<PlayerId, string> = {
  "1": "#B33A3A",
  "2": "#3A5BB3",
};

type PlayerHalfProps = {
  playerId: PlayerId;
  player: PlayerState;
  actions: MatchActions;
  flipped: boolean;
};

function PlayerHalf({ playerId, player, actions, flipped }: PlayerHalfProps) {
  return (
    <div
      className="relative h-1/2 w-full overflow-hidden"
      style={{
        backgroundColor: PLAYER_COLORS[playerId],
        transform: flipped ? "rotate(180deg)" : undefined,
      }}
    >
      <button
        type="button"
        aria-label={`Increase Player ${playerId} damage`}
        onClick={() => actions.addDamage(playerId)}
        className="absolute inset-x-0 top-0 h-1/2 w-full select-none text-white/40 active:bg-white/10"
      >
      </button>

      <button
        type="button"
        aria-label={`Decrease Player ${playerId} damage`}
        onClick={() => actions.removeDamage(playerId)}
        className="absolute inset-x-0 bottom-0 h-1/2 w-full select-none text-white/40 active:bg-black/10"
      >
      </button>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-white/70">
          {player.name}
        </span>
        <span className="text-[28vh] font-bold leading-none tabular-nums text-white drop-shadow">
          {player.damage}
        </span>
      </div>
    </div>
  );
}

export default function CounterPage() {
  const { state, connected, actions } = useMatchState();

  return (
    <main
      className="fixed inset-0 flex h-screen w-screen flex-col overflow-hidden overscroll-none select-none bg-black"
      style={{ touchAction: "manipulation" }}
    >
      <span
        className={`pointer-events-none absolute left-1/2 top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-black/40 ${
          connected ? "bg-green-400" : "bg-red-400"
        }`}
        aria-label={connected ? "Connected" : "Disconnected"}
      />

      {!state ? (
        <div className="flex h-full w-full items-center justify-center bg-[#121212] text-sm text-zinc-400">
          Connecting to match server...
        </div>
      ) : (
        <>
          <PlayerHalf
            playerId="1"
            player={state.players["1"]}
            actions={actions}
            flipped
          />
          <PlayerHalf
            playerId="2"
            player={state.players["2"]}
            actions={actions}
            flipped={false}
          />
        </>
      )}
    </main>
  );
}
