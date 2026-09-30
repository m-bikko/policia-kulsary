/**
 * Уменьшает фото в браузере перед загрузкой: длинная сторона - не больше
 * maxSize, JPEG/WebP с качеством ~0.85. Снимок с телефона на 6 МБ превращается
 * в ~200-400 КБ. GIF (возможна анимация) и уже маленькие файлы не трогаем.
 */
export async function prepareImage(file: File, maxSize: number): Promise<File> {
  if (file.type === "image/gif") return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // браузер не умеет декодировать формат - отдадим как есть, сервер проверит
  }

  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 600 * 1024) {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    return file;
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // PNG/WebP могут быть с прозрачностью (эмблема) - сохраняем в WebP, остальное в JPEG
  const keepAlpha = file.type === "image/png" || file.type === "image/webp";
  const targetType = keepAlpha ? "image/webp" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, targetType, 0.86),
  );
  if (!blob || blob.size >= file.size) return file;

  const extension = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${baseName}.${extension}`, { type: blob.type });
}
