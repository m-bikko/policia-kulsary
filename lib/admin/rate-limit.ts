/**
 * Защита PIN от перебора: после 5 неверных попыток с одного IP вход
 * блокируется на 15 минут. Счётчик живёт в памяти процесса - на serverless
 * он сбрасывается при холодном старте, но всё равно резко замедляет перебор
 * (вместе с задержкой на каждую неверную попытку).
 */

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

type Entry = { failures: number; lockedUntil: number };
const attempts = new Map<string, Entry>();

export function lockRemainingMinutes(ip: string): number {
  const entry = attempts.get(ip);
  if (!entry || entry.lockedUntil <= Date.now()) return 0;
  return Math.ceil((entry.lockedUntil - Date.now()) / 60000);
}

export function registerFailure(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip);
  const failures = (entry && entry.lockedUntil <= now ? entry.failures : 0) + 1;
  attempts.set(ip, {
    failures: failures >= MAX_ATTEMPTS ? 0 : failures,
    lockedUntil: failures >= MAX_ATTEMPTS ? now + LOCK_MS : 0,
  });
}

export function registerSuccess(ip: string): void {
  attempts.delete(ip);
}
