// Machine photos live in the public "machine-photos" Supabase Storage bucket.
// The database stores paths like "<listing id>/<n>.jpg"; this builds the URL.

export const PHOTO_BUCKET = "machine-photos";
export const MAX_PHOTOS = 6;
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
export const PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const PATH_RE = /^[0-9a-f-]{36}\/\d{1,2}\.(jpg|png|webp)$/;

export function photoUrls(paths: string[] | null | undefined): string[] {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base || !paths) return [];
  return paths
    .filter((p) => PATH_RE.test(p))
    .map((p) => `${base.replace(/\/$/, "")}/storage/v1/object/public/${PHOTO_BUCKET}/${p}`);
}
