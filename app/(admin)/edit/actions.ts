"use server";

import { randomUUID } from "node:crypto";
import { setTimeout as sleep } from "node:timers/promises";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import {
  createSession,
  destroySession,
  isAdminConfigured,
  isAuthenticated,
  isPinValid,
} from "@/lib/admin/session";
import { lockRemainingMinutes, registerFailure, registerSuccess } from "@/lib/admin/rate-limit";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  type LoginState,
  type SaveResult,
  type UploadResult,
} from "@/lib/admin/types";
import { docKind, isSiteKind, isSiteStatus } from "@/lib/admin/documents";
import { coerce } from "@/lib/content/schema-dsl";
import { contentSchema } from "@/lib/content/schema";
import { portalSchema } from "@/lib/content/portal-schema";
import { CONTENT_TAG } from "@/lib/content/get-content";
import { createAdminClient } from "@/lib/supabase/admin";
import { CONTENT_TABLE, MEDIA_BUCKET, isSupabaseConfigured } from "@/lib/supabase/env";

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAdminConfigured()) return { status: "error", reason: "not_configured" };

  const ip = await clientIp();
  const locked = lockRemainingMinutes(ip);
  if (locked > 0) return { status: "error", reason: "locked", minutes: locked };

  const pin = String(formData.get("pin") ?? "").trim();
  if (!isPinValid(pin)) {
    registerFailure(ip);
    await sleep(800);
    const minutes = lockRemainingMinutes(ip);
    return minutes > 0
      ? { status: "error", reason: "locked", minutes }
      : { status: "error", reason: "wrong_pin" };
  }

  registerSuccess(ip);
  await createSession();
  // Возврат на страницу, с которой пришли (только внутри редактора)
  const next = String(formData.get("next") ?? "");
  redirect(/^\/edit(\/[a-z0-9/-]*)?$/.test(next) ? next : "/edit");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/edit");
}

/**
 * Сохраняет документ (шаблон, портал или лендинг). `expectedVersion` - updated_at,
 * с которым редактор открыл данные: если кто-то успел сохранить раньше, вернётся
 * conflict (если не передан force). Прежняя версия автоматически уходит в историю.
 */
export async function saveDocumentAction(
  id: string,
  input: unknown,
  expectedVersion: string | null,
  force: boolean,
): Promise<SaveResult> {
  if (!(await isAuthenticated())) return { ok: false, error: "unauthorized" };
  if (!isSupabaseConfigured()) return { ok: false, error: "not_configured" };
  const kind = docKind(id);
  if (!kind) return { ok: false, error: "not_found" };

  const data = kind === "portal" ? coerce(portalSchema, input) : coerce(contentSchema, input);
  const supabase = createAdminClient();

  try {
    const { data: current, error: readError } = await supabase
      .from(CONTENT_TABLE)
      .select("updated_at")
      .eq("id", id)
      .maybeSingle();
    if (readError) throw readError;

    let version: string;
    if (!current) {
      // Новый лендинг (например, район появился на карте позже) - создаётся черновиком
      const { data: inserted, error } = await supabase
        .from(CONTENT_TABLE)
        .insert({ id, kind, status: "draft", data })
        .select("updated_at")
        .single();
      if (error) throw error;
      version = String(inserted.updated_at);
    } else {
      let query = supabase.from(CONTENT_TABLE).update({ data }).eq("id", id);
      // Оптимистичная блокировка: обновляем, только если версия не изменилась
      if (!force && expectedVersion) query = query.eq("updated_at", expectedVersion);
      const { data: updated, error } = await query.select("updated_at");
      if (error) throw error;
      if (!updated || updated.length === 0) return { ok: false, error: "conflict" };
      version = String(updated[0].updated_at);
    }

    updateTag(CONTENT_TAG);
    await createSession(); // продлеваем сессию, пока редактор работает
    return { ok: true, version };
  } catch (error) {
    console.error("[edit] save failed", error);
    return { ok: false, error: "server" };
  }
}

/** Публикует лендинг или возвращает его в черновики (черновик не виден на сайте) */
export async function setSiteStatusAction(id: string, status: unknown): Promise<SaveResult> {
  if (!(await isAuthenticated())) return { ok: false, error: "unauthorized" };
  if (!isSupabaseConfigured()) return { ok: false, error: "not_configured" };
  const kind = docKind(id);
  if (!kind || !isSiteKind(kind) || !isSiteStatus(status)) return { ok: false, error: "not_found" };

  try {
    const supabase = createAdminClient();
    const { data: updated, error } = await supabase
      .from(CONTENT_TABLE)
      .update({ status })
      .eq("id", id)
      .select("updated_at");
    if (error) throw error;
    let version = updated?.[0]?.updated_at;
    if (!version) {
      const { data: inserted, error: insertError } = await supabase
        .from(CONTENT_TABLE)
        .insert({ id, kind, status, data: {} })
        .select("updated_at")
        .single();
      if (insertError) throw insertError;
      version = inserted.updated_at;
    }
    updateTag(CONTENT_TAG);
    await createSession();
    return { ok: true, version: String(version) };
  } catch (error) {
    console.error("[edit] status change failed", error);
    return { ok: false, error: "server" };
  }
}

const EXTENSIONS: Record<(typeof ALLOWED_IMAGE_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const isAllowedType = (type: string): type is (typeof ALLOWED_IMAGE_TYPES)[number] =>
  (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type);

/** Загружает фото в бакет site-media и возвращает путь для image-поля */
export async function uploadImageAction(formData: FormData): Promise<UploadResult> {
  if (!(await isAuthenticated())) return { ok: false, error: "unauthorized" };
  if (!isSupabaseConfigured()) return { ok: false, error: "not_configured" };

  const file = formData.get("file");
  if (!(file instanceof File) || !isAllowedType(file.type)) {
    return { ok: false, error: "invalid_file" };
  }
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "file_too_large" };

  const month = new Date().toISOString().slice(0, 7);
  // Каждое фото - новый файл с уникальным именем: CDN-кэш не показывает старую версию
  const path = `uploads/${month}/${randomUUID()}.${EXTENSIONS[file.type]}`;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) throw error;
    return { ok: true, path };
  } catch (error) {
    console.error("[edit] upload failed", error);
    return { ok: false, error: "server" };
  }
}
