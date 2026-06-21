import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function applyWithDelay<T>(
  apply: () => T,
  timeout: number,
  cleanup: () => void,
) {
  const result = apply();
  await new Promise((resolve) => setTimeout(resolve, timeout));
  cleanup();

  return result;
}
