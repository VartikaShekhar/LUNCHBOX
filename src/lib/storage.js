import { supabase } from "./supabase";

export const RESTAURANT_IMAGES_BUCKET = "restaurant-images";
const BUCKET_NAME = import.meta.env.VITE_SUPABASE_RESTAURANT_BUCKET || RESTAURANT_IMAGES_BUCKET;

/**
 * Upload an image file to Supabase Storage and return a public URL.
 */
export async function uploadImageFile(file, { bucket = BUCKET_NAME, pathPrefix = "" } = {}) {
  if (!file) {
    return { data: null, error: "No file provided" };
  }

  const fileExt = file.name?.split(".").pop() || "jpg";
  const uniqueName = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}`;
  const filePath = `${pathPrefix ? `${pathPrefix}/` : ""}${uniqueName}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    const notFound = uploadError.message?.toLowerCase().includes("bucket not found");
    const message = notFound
      ? `Storage bucket "${bucket}" is missing. Create it in Supabase Storage or set VITE_SUPABASE_RESTAURANT_BUCKET to an existing bucket.`
      : uploadError.message;
    return { data: null, error: message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    data: {
      publicUrl: data.publicUrl,
      path: filePath,
    },
    error: null,
  };
}
