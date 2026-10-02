"use client";

import { useCallback, useSyncExternalStore } from "react";

/*
 * Выбранная на карте область хранится в якоре адреса (/kz#atyrau, /edit#atyrau):
 * работает кнопка «назад», а лендинги и редактор могут вернуть на приближенную область.
 */
const HASH_EVENT = "kz-map-region";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener(HASH_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(HASH_EVENT, onChange);
  };
}

const readHash = (): string => decodeURIComponent(window.location.hash.slice(1));

/** [выбранная область | null, выбрать область (null - вся страна)] */
export function useRegionHash(validSlugs: ReadonlySet<string>): [string | null, (slug: string | null) => void] {
  const hash = useSyncExternalStore(subscribe, readHash, () => "");
  const select = useCallback((slug: string | null) => {
    const { pathname, search } = window.location;
    window.history.pushState(window.history.state, "", slug ? `${pathname}${search}#${slug}` : `${pathname}${search}`);
    window.dispatchEvent(new Event(HASH_EVENT));
  }, []);
  return [validSlugs.has(hash) ? hash : null, select];
}
