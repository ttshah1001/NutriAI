"use client";

interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export function MacroBar({
  label,
  current,
  target,
  unit,
  color,
}: MacroBarProps) {
  const percent = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const remaining = Math.max(target - current, 0);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="text-slate-500">
          <span className="font-medium text-slate-700">
            {Math.round(current * 10) / 10}
          </span>
          {" / "}
          {target} {unit}
          {remaining > 0 && (
            <span className="ml-1.5 text-slate-400">
              · {Math.round(remaining * 10) / 10} left
            </span>
          )}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
