"use client";

interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  ringColor: string;
  barColor: string;
  size?: "sm" | "lg";
}

export function MacroRing({
  label,
  current,
  target,
  unit,
  ringColor,
  barColor,
  size = "sm",
}: MacroRingProps) {
  const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const radius = size === "lg" ? 54 : 36;
  const stroke = size === "lg" ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const dim = (radius + stroke) * 2;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg
          width={dim}
          height={dim}
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-slate-100"
          />
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${ringColor} transition-all duration-700 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold text-slate-800 ${size === "lg" ? "text-xl" : "text-sm"}`}
          >
            {Math.round(current)}
          </span>
          {size === "lg" && (
            <span className="text-xs text-slate-400">/ {target}</span>
          )}
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      {size === "sm" && (
        <span className="text-[10px] text-slate-400">
          {Math.round(current)}/{target} {unit}
        </span>
      )}
      <div className="mt-0.5 h-1 w-8 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
