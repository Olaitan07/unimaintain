import { v2 as cloudinary } from 'cloudinary';

let cloudName = process.env.CLOUDINARY_CLOUD_NAME;
let apiKey = process.env.CLOUDINARY_API_KEY;
let apiSecret = process.env.CLOUDINARY_API_SECRET;

const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (cloudinaryUrl) {
  try {
    const url = new URL(cloudinaryUrl);
    if (url.protocol !== 'cloudinary:') {
      throw new Error('CLOUDINARY_URL must use the cloudinary:// protocol');
    }
    cloudName = url.hostname;
    apiKey = url.username;
    apiSecret = url.password;
  } catch (error) {
    throw new Error('Invalid CLOUDINARY_URL format');
  }
}

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error('Cloudinary environment variables must be defined');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

export async function uploadImage(buffer: Buffer): Promise<string> {
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
