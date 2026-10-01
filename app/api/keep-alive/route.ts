import { createHash, timingSafeEqual } from "node:crypto";
import { pingDatabase } from "@/lib/supabase/keep-alive";

/**
 * GET /api/keep-alive - пинг базы Supabase, чтобы бесплатный проект не уходил
 * на паузу. Вызывается Vercel Cron дважды в сутки (vercel.json).
 *
 * Если задан CRON_SECRET, Vercel сам присылает `Authorization: Bearer <secret>`,
 * и без него запрос отклоняется. Без CRON_SECRET эндпоинт открыт - он безвреден
 * (обновляет одну строку heartbeat), зато cron не сломается из-за забытой переменной.
 */

export const dynamic = "force-dynamic";

const digest = (value: string): Buffer => createHash("sha256").update(value).digest();

function isAuthorized(header: string | null, secret: string): boolean {
  if (!header) return false;
  return timingSafeEqual(digest(header), digest(`Bearer ${secret}`));
}

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (secret && !isAuthorized(request.headers.get("authorization"), secret)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // Vercel Cron добавляет к своим запросам заголовок с расписанием
  const source = request.headers.has("x-vercel-cron-schedule") ? "vercel-cron" : "manual";
  const result = await pingDatabase(source);
  if (!result.ok) console.error("[keep-alive] ping failed", result.error);

  return Response.json(result, {
    status: result.ok ? 200 : 503,
    headers: { "Cache-Control": "no-store" },
  });
}
