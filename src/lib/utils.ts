import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function replacer(key: string, value: unknown): unknown {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  }
  return value;
}

export function reviver(key: string, value: any): unknown {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map" && Array.isArray(value.value)) {
      return new Map(value.value);
    }
  }
  return value;
}
