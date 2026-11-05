import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type NumberTickerProps = {
  value: number;
  decimalPlaces?: number;
  className?: string;
};

export function NumberTicker({ value, decimalPlaces = 0, className }: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = displayValue;
    const distance = value - start;
    if (Math.abs(distance) < 0.01) {
      setDisplayValue(value);
      return;
    }
    const startedAt = performance.now();
    const duration = 420;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + distance * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span className={cn("tabular-nums", className)}>
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      })}
    </span>
  );
}
