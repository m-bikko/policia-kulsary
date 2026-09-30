import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { supabaseServiceKey } from "@/lib/supabase/env";

/**
 * Сессия редактора: после верного PIN ставится httpOnly-cookie с подписью
 * HMAC-SHA256 и сроком действия. Секрет подписи - ADMIN_SESSION_SECRET,
 * либо (если он не задан) производная от PIN и service-ключа: смена PIN
 * автоматически разлогинивает все устройства.
 */

const SESSION_COOKIE = "jp_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function signingSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET;
  if (explicit) return explicit;
  const pin = process.env.ADMIN_PIN ?? "";
  const service = supabaseServiceKey();
  return pin && service ? `${pin}:${service}` : "";
}

function hmac(secret: string, value: string): Buffer {
  return createHmac("sha256", secret).update(value).digest();
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Сравнение PIN за постоянное время (через HMAC, чтобы длины совпадали) */
export function isPinValid(input: string): boolean {
  const pin = process.env.ADMIN_PIN;
  if (!pin) return false;
  const key = "jp-pin-compare";
  return safeEqual(hmac(key, input), hmac(key, pin));
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PIN && signingSecret());
}

export async function createSession(): Promise<void> {
  const secret = signingSecret();
  if (!secret) throw new Error("Admin session secret is not configured");
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = String(expiresAt);
  const token = `${payload}.${hmac(secret, payload).toString("base64url")}`;
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function isAuthenticated(): Promise<boolean> {
  const secret = signingSecret();
  if (!secret) return false;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  return safeEqual(Buffer.from(signature, "base64url"), hmac(secret, payload));
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
