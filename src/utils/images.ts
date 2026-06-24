import type { ImageMetadata } from "astro";
import projectLogosPathImage from "../../Project-LogosPath.png";

const allImages = {
  ...import.meta.glob<{ default: ImageMetadata }>(
    "/src/assets/*.{jpeg,jpg,png,gif,webp,svg}",
  ),
  "/Project-LogosPath.png": async () => ({ default: projectLogosPathImage }),
};

/**
 * Dynamically resolves a local asset image object from a string filename or path.
 * @param photoUrl - The filename (e.g., 'avatar.jpg') or full path from JSON data
 * @returns The resolved ImageMetadata object, or null if not found
 */

export async function resolveAssetImage(
  photoUrl: string | undefined,
): Promise<ImageMetadata | null> {
  if (!photoUrl || photoUrl.trim() === "") {
    return null;
  }

  const candidatePaths = photoUrl.startsWith("/")
    ? [photoUrl]
    : [`/src/assets/${photoUrl}`, `/${photoUrl}`];

  for (const imagePath of candidatePaths) {
    const imageResolver = allImages[imagePath];

    if (!imageResolver) {
      continue;
    }

    try {
      const imageModule = await imageResolver();
      return imageModule.default;
    } catch (error) {
      console.error(`[Image Utility] Failed to load image at ${imagePath}`, error);
      return null;
    }
  }

  return null;
}
