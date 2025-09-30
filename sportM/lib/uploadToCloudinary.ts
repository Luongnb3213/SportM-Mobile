// uploadToCloudinary.ts
export type CloudinaryUploadResult = {
  asset_id: string;
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  // ... còn nhiều field khác Cloudinary trả về
};

function guessMimeType(uri: string) {
  const lower = uri.split('?')[0].toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg'; // fallback
}

/**
 * Upload file từ local uri (Expo ImagePicker) lên Cloudinary bằng unsigned preset
 */
export async function uploadToCloudinary(
  localUri: string,
  opts: {
    folder?: string; // vd: 'mobile_uploads'
    publicId?: string; // nếu muốn đặt tên file (không cần đuôi)
    tags?: string[]; // gắn tags
    context?: Record<string, string>; // gắn metadata
  }
): Promise<CloudinaryUploadResult> {
  const { folder, publicId, tags, context } = opts;
  const cloudName = 'diuwaesix';
  const unsignedPreset = 'sportM';

  const mime = guessMimeType(localUri);

  const form = new FormData();
  form.append('file', {
    uri: localUri,
    name: 'upload.jpg',
    type: mime,
  } as any);

  form.append('upload_preset', unsignedPreset);
  if (folder) form.append('folder', folder);
  if (publicId) form.append('public_id', publicId);
  if (tags?.length) form.append('tags', tags.join(','));
  if (context) {
    // context format: key=value|key2=value2
    const ctx = Object.entries(context)
      .map(([k, v]) => `${k}=${v}`)
      .join('|');
    form.append('context', ctx);
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: form,
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Cloudinary upload failed: ${res.status} ${errText}`);
  }

  const json = (await res.json()) as CloudinaryUploadResult;
  return json;
}
