import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readFile } from 'fs/promises';
import path from 'path';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';

type PaymentProofRow = {
  proofImageUrl: string;
};

function getContentType(filename: string) {
  const extension = filename.toLowerCase().split('.').pop();
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  return 'image/jpeg';
}

function getFilenameFromProofUrl(proofImageUrl: string) {
  const normalized = proofImageUrl.replace(/\\/g, '/').trim();
  const parts = normalized.split('/').filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : null;
}

function isRemoteUrl(value: string) {
  return value.startsWith('http://') || value.startsWith('https://');
}

function parseDataUrl(value: string) {
  if (!value.startsWith('data:')) {
    return null;
  }

  const separator = value.indexOf(',');
  if (separator === -1) {
    return null;
  }

  const meta = value.slice(5, separator);
  const payload = value.slice(separator + 1);
  const isBase64 = meta.endsWith(';base64');
  const contentType = isBase64 ? meta.slice(0, -7) || 'application/octet-stream' : meta || 'application/octet-stream';

  if (!isBase64) {
    return {
      contentType,
      bytes: Buffer.from(decodeURIComponent(payload), 'utf8'),
    };
  }

  return {
    contentType,
    bytes: Buffer.from(payload, 'base64'),
  };
}

export async function GET(_: Request, { params }: { params: Promise<{ paymentId: string }> }) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken')?.value;

    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(adminToken);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId } = await params;
    if (!paymentId) {
      return NextResponse.json({ error: 'Invalid payment ID' }, { status: 400 });
    }

    const rows = await prisma.$queryRaw<PaymentProofRow[]>`
      SELECT "proofImageUrl"
      FROM "Payment"
      WHERE "id" = ${paymentId}
      LIMIT 1
    `;

    const payment = rows[0];
    if (!payment?.proofImageUrl) {
      return NextResponse.json({ error: 'Screenshot not found' }, { status: 404 });
    }

    if (isRemoteUrl(payment.proofImageUrl)) {
      return NextResponse.redirect(payment.proofImageUrl, { status: 307 });
    }

    const inlineProof = parseDataUrl(payment.proofImageUrl);
    if (inlineProof) {
      return new NextResponse(inlineProof.bytes, {
        status: 200,
        headers: {
          'Content-Type': inlineProof.contentType,
          'Cache-Control': 'no-store',
        },
      });
    }

    const filename = getFilenameFromProofUrl(payment.proofImageUrl);
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid screenshot path' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', 'payments', filename);
    const file = await readFile(filePath);

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': getContentType(filename),
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Screenshot not found' }, { status: 404 });
  }
}
