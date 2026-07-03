import type { Locale } from "./config";
import type { Dictionary } from "./types";
import { kz } from "./dictionaries/kz";
import { ru } from "./dictionaries/ru";
import { en } from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { kz, ru, en };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export type { Dictionary } from "./types";
export * from "./config";
