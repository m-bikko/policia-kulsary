import { isRecord } from "@/lib/content/schema-dsl";

/**
 * Иммутабельно записывает значение по пути вида "points.groups.0.label.kz".
 * Копируются только объекты на пути - остальные ветки сохраняют идентичность,
 * поэтому мемоизированные поля редактора не перерисовываются.
 */
export function setIn<T>(root: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const update = (node: unknown, index: number): unknown => {
    if (index === keys.length) return value;
    const key = keys[index];
    if (Array.isArray(node)) {
      const copy = node.slice();
      const position = Number(key);
      copy[position] = update(node[position], index + 1);
      return copy;
    }
    const record = isRecord(node) ? node : {};
    return { ...record, [key]: update(record[key], index + 1) };
  };
  return update(root, 0) as T;
}
