"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CardSearchResult, searchCards } from "../../lib/api";

type CardQuickSearchProps = {
  onSelect: (card: { name: string; image: string | null }) => void;
};

const DEBOUNCE_MS = 250;

export default function CardQuickSearch({ onSelect }: CardQuickSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CardSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const found = await searchCards(trimmed, controller.signal);
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
  }, [query]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (result: CardSearchResult) => {
    onSelect({ name: result.name, image: result.image });
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder="Search any card to show..."
        className="w-full rounded-lg bg-[#2C2C2C] text-white text-sm px-3 py-2 border border-[#4C4C4C] outline-none focus:border-[#CAB378]"
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
            <li key={result.slug}>
              <button
                type="button"
                onClick={() => handleSelect(result)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-[#404040]"
              >
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-black/30">
                  {result.image && (
                    <Image
                      src={result.image}
                      alt={result.name}
                      fill
                      sizes="40px"
                      className="object-cover object-top"
                    />
                  )}
                </span>
                <span className="text-sm text-white">{result.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
