/**
 * Vercel Blob and image storage helper.
 * If Vercel Blob token is available in production, it performs genuine Blob upload.
 * It also supports base64 encoding and direct image URLs.
 */
export async function uploadImage(file: File): Promise<string> {
  // If running in production with Vercel Blob configured on the server
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.url) return data.url;
    }
  } catch {
    // Fallback to local FileReader if backend endpoint is not active
  }

  // Fallback to local data URL for immediate preview and testing
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as base64 string'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
