import type { NextConfig } from "next";

/** Хост Supabase из env - фото сайта отдаются из Supabase Storage */
function supabaseHost(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const host = supabaseHost();
const storagePath = "/storage/v1/object/public/**";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(host ? [{ protocol: "https" as const, hostname: host, port: "", pathname: storagePath, search: "" }] : []),
      { protocol: "https", hostname: "*.supabase.co", port: "", pathname: storagePath, search: "" },
    ],
  },
  experimental: {
    serverActions: {
      // Фото сжимаются в браузере, но оставляем запас под исходник до 5 МБ + multipart
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
