import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    // Paystack requires the raw body text for HMAC signature hashing
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.error("Webhook rejected: Missing PAYSTACK_SECRET_KEY in ENV");
      return NextResponse.json({ error: 'System unconfigured' }, { status: 500 });
    }

    // 1. SIGNATURE VALIDATION (NEVER SKIP)
    const hash = crypto.createHmac('sha512', paystackSecret).update(rawBody).digest('hex');
    if (hash !== signature) {
      console.error("Webhook rejected: Invalid Paystack signature mismatch");
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const { reference } = event.data;

      // 2. ACTIVE VERIFICATION (NEVER TRUST FRONTEND OR SOLE WEBHOOK PAYLOAD)
      // We ping Paystack explicitly to confirm this transaction actually happened
      const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${paystackSecret}` }
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.status || verifyData.data.status !== 'success') {
        console.error("Webhook rejected: API Verification reported transaction not successful");
        return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
      }

      // 3. EXTRACT SECURE METADATA
      const { user_id, product_name, plan } = verifyData.data.metadata;

      if (!user_id || !product_name) {
         console.warn("Webhook metadata missing essential product definitions");
         return NextResponse.json({ error: 'Missing metadata constraints' }, { status: 400 });
      }

      // 4. ACTIVATE SUBSCRIPTION
      const startDate = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // 30 day lifespan

      // Assign product-based dynamic delivery templates
      let defaultAccess = "Delivery pending. An admin will assign your credentials shortly.";
      
      if (product_name === "iCloud") {
        defaultAccess = `iCloud ${plan} Upgrade instructions:\n1. Ensure you are signed in on your device.\n2. Click the invite link once provided by our Admin.`;
      } else if (product_name === "Apple Music" || product_name === "DStv Premium" || product_name === "Apple TV+") {
        defaultAccess = `Access Verification for ${product_name}:\nTo finalize your setup, tap below to join our private automated Telegram:\n\nLink: https://t.me/your_private_group`;
      } else if (product_name === "Netflix" || product_name === "Snapchat+" || product_name === "Amazon Prime Video") {
        defaultAccess = `Your ${product_name} (${plan}) account credentials are being provisioned uniquely for you. Check back shortly!`;
      }

      // Explicitly create a new entry rather than overwriting existing to support parallel renewals
      await prisma.subscription.create({
        data: {
          userId: user_id,
          productName: product_name,
          plan: plan,
          status: "active",
          startDate,
          expiryDate,
          accessDetails: defaultAccess
        }
      });
    }

    // 5. ACKNOWLEDGE (Must return 200 OK otherwise Paystack resends tirelessly)
    return NextResponse.json({ message: 'Webhook securely processed' }, { status: 200 });

  } catch (error) {
    console.error('Webhook critical error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
