import { Unbounded, Manrope } from "next/font/google";

/** Дисплейный шрифт для заголовков — поддерживает казахскую кириллицу (cyrillic-ext) */
export const unbounded = Unbounded({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  variable: "--font-unbounded",
  display: "swap",
});

/** Основной текстовый шрифт — поддерживает казахскую кириллицу (cyrillic-ext) */
export const manrope = Manrope({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const fontVariables = `${unbounded.variable} ${manrope.variable}`;
