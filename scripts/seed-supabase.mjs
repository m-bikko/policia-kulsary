/**
 * Засеивает Supabase:
 *  1) загружает все фото из supabase/seed-media в бакет site-media (пути сохраняются);
 *  2) записывает эталонный контент (lib/content/default-content.json), но ТОЛЬКО если
 *     в базе ещё нет контента - правки из /edit не затираются.
 *     Принудительная перезапись: pnpm db:seed --force-content
 *
 *   pnpm db:seed
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "site-media";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
if (!url || !key) {
  console.error("Нужны NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY в .env");
  process.exit(1);
}
const forceContent = process.argv.includes("--force-content");
const supabase = createClient(url, key, { auth: { persistSession: false } });

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".avif": "image/avif" };

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = join(dir, entry.name);
      return entry.isDirectory() ? listFiles(full) : [full];
    }),
  );
  return nested.flat();
}

// 1. Бакет (обычно уже создан миграцией)
const { error: bucketError } = await supabase.storage.getBucket(BUCKET);
if (bucketError) {
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (error) {
    console.error("Не удалось создать бакет:", error.message);
    process.exit(1);
  }
  console.log(`Создан бакет ${BUCKET}`);
}

// 2. Фото
const mediaDir = join(process.cwd(), "supabase", "seed-media");
const files = (await listFiles(mediaDir)).filter((file) => MIME[extname(file).toLowerCase()]);
let uploaded = 0;
for (const file of files) {
  const path = relative(mediaDir, file).split(sep).join("/");
  const body = await readFile(file);
  const { error } = await supabase.storage.from(BUCKET).upload(path, body, {
    contentType: MIME[extname(file).toLowerCase()],
    cacheControl: "31536000",
    upsert: true,
  });
  if (error) {
    console.error(`  ✗ ${path}: ${error.message}`);
    process.exitCode = 1;
  } else {
    uploaded += 1;
    const size = Math.round((await stat(file)).size / 1024);
    console.log(`  ✓ ${path} (${size} КБ)`);
  }
}
console.log(`Фото загружено: ${uploaded}/${files.length}`);

// 3. Контент
const { data: existing, error: readError } = await supabase
  .from("site_content")
  .select("updated_at")
  .eq("id", "main")
  .maybeSingle();
if (readError) {
  console.error("Не удалось прочитать site_content (миграция применена?):", readError.message);
  process.exit(1);
}
if (existing && !forceContent) {
  console.log("Контент уже есть в базе - не трогаем (перезапись: --force-content)");
} else {
  const data = JSON.parse(await readFile(join(process.cwd(), "lib", "content", "default-content.json"), "utf8"));
  const { error } = await supabase.from("site_content").upsert({ id: "main", data });
  if (error) {
    console.error("Не удалось записать контент:", error.message);
    process.exit(1);
  }
  console.log(existing ? "Контент перезаписан эталонным" : "Контент записан в базу");
}
