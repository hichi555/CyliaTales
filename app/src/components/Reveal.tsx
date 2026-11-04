import type { ElementType, ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Rendered element — defaults to a plain div. */
  as?: ElementType;
  /** Stagger the entrance, in milliseconds, for sequential reveals. */
  delay?: number;
};

/**
 * Wraps marketing-page content with a single, tasteful fade/slide-up
 * entrance the first time it scrolls into view. Pure presentation — never
 * gates content on JS, since useInView falls back to "already in view" for
 * both prefers-reduced-motion and the (rare) no-IntersectionObserver case.
 */
export function Reveal({ children, className, as: Tag = "div", delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out",
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
