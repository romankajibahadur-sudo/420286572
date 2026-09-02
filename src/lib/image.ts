/**
 * Client-side image pipeline for admin uploads.
 * Reads a local file, downscales it on a canvas and returns a compressed
 * JPEG data URL — small enough to store directly in the database
 * (Firestore documents cap at ~1 MB) with no storage bucket required.
 */
export async function fileToCompressedDataUrl(
  file: File,
  maxWidth = 1600,
  quality = 0.75,
): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('That image could not be decoded.'));
    el.src = dataUrl;
  });

  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);

  let out = canvas.toDataURL('image/jpeg', quality);
  // Keep shrinking if still oversized for a database document.
  let q = quality;
  while (out.length > 900_000 && q > 0.4) {
    q -= 0.12;
    out = canvas.toDataURL('image/jpeg', q);
  }
  return out;
}

export const prettyBytes = (n: number) =>
  n > 1_048_576 ? `${(n / 1_048_576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;
