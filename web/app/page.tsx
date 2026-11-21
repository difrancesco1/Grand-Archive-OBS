"use client"

import CardPopup from "./components/card-popup";
import PlayerDisplay from "./components/player-tracker/player-display";
import { useMatchState } from "./lib/match-state";

export default function Home() {
  const { state } = useMatchState();

  return (
    <div className="min-h-screen bg-transparent font-sans">
      {state && (
        <>
          <div className="fixed left-0 z-50 h-full bg-[#EEEEE8] w-1/8">
            <PlayerDisplay player={state.players["1"]} side="left" />
          </div>
          <div className="fixed right-0 z-50 h-full bg-[#EEEEE8] w-1/8">
            <PlayerDisplay player={state.players["2"]} side="right" />
          </div>
          <CardPopup card={state.popup_card} />
        </>
      )}
    </div>
  );
}
