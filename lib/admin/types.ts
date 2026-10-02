/** Коды ошибок server actions - клиент переводит их на язык админки */
export type AdminErrorCode =
  | "unauthorized"
  | "not_configured"
  | "conflict"
  | "invalid_file"
  | "file_too_large"
  | "not_found"
  | "server";

export type LoginState =
  | { status: "idle" }
  | { status: "error"; reason: "wrong_pin" | "locked" | "not_configured"; minutes?: number };

export type SaveResult =
  | { ok: true; version: string }
  | { ok: false; error: AdminErrorCode };

export type UploadResult =
  | { ok: true; path: string }
  | { ok: false; error: AdminErrorCode };

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;
