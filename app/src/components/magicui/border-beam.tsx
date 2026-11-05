import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BorderBeamProps = HTMLAttributes<HTMLDivElement> & {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
};

export function BorderBeam({
  className,
  size = 120,
  duration = 8,
  delay = 0,
  colorFrom = "var(--accent)",
  colorTo = "var(--primary)",
  style,
  ...props
}: BorderBeamProps) {
  const beamStyle = {
    "--beam-size": `${size}px`,
    "--beam-duration": `${duration}s`,
    "--beam-delay": `${delay}s`,
    "--beam-from": colorFrom,
    "--beam-to": colorTo,
    ...style,
  } as CSSProperties;

  return <div aria-hidden="true" className={cn("border-beam", className)} style={beamStyle} {...props} />;
}
