"use client";

import { useEffect, useRef, useState } from "react";

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
  const isFocused = useRef(false);

  useEffect(() => {
    if (!isFocused.current) {
      setText(String(value));
    }
  }, [value]);

  const clamp = (num: number): number => {
    let result = num;
    if (min !== undefined) result = Math.max(min, result);
    if (max !== undefined) result = Math.min(max, result);
    return result;
  };

  const commit = () => {
    if (text === "") {
      const fallback = clamp(min ?? value ?? 0);
      setText(String(fallback));
      onChange(fallback);
      return;
    }
    const num = parseInt(text, 10);
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

    if (normalized !== "" && max !== undefined) {
      const num = parseInt(normalized, 10);
      if (!isNaN(num) && num > max) return;
    }

    setText(normalized);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={text}
      onChange={handleChange}
      onFocus={() => {
        isFocused.current = true;
      }}
      onBlur={() => {
        isFocused.current = false;
        commit();
      }}
      className={className}
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  );
}
