import { v2 as cloudinary } from 'cloudinary';

function isPlaceholder(value: string | undefined) {
  return !value || value.startsWith('your_');
}

function resolveConfig() {
  let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let apiSecret = process.env.CLOUDINARY_API_SECRET;

  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  if (cloudinaryUrl) {
    try {
      const url = new URL(cloudinaryUrl);
      if (url.protocol !== 'cloudinary:') throw new Error('CLOUDINARY_URL must use the cloudinary:// protocol');
      cloudName = url.hostname;
      apiKey = url.username;
      apiSecret = url.password;
    } catch {
      return null;
    }
  }

  if (isPlaceholder(cloudName) || isPlaceholder(apiKey) || isPlaceholder(apiSecret)) {
    return null;
  }

  return { cloudName: cloudName!, apiKey: apiKey!, apiSecret: apiSecret! };
}

const config = resolveConfig();
if (config) {
  cloudinary.config({ cloud_name: config.cloudName, api_key: config.apiKey, api_secret: config.apiSecret });
}

export const cloudinaryConfigured = config !== null;

export async function uploadImage(buffer: Buffer): Promise<string> {
  if (!cloudinaryConfigured) {
    throw new Error('Cloudinary is not configured');
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'unimaintain' }, (error, result) => {
      if (error || !result) {
        return reject(error ?? new Error('Cloudinary upload failed'));
      }
      resolve(result.secure_url);
    });

    stream.end(buffer);
  });
}
