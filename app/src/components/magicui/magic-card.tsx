import { useState, type HTMLAttributes, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

export function MagicCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  }

  return (
    <div
      className={cn("magic-card group relative overflow-hidden rounded-2xl border bg-card", className)}
      onMouseMove={handleMove}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at ${position.x}px ${position.y}px, color-mix(in oklch, var(--accent) 18%, transparent), transparent 68%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
