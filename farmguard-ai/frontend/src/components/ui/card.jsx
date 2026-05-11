import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("glass-panel rounded-3xl p-6 shadow-glow", className)} {...props} />;
}

