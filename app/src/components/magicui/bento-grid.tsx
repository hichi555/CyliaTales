import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function BentoGrid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-4 md:grid-cols-3", className)} {...props} />;
}

export function BentoCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <article className={cn("group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-lg", className)} {...props} />;
}
