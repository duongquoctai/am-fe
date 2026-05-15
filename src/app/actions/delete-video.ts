"use server";

import { createClient } from "@/lib/supabase/server";
import { createHash } from "crypto";

function extractCloudinaryInfo(url: string | null) {
  if (!url) return null;

  const match = url.match(
    /res\.cloudinary\.com\/([^/]+)\/(image|video)\/upload[^/]*\/v\d+\/(.+)$/,
  );
  if (!match) return null;

  const resourceType = match[2];
  const publicIdWithExt = match[3].split("?")[0];
  const extMatch = publicIdWithExt.match(/(\.[a-zA-Z0-9]+)$/);
  const publicId = extMatch
    ? publicIdWithExt.slice(0, -extMatch[1].length)
    : publicIdWithExt;

  return { publicId, resourceType };
}

async function deleteFromCloudinary(
  publicId: string,
  resourceType: string,
): Promise<boolean> {
  const cloudName = process.env.CLOUDINARY_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing Cloudinary credentials");
    return false;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(stringToSign).digest("hex");

  console.log("[Cloudinary Delete] publicId:", publicId);
  console.log(
    "[Cloudinary Delete] stringToSign (redacted):",
    `public_id=${publicId}&timestamp=${timestamp}******`,
  );
  console.log("[Cloudinary Delete] signature:", signature);

  const body = `public_id=${publicId}&timestamp=${timestamp}&api_key=${apiKey}&signature=${signature}`;

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  const result = await response.json();
  console.log("[Cloudinary Delete] response:", JSON.stringify(result));
  return result.result === "ok" || result.result === "not found";
}

export async function deleteVideo(
  id: string,
  storageUrl: string,
  thumbnailUrl: string | null,
) {
  const supabase = await createClient();

  try {
    const videoInfo = extractCloudinaryInfo(storageUrl);
    const thumbnailInfo = extractCloudinaryInfo(thumbnailUrl);

    if (videoInfo) {
      const videoDeleted = await deleteFromCloudinary(
        videoInfo.publicId,
        videoInfo.resourceType,
      );
      if (!videoDeleted) {
        return {
          success: false,
          error: "Failed to delete video from Cloudinary",
        };
      }
    }

    if (thumbnailInfo && thumbnailInfo.publicId !== videoInfo?.publicId) {
      const thumbnailDeleted = await deleteFromCloudinary(
        thumbnailInfo.publicId,
        thumbnailInfo.resourceType,
      );
      if (!thumbnailDeleted) {
        console.warn(
          "Failed to delete thumbnail from Cloudinary, proceeding anyway",
        );
      }
    }

    const { error: dbError } = await supabase
      .from("videos")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("Failed to delete from database:", dbError);
      return { success: false, error: "Failed to delete from database" };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error deleting video:", err);
    return { success: false, error: err.message || "Failed to delete video" };
  }
}
