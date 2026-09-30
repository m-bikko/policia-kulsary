import defaultContentJson from "./default-content.json";
import { coerce } from "./schema-dsl";
import { contentSchema, type Content } from "./schema";

/**
 * Эталонный контент: им засеивается Supabase (pnpm db:seed) и он же служит
 * запасным вариантом, если Supabase недоступен или ещё не настроен.
 * Фото в нём - пути в бакете site-media.
 */
export const defaultContent: Content = coerce(contentSchema, defaultContentJson);
