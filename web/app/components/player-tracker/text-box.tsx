"use client"

type TextBoxProps = {
  side?: "left" | "right";
  championName?: string;
  playerName?: string;
};

export default function TextBox({
  side = "left",
  championName = "Select a champion",
  playerName = "Player",
}: TextBoxProps) {
  const isRight = side === "right";

  return (
    <div
      className={`w-65 h-17 bg-[#404040] absolute top-2 leading-tight flex flex-col justify-center z-9 border-1 border-[#4C4C4C] ${
        isRight
          ? "rounded-l-3xl right-[-14] pr-5 items-end text-right"
          : "rounded-r-3xl left-[-14] pl-5"
      }`}
    >
      <p className="text-lg text-[#CAB378]">{championName}</p>
      <p className="text-lg font-bold">{playerName}</p>
    </div>
  );
}
