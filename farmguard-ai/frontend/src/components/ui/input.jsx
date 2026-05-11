import { cn } from "../../lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm outline-none ring-brand-200 transition focus:ring-2",
        className
      )}
      {...props}
    />
  );
}

