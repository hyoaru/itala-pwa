import type { AuthenticatedSession } from "@/domain/entities";

type Listener = (session?: AuthenticatedSession) => void;

const listeners = {
  refreshed: new Set<Listener>(),
  expired: new Set<Listener>(),
};

export const sessionEvents = {
  on(event: "refreshed" | "expired", handler: Listener): () => void {
    listeners[event].add(handler);
    return () => {
      listeners[event].delete(handler);
    };
  },
  emit(event: "refreshed" | "expired", session?: AuthenticatedSession): void {
    listeners[event].forEach((h) => h(session));
  },
};
