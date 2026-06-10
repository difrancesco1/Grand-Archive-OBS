"use client"

import CardPopup from "./components/card-popup";
import PlayerDisplay from "./components/player-tracker/player-display";
import { useMatchState } from "./lib/match-state";

export default function Home() {
  const { state } = useMatchState();

  return (
    <div className="relative min-h-screen bg-transparent font-sans">
      {state && (
        <>
          <div className="fixed top-4 left-4 z-50">
            <PlayerDisplay player={state.players["1"]} side="left" />
          </div>
          <div className="fixed top-4 right-4 z-50">
            <PlayerDisplay player={state.players["2"]} side="right" />
          </div>
          <CardPopup card={state.popup_card} />
        </>
      )}
    </div>
  );
}
