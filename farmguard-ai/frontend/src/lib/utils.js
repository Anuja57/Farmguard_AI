import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

