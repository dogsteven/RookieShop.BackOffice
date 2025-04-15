import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function range(start: number, end: number): number[] {
  if (start > end) {
    return [];
  }

  return [...Array(end - start + 1).keys()].map(index => index + start);
}