"use client"

import { useCallback, useEffect, useRef, useState } from "react";

export type PlayerId = "1" | "2";

export type Champion = {
  name: string;
  slug: string;
  image: string | null;
  life: number | null;
};

export type PopupCard = {
  name: string;
  image: string | null;
  token: string;
};

export type PlayerState = {
  name: string;
  wins: number;
  damage: number;
  champion: Champion | null;
};

export type MatchSnapshot = {
  players: Record<PlayerId, PlayerState>;
  card_display_seconds: number;
  popup_card: PopupCard | null;
};

export type MatchActions = {
  setName: (player: PlayerId, name: string) => void;
  addWin: (player: PlayerId) => void;
  removeWin: (player: PlayerId) => void;
  addDamage: (player: PlayerId) => void;
  removeDamage: (player: PlayerId) => void;
  setDamage: (player: PlayerId, damage: number) => void;
  setChampion: (player: PlayerId, champion: Champion | null) => void;
  setCardDuration: (seconds: number) => void;
  showCard: (card: { name: string; image: string | null }) => void;
  clearCard: () => void;
  nextMatch: () => void;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

function wsUrl(): string {
  const base = API_BASE_URL.replace(/^http/, "ws").replace(/\/$/, "");
  return `${base}/ws`;
}

export function useMatchState(): {
  state: MatchSnapshot | null;
  connected: boolean;
  actions: MatchActions;
} {
  const [state, setState] = useState<MatchSnapshot | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closedRef = useRef(false);

  useEffect(() => {
    closedRef.current = false;

    const connect = () => {
      const socket = new WebSocket(wsUrl());
      socketRef.current = socket;

      socket.onopen = () => setConnected(true);
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === "state") {
            setState(message.state as MatchSnapshot);
          }
        } catch {
          // ignore malformed payloads
        }
      };
      socket.onclose = () => {
        setConnected(false);
        socketRef.current = null;
        if (!closedRef.current) {
          reconnectRef.current = setTimeout(connect, 1000);
        }
      };
      socket.onerror = () => socket.close();
    };

    connect();

    return () => {
      closedRef.current = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, []);

  const send = useCallback((action: string, payload: Record<string, unknown> = {}) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "action", action, payload }));
    }
  }, []);

  const actions: MatchActions = {
    setName: (player, name) => send("set_name", { player, name }),
    addWin: (player) => send("add_win", { player }),
    removeWin: (player) => send("remove_win", { player }),
    addDamage: (player) => send("add_damage", { player }),
    removeDamage: (player) => send("remove_damage", { player }),
    setDamage: (player, damage) => send("set_damage", { player, damage }),
    setChampion: (player, champion) => send("set_champion", { player, champion }),
    setCardDuration: (seconds) => send("set_card_duration", { seconds }),
    showCard: (card) => send("show_card", { card }),
    clearCard: () => send("clear_card"),
    nextMatch: () => send("next_match"),
  };

  return { state, connected, actions };
}
