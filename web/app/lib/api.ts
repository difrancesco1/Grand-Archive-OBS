const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type ChampionSearchResult = {
  name: string;
  slug: string;
  image: string | null;
};

export type CardSearchResult = {
  name: string;
  slug: string;
  image: string | null;
};

export type ChampionDetail = {
  name: string;
  slug: string;
  life: number | null;
  image: string | null;
  classes: string[];
  types: string[];
  element: string | null;
};

export async function searchChampions(
  query: string,
  signal?: AbortSignal
): Promise<ChampionSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `${API_BASE_URL}/api/champions/search?q=${encodeURIComponent(trimmed)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Champion search failed (${res.status})`);
  }
  return (await res.json()) as ChampionSearchResult[];
}

export async function searchCards(
  query: string,
  signal?: AbortSignal
): Promise<CardSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `${API_BASE_URL}/api/cards/search?q=${encodeURIComponent(trimmed)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Card search failed (${res.status})`);
  }
  return (await res.json()) as CardSearchResult[];
}

export async function getChampion(
  slug: string,
  signal?: AbortSignal
): Promise<ChampionDetail> {
  const url = `${API_BASE_URL}/api/champions/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Failed to load champion '${slug}' (${res.status})`);
  }
  return (await res.json()) as ChampionDetail;
}
