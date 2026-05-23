import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, metadata } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid event name' }, { status: 400 });
    }

    // Placeholder event pipeline for now.
    // Safe to replace with a vendor SDK later (PostHog, Segment, Mixpanel, etc).
    console.info('[analytics:event]', {
      name,
      metadata: metadata || {},
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics event error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
