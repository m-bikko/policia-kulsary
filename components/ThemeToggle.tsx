"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "jylyoi-theme";

/** Подписка на атрибут data-theme у <html> - источник правды о теме */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const isDarkNow = (): boolean => document.documentElement.dataset.theme === "dark";

/**
 * Переключатель светлой/тёмной темы. Светлая - по умолчанию;
 * тёмная включается атрибутом data-theme="dark" на <html>.
 */
export default function ThemeToggle({
  labelToDark,
  labelToLight,
}: {
  labelToDark: string;
  labelToLight: string;
}) {
  const dark = useSyncExternalStore(subscribe, isDarkNow, () => false);

  const toggle = () => {
    const next = !dark;
    if (next) {
      document.documentElement.dataset.theme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* приватный режим - тема просто не сохранится */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? labelToLight : labelToDark}
      title={dark ? labelToLight : labelToDark}
      className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gold-500/25 bg-navy-900/70 text-gold-400 transition-colors hover:border-gold-500/50 hover:text-gold-300"
    >
      {dark ? (
        <Sun className="h-4.5 w-4.5" aria-hidden />
      ) : (
        <Moon className="h-4.5 w-4.5" aria-hidden />
      )}
    </button>
  );
}
