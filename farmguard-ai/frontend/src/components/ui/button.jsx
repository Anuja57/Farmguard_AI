import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-60",
  {
    variants: {
      variant: {
        default: "bg-brand-500 text-white hover:bg-brand-600",
        outline: "border border-brand-200 bg-white text-brand-700 hover:bg-brand-50",
        ghost: "text-brand-700 hover:bg-brand-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Button({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant }), className)} {...props} />;
}

