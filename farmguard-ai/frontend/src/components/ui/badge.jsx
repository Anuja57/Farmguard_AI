import { cn } from "../../lib/utils";

export function Badge({ className, children }) {
  return (
    <span className={cn("inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800", className)}>
      {children}
    </span>
  );
}

