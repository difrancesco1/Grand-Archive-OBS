"use client"

import { useEffect, useState } from "react";
import CardQuickSearch from "../components/control/card-quick-search";
import PlayerControlPanel from "../components/control/player-control-panel";
import { useMatchState } from "../lib/match-state";

export default function ControlPage() {
  const { state, connected, actions } = useMatchState();
  const [duration, setDuration] = useState("8");

  useEffect(() => {
    if (state) setDuration(String(state.card_display_seconds));
  }, [state?.card_display_seconds]);

  return (
    <main className="min-h-screen bg-[#121212] text-white p-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#CAB378]">
            Grand Archive Controller
          </h1>
          <span
            className={`flex items-center gap-2 text-xs ${
              connected ? "text-green-400" : "text-red-400"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                connected ? "bg-green-400" : "bg-red-400"
              }`}
            />
            {connected ? "Connected" : "Disconnected"}
          </span>
        </header>

        {!state ? (
          <p className="text-sm text-zinc-400">Connecting to match server...</p>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              <PlayerControlPanel
                playerId="1"
                player={state.players["1"]}
                actions={actions}
              />
              <PlayerControlPanel
                playerId="2"
                player={state.players["2"]}
                actions={actions}
              />
            </div>

            <section className="flex flex-col gap-4 rounded-xl bg-[#1E1E1E] border border-[#3A3A3A] p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#CAB378]">
                Card Spotlight
              </h2>
              <CardQuickSearch onSelect={(card) => actions.showCard(card)} />
              <div className="flex flex-wrap items-end gap-4">
                <label className="flex flex-col gap-1 text-xs text-zinc-400">
                  Display duration (seconds)
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    onBlur={() => {
                      const seconds = parseFloat(duration);
                      if (!Number.isNaN(seconds)) actions.setCardDuration(seconds);
                    }}
                    className="w-32 rounded-lg bg-[#2C2C2C] text-white text-sm px-3 py-2 border border-[#4C4C4C] outline-none focus:border-[#CAB378]"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => actions.clearCard()}
                  className="rounded-lg bg-[#3A3A3A] px-4 py-2 text-sm hover:bg-[#4A4A4A]"
                >
                  Hide card now
                </button>
              </div>
            </section>

            <section className="flex items-center justify-between rounded-xl bg-[#1E1E1E] border border-[#3A3A3A] p-5">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[#CAB378]">
                  Match
                </h2>
                <p className="text-xs text-zinc-400">
                  Resets life for both players. Keeps names, wins, and champions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => actions.nextMatch()}
                className="rounded-lg bg-[#CAB378] px-5 py-2 text-sm font-semibold text-black hover:bg-[#d8c592]"
              >
                Next match
              </button>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
