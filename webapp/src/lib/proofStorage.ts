import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

type StorePaymentProofArgs = {
  fileBuffer: Buffer;
  mimeType: string;
};

type StoredProof = {
  proofImageUrl: string;
  storage: 'cloudinary' | 'local' | 'inline';
};

const DEFAULT_CLOUDINARY_FOLDER = 'payment-proofs';
let hasWarnedMissingCloudinaryConfig = false;

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    if (process.env.NODE_ENV === 'production' && !hasWarnedMissingCloudinaryConfig) {
      console.warn(
        'Cloudinary config missing (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Falling back from cloud proof storage.'
      );
      hasWarnedMissingCloudinaryConfig = true;
    }
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

async function uploadToCloudinary(fileBuffer: Buffer, mimeType: string): Promise<string | null> {
  const config = getCloudinaryConfig();
  if (!config) {
    return null;
  }

  try {
    const { v2: cloudinary } = await import('cloudinary');

    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true,
    });

    const dataUri = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    const upload = await cloudinary.uploader.upload(dataUri, {
      folder: process.env.CLOUDINARY_PROOF_FOLDER || DEFAULT_CLOUDINARY_FOLDER,
      resource_type: 'image',
    });

    return upload.secure_url || upload.url || null;
  } catch {
    return null;
  }
}

async function writeToLocal(fileBuffer: Buffer, mimeType: string): Promise<string | null> {
  try {
    const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${Date.now()}-${randomUUID()}.${extension}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'payments');
    const filePath = path.join(uploadsDir, filename);

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(filePath, fileBuffer);
    return `/api/payment/proof/${filename}`;
  } catch {
    return null;
  }
}

export async function storePaymentProof({ fileBuffer, mimeType }: StorePaymentProofArgs): Promise<StoredProof> {
  const cloudinaryUrl = await uploadToCloudinary(fileBuffer, mimeType);
  if (cloudinaryUrl) {
    return {
      proofImageUrl: cloudinaryUrl,
      storage: 'cloudinary',
    };
  }

  const localUrl = await writeToLocal(fileBuffer, mimeType);
  if (localUrl) {
    return {
      proofImageUrl: localUrl,
      storage: 'local',
    };
  }

  // Last-resort fallback to avoid losing payment submissions.
  return {
    proofImageUrl: `data:${mimeType};base64,${fileBuffer.toString('base64')}`,
    storage: 'inline',
  };
}
