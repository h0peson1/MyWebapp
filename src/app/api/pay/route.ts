import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { getProductPrice } from '@/lib/products';

export async function POST(req: Request) {
  try {
    // SECURITY: Get trusted user logic gracefully piped from our Auth proxy
    const user_id = req.headers.get('x-user-id');
    const { product_name, plan } = await req.json();

    if (!user_id || !product_name || !plan) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // ALWAYS VERIFY: Strictly map the frontend product request to our backend registry
    // Rejects any arbitrary amounts passed from frontend to prevent spoofing
    const amount = getProductPrice(product_name, plan);
    
    if (!amount) {
      return NextResponse.json({ error: 'Invalid product or plan selected' }, { status: 400 });
    }

    // Lookup user to acquire their secure email
    const user = await prisma.user.findUnique({
      where: { id: user_id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate unique payment reference
    const reference = crypto.randomUUID();

    // Prevent crashing if developer didn't set keys yet
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
       console.error("PAYSTACK_SECRET_KEY is missing from environment variables.");
       return NextResponse.json({ error: 'Payment gateway unconfigured' }, { status: 500 });
    }

    // Call Paystack
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amount, // In smallest unit (cents/kobo)
        reference: reference,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard`,
        metadata: {
          user_id: user.id,
          product_name,
          plan
        }
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      console.error('Paystack transaction initialization failed:', paystackData.message);
      return NextResponse.json({ error: 'Payment gateway initialization failed' }, { status: 400 });
    }

    // Standard Response: Return the specific payment URL generated internally by Paystack
    return NextResponse.json({ authorization_url: paystackData.data.authorization_url });

  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
