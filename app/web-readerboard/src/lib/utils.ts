import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function withTimeout(
  before: (...inputs: any[]) => any,
  after: (...inputs: any[]) => any,
  timeout: number,
) {
  before();
  await new Promise((resolve) => setTimeout(resolve, timeout));
  after();
}
