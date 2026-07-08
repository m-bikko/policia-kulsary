import { Montserrat, Manrope } from "next/font/google";

/**
 * Дисплейный шрифт для заголовков. Montserrat вместо Unbounded:
 * у Unbounded неполное покрытие казахских глифов (Қ, Ұ, Ә, Ң, Ө, Ү, Һ),
 * из-за чего в заголовках подмешивался fallback-шрифт.
 */
export const montserrat = Montserrat({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  variable: "--font-montserrat",
  display: "swap",
});

/** Основной текстовый шрифт - поддерживает казахскую кириллицу (cyrillic-ext) */
export const manrope = Manrope({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const fontVariables = `${montserrat.variable} ${manrope.variable}`;
