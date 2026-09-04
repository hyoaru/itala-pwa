import { useMemo } from "react";

function getGreeting(): string {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 12) return "Good morning";
  if (hours >= 12 && hours < 18) return "Good afternoon";
  return "Good evening";
}

export function useGreeting() {
  return useMemo(getGreeting, []);
}
