"use client"

import { useEffect, useRef, useState } from "react";
import {
  PlayerSearchResult,
  getPlayerAvatar,
  searchPlayers,
} from "../../lib/api";
import { PlayerProfile } from "../../lib/match-state";

type PlayerSearchProps = {
  eventId: string;
  onSelect: (profile: PlayerProfile) => void;
  side?: "left" | "right";
};

const DEBOUNCE_MS = 250;

export default function PlayerSearch({ eventId, onSelect, side = "left" }: PlayerSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlayerSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasEvent = eventId.trim().length > 0;

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || !hasEvent) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const found = await searchPlayers(eventId, trimmed, controller.signal);
        setResults(found);
        setError(null);
        setOpen(true);
      } catch {
        if (!controller.signal.aborted) {
          setError("Search failed");
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query, eventId, hasEvent]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = async (result: PlayerSearchResult) => {
    setQuery("");
    setResults([]);
    setOpen(false);
    let avatarImage: string | null = null;
    let avatarFrame: string | null = null;
    try {
      const avatar = await getPlayerAvatar(result.id);
      avatarImage = avatar.image;
      avatarFrame = avatar.frame;
    } catch {
      // Avatar is best-effort; still set the profile without it.
    }
    onSelect({
      omni_id: result.id,
      username: result.username,
      avatar_image: avatarImage,
      avatar_frame: avatarFrame,
      country: result.country,
    });
  };

  const isRight = side === "right";

  return (
    <div ref={containerRef} className={`relative w-64 ${isRight ? "ml-auto" : ""}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={hasEvent ? "Search player or Omni #..." : "Set an Event ID first"}
        disabled={!hasEvent}
        className="w-full rounded-lg bg-[#2C2C2C] text-white text-sm px-3 py-2 border border-[#4C4C4C] outline-none focus:border-[#CAB378] disabled:opacity-50"
      />
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
          ...
        </span>
      )}

      {open && (results.length > 0 || error) && (
        <ul className="absolute z-50 mt-1 w-full max-h-72 overflow-y-auto rounded-lg bg-[#2C2C2C] border border-[#4C4C4C] shadow-lg">
          {error && <li className="px-3 py-2 text-xs text-red-400">{error}</li>}
          {results.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                onClick={() => handleSelect(result)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-[#404040]"
              >
                <span className="text-sm text-white">{result.username}</span>
                <span className="text-xs text-zinc-400">
                  #{result.id}
                  {result.country ? ` · ${result.country}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
