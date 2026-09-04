import { useAuthenticationSessionContext } from "@/infrastructure/contexts/authentication-session";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useState } from "react";

const THEME_MODES = [
  { id: "default", label: "Default", light: "light", dark: "dark" },
  { id: "jiya", label: "Jiya", light: "jiya-light", dark: "jiya-dark" },
] as const;

const ALLOWED_EMAILS = ["dGhlLmphZGVjYWJyZXJhQGdtYWlsLmNvbQ=="] as const;

const MODE_KEY = "theme-mode";
const LIGHT_DARK_KEY = "theme-light-dark";

type ModeId = (typeof THEME_MODES)[number]["id"];
type LightDarkPref = "light" | "dark" | "system";

function getOsPreference(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(
  modeId: ModeId,
  lightDarkPref: LightDarkPref,
  osPreference: "light" | "dark",
): string {
  const mode = THEME_MODES.find((m) => m.id === modeId) ?? THEME_MODES[0]!;
  const shade = lightDarkPref === "system" ? osPreference : lightDarkPref;
  return shade === "dark" ? mode.dark : mode.light;
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function useThemeMode() {
  const { user } = useAuthenticationSessionContext();
  const { resolvedTheme, setTheme } = useTheme();

  const [activeModeId, setActiveModeId] = useState<ModeId>(() =>
    readStorage<ModeId>(MODE_KEY, "default"),
  );
  const [lightDarkPref, setLightDarkPref] = useState<LightDarkPref>(() =>
    readStorage<LightDarkPref>(LIGHT_DARK_KEY, "system"),
  );
  const [osPreference, setOsPreference] = useState<"light" | "dark">(
    () => (typeof window !== "undefined" ? getOsPreference() : "light"),
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      setOsPreference(e.matches ? "dark" : "light");
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    setTheme(resolveTheme(activeModeId, lightDarkPref, osPreference));
  }, [activeModeId, lightDarkPref, osPreference, setTheme]);

  useEffect(() => {
    const isDark = resolvedTheme?.endsWith("-dark");
    document.documentElement.classList.toggle("dark", !!isDark);
  }, [resolvedTheme]);

  const isAllowedUser = useMemo(
    () =>
      user?.email != null &&
      ALLOWED_EMAILS.some((hash) => user.email === atob(hash)),
    [user?.email],
  );

  const onModeChange = useCallback((modeId: string) => {
    setActiveModeId(modeId as ModeId);
    writeStorage(MODE_KEY, modeId);
  }, []);

  const onLightDarkChange = useCallback((pref: string) => {
    setLightDarkPref(pref as LightDarkPref);
    writeStorage(LIGHT_DARK_KEY, pref);
  }, []);

  const isLightDarkActive = useCallback(
    (pref: string) => lightDarkPref === pref,
    [lightDarkPref],
  );

  return {
    modes: THEME_MODES,
    isAllowedUser,
    currentMode: activeModeId,
    onModeChange,
    onLightDarkChange,
    isLightDarkActive,
  };
}
