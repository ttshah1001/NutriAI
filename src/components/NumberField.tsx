"use client";

import { useEffect, useState } from "react";

interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  placeholder?: string;
  "aria-label"?: string;
}

function normalizeDigits(raw: string): string {
  if (raw === "") return "";
  return raw.replace(/\D/g, "").replace(/^0+(\d)/, "$1");
}

export function NumberField({
  value,
  onChange,
  min,
  max,
  className = "input",
  placeholder,
  "aria-label": ariaLabel,
}: NumberFieldProps) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  const clamp = (num: number): number => {
    let result = num;
    if (min !== undefined) result = Math.max(min, result);
    if (max !== undefined) result = Math.min(max, result);
    return result;
  };

  const commit = (raw: string) => {
    if (raw === "") {
      const fallback = clamp(value || min || 0);
      setText(String(fallback));
      onChange(fallback);
      return;
    }
    const num = parseInt(raw, 10);
    if (isNaN(num)) {
      setText(String(value));
      return;
    }
    const clamped = clamp(num);
    setText(String(clamped));
    onChange(clamped);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeDigits(e.target.value);
    setText(normalized);

    if (normalized === "") return;

    const num = parseInt(normalized, 10);
    if (isNaN(num)) return;
    if (max !== undefined && num > max) return;

    onChange(clamp(num));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={text}
      onChange={handleChange}
      onBlur={() => commit(text)}
      className={className}
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  );
}
