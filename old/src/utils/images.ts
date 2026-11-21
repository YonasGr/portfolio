import type { ImageMetadata } from "astro";

const assetImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/*.{jpeg,jpg,png,gif,webp,svg}"
);

/**
 * Dynamically resolves a local asset image object from a string filename or path.
 * @param photoUrl - The filename (e.g., 'avatar.jpg') or full path from JSON data
 * @returns The resolved ImageMetadata object, or null if not found
 */
export async function resolveAssetImage(
  photoUrl: string | undefined
): Promise<ImageMetadata | null> {
  if (!photoUrl || photoUrl.trim() === "") {
    return null;
  }

  const cleanFilename = photoUrl.startsWith("/") ? photoUrl.slice(1) : photoUrl;
  const strippedFilename = cleanFilename.replace(/^src\/assets\//, "");

  const candidatePaths = [
    `/src/assets/${strippedFilename}`,
    `/src/assets/${cleanFilename}`,
    photoUrl,
    cleanFilename,
  ];

  for (const imagePath of candidatePaths) {
    const imageResolver = assetImages[imagePath];

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

  console.warn(`[Image Utility] Asset not found for path: ${photoUrl}`);
  return null;
}
