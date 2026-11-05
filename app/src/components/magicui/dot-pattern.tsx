import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DotPatternProps = HTMLAttributes<HTMLDivElement> & {
  cr?: number;
  cx?: number;
  cy?: number;
  dotColor?: string;
};

export function DotPattern({
  className,
  cr = 1,
  cx = 1,
  cy = 1,
  dotColor = "currentColor",
  style,
  ...props
}: DotPatternProps) {
  const patternStyle = {
    "--dot-radius": cr,
    "--dot-x": `${cx}px`,
    "--dot-y": `${cy}px`,
    "--dot-color": dotColor,
    ...style,
  } as CSSProperties;

  return <div aria-hidden="true" className={cn("dot-pattern", className)} style={patternStyle} {...props} />;
}
