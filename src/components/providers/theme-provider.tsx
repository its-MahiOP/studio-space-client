"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "studiospace-theme";
/** Dispatched on `window` whenever this tab changes the theme. */
const THEME_EVENT = "studiospace-theme-change";

interface ThemeContextValue {
  theme: Theme;
  /** Flips light -> dark and dark -> light. */
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}

/**
 * The stored choice wins; otherwise the OS preference decides. This is the
 * single source of truth shared with the pre-paint script in the root layout,
 * so the class on <html> and React's view of the theme can never disagree.
 */
function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // Storage unavailable (locked-down privacy mode): fall through to OS.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Same value the inline theme script assumes before any JS runs. */
function getServerSnapshot(): Theme {
  return "light";
}

function applyThemeClass(theme: Theme) {
  // The `.dark` class on <html> cascades every design token (see globals.css).
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function subscribe(onStoreChange: () => void): () => void {
  // Covers our own writes, cross-tab `storage` events and OS preference flips.
  const handleChange = () => {
    applyThemeClass(readTheme());
    onStoreChange();
  };
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  window.addEventListener(THEME_EVENT, handleChange);
  window.addEventListener("storage", handleChange);
  media.addEventListener("change", handleChange);

  return () => {
    window.removeEventListener(THEME_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
    media.removeEventListener("change", handleChange);
  };
}

/**
 * Theme state for the toggling button. The actual light/dark switch is the
 * `.dark` class on <html>, applied before first paint by an inline script in
 * the root layout; this store subscribes React to the persisted choice so the
 * toggle stays in sync without any effects or hydration mismatches.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable: the class below still themes this visit.
    }
    applyThemeClass(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    const stored = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch {
        return null;
      }
    })();
    const current = isTheme(stored) ? stored : readTheme();
    setTheme(current === "dark" ? "light" : "dark");
  }, [setTheme]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }

  return context;
}
