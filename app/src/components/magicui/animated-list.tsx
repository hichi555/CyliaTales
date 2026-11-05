import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AnimatedList({ children, className }: { children: ReactNode[]; className?: string }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setVisible((current) => Math.min(children.length, current + 1)), 90);
    return () => window.clearInterval(timer);
  }, [children.length]);
  return (
    <div className={cn("space-y-2", className)}>
      {children.map((child, index) => (
        <div key={index} className={cn("transition-all duration-500", index < visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}>
          {child}
        </div>
      ))}
    </div>
  );
}
