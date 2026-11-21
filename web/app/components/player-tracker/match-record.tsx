"use client"

type MatchRecordProps = {
  wins: number;
  losses: number;
};

export default function MatchRecord({ wins, losses }: MatchRecordProps) {
  return (
    <div className="w-full grid grid-cols-2 shrink-0 border-3 border-[var(--accent)] bg-[var(--surface)]">
      <div className="flex items-baseline justify-center gap-1.5 py-1">
        <span className="text-sm font-bold text-[#4E8A62]">W</span>
        <span className="text-3xl font-bold tabular-nums leading-none text-[var(--text)]">{wins}</span>
      </div>
      <div className="flex items-baseline justify-center gap-1.5 py-1 border-l-3 border-[var(--accent)]">
        <span className="text-sm font-bold text-[#A65A4E]">L</span>
        <span className="text-3xl font-bold tabular-nums leading-none text-[var(--text)]">{losses}</span>
      </div>
    </div>
  );
}
