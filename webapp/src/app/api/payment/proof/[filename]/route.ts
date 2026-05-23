import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

function getContentType(filename: string) {
  const extension = filename.toLowerCase().split('.').pop();

  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  return 'image/jpeg';
}

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;

    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
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
