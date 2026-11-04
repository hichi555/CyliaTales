import * as React from "react";

/**
 * Reports whether the attached element has scrolled into the viewport.
 * Used to drive one-time entrance animations on marketing pages. Fires
 * immediately (no observer) when the visitor has prefers-reduced-motion
 * set, so nothing ever depends on this for content visibility — it should
 * only ever gate a transform/opacity transition.
 */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px", ...options },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}
