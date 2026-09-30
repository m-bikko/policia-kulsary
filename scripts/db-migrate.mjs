/**
 * Применяет SQL-миграции из supabase/migrations к базе Supabase.
 * Миграции идемпотентны - запускать можно повторно.
 * Использует POSTGRES_URL_NON_POOLING (прямое подключение) из .env.
 *
 *   pnpm db:migrate
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import pg from "pg";

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
if (!connectionString) {
  console.error("Нет POSTGRES_URL_NON_POOLING / DATABASE_URL в окружении (.env)");
  process.exit(1);
}

const dir = join(process.cwd(), "supabase", "migrations");
const files = (await readdir(dir)).filter((name) => name.endsWith(".sql")).sort();

// sslmode из строки подключения убираем: у Supabase собственный CA, шифрование остаётся включённым
const client = new pg.Client({
  connectionString: connectionString.replace(/([?&])sslmode=[^&]*&?/, "$1").replace(/[?&]$/, ""),
  ssl: { rejectUnauthorized: false },
});

await client.connect();
try {
  for (const file of files) {
    const sql = await readFile(join(dir, file), "utf8");
    process.stdout.write(`→ ${file} … `);
    await client.query("begin");
    await client.query(sql);
    await client.query("commit");
    console.log("ok");
  }
  console.log(`Готово: применено миграций - ${files.length}`);
} catch (error) {
  await client.query("rollback").catch(() => undefined);
  console.error("\nОшибка миграции:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await client.end();
}
