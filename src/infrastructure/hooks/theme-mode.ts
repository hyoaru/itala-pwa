import { useAuthenticationSessionContext } from "@/infrastructure/contexts/authentication-session";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

const THEME_MODES = [
  { id: "default", label: "Default" },
  { id: "jiya", label: "Jiya" },
] as const;

const ALLOWED_EMAILS = ["Z2hlYWNhc3NhbmRyYXRhbkBnbWFpbC5jb20="] as const;

const MODE_KEY = "theme-mode";

type ModeId = (typeof THEME_MODES)[number]["id"];

function readStorage(key: string, fallback: ModeId): ModeId {
  const raw = localStorage.getItem(key);
  return (raw ?? fallback) as ModeId;
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export function useThemeMode() {
  const { user } = useAuthenticationSessionContext();
  const { theme, setTheme } = useTheme();

  const [currentMode, setCurrentMode] = useState<ModeId>(() =>
    readStorage(MODE_KEY, "default"),
  );

  useEffect(() => {
    document.documentElement.dataset.mode = currentMode;
    writeStorage(MODE_KEY, currentMode);
  }, [currentMode]);

  const isAllowedUser = useMemo(
    () =>
      user?.email != null &&
      ALLOWED_EMAILS.some((hash) => user.email === atob(hash)),
    [user?.email],
  );

  return {
    modes: THEME_MODES,
    isAllowedUser,
    currentMode,
    onModeChange: (modeId: string) => setCurrentMode(modeId as ModeId),
    onLightDarkChange: setTheme,
    isLightDarkActive: (pref: string) => theme === pref,
  };
}
