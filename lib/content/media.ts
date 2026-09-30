/**
 * Превращает значение image-поля (путь в бакете или готовый https-URL)
 * в публичный URL. Работает и на сервере, и в браузере (превью в редакторе).
 */
export function mediaUrl(value: string, base: string): string {
  if (!value) return "";
  if (/^https:\/\//i.test(value)) return value;
  if (!base) return "";
  const encoded = value.split("/").map(encodeURIComponent).join("/");
  return `${base}/${encoded}`;
}

/** Номер для tel:-ссылки: оставляет только цифры и ведущий + */
export const toTelHref = (phone: string): string => phone.replace(/[^+\d]/g, "");

/** Фавиконка из логотипа через оптимизатор Next (64px вместо полноразмерного PNG) */
export const faviconUrl = (logoUrl: string): string | undefined =>
  logoUrl ? `/_next/image?url=${encodeURIComponent(logoUrl)}&w=64&q=75` : undefined;
