"use client"

type MatchWinCounterProps = {
  wins: number;
  maxWins?: number;
  side?: "left" | "right";
};

export default function MatchWinCounter({
  wins,
  maxWins = 2,
  side = "left",
}: MatchWinCounterProps) {
  const isRight = side === "right";

  return (
    <div
      className={`flex items-center gap-2 absolute bottom-[-18] z-11 ${
        isRight ? "right-4 flex-row-reverse" : "left-4"
      }`}
    >
      {Array.from({ length: maxWins }).map((_, i) => {
        const filled = i < wins;
        return (
          <div
            key={i}
            aria-label={filled ? "Match won" : "Match not won"}
            className={`w-6 h-6 rotate-45 transition-colors duration-200 border ${
              filled
                ? "bg-green-500 border-green-900 shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                : "bg-neutral-400 border-neutral-700"
            }`}
          />
        );
      })}
    </div>
  );
}
