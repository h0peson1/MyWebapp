import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { randomUUID } from 'crypto';
import prisma from '@/lib/db';
import { resolveProductById } from '@/lib/products';
import { storePaymentProof } from '@/lib/proofStorage';
import { notifyAdminNewOrder } from '@/lib/adminAlerts';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

type PaymentRecord = {
  id: string;
};

function hasPaymentDelegate(client: typeof prisma): client is typeof prisma & {
  payment: {
    findFirst: (args: { where: { userId: string; status: string }; select: { id: true } }) => Promise<PaymentRecord | null>;
    create: (args: {
      data: {
        userId: string;
        productId: string;
        amount: number;
        paymentMethod: string;
        transactionId: string | null;
        proofImageUrl: string;
        status: string;
      };
    }) => Promise<unknown>;
  };
} {
  return Boolean((client as { payment?: unknown }).payment);
}

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const userEmail = headersList.get('x-user-email') || undefined;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pendingPayment = hasPaymentDelegate(prisma)
      ? await prisma.payment.findFirst({
          where: {
            userId,
            status: 'pending',
          },
          select: { id: true },
        })
      : await prisma.$queryRaw<PaymentRecord[]>`
          SELECT "id"
          FROM "Payment"
          WHERE "userId" = ${userId} AND "status" = 'pending'
          LIMIT 1
        `.then((rows) => rows[0] ?? null);

    if (pendingPayment) {
      return NextResponse.json(
        { error: 'You already have a pending payment. Please wait for approval.' },
        { status: 409 }
      );
    }

    const formData = await req.formData();
    const productId = String(formData.get('productId') || '');
    const transactionIdRaw = formData.get('transactionId');
    const proof = formData.get('proof');

    if (!productId) {
      return NextResponse.json({ error: 'Product is required' }, { status: 400 });
    }

    const resolvedProduct = resolveProductById(productId);
    if (!resolvedProduct) {
      return NextResponse.json({ error: 'Invalid product selection' }, { status: 400 });
    }

    if (!(proof instanceof File)) {
      return NextResponse.json({ error: 'Proof image is required' }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.has(proof.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, and WEBP images are allowed' }, { status: 400 });
    }

    if (proof.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image size must be less than 5MB' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await proof.arrayBuffer());

    const { proofImageUrl } = await storePaymentProof({
      fileBuffer,
      mimeType: proof.type,
    });

    const transactionId = typeof transactionIdRaw === 'string' ? transactionIdRaw.trim() : null;

    let paymentId: string;
    if (hasPaymentDelegate(prisma)) {
      const payment = await prisma.payment.create({
        data: {
          userId,
          productId,
          amount: resolvedProduct.amount,
          paymentMethod: 'momo',
          transactionId: transactionId || null,
          proofImageUrl,
          status: 'pending',
        },
      });
      paymentId = payment.id;
    } else {
      paymentId = randomUUID();
      await prisma.$executeRaw`
        INSERT INTO "Payment" (
          "id",
          "userId",
          "productId",
          "amount",
          "paymentMethod",
          "transactionId",
          "proofImageUrl",
          "status",
          "updatedAt"
        ) VALUES (
          ${paymentId},
          ${userId},
          ${productId},
          ${resolvedProduct.amount},
          'momo',
          ${transactionId || null},
          ${proofImageUrl},
          'pending',
          ${new Date()}
        )
      `;
    }

    await notifyAdminNewOrder({
      paymentId,
      proofImageUrl,
      userId,
      userEmail,
      productId,
      productName: resolvedProduct.productName,
      plan: resolvedProduct.plan,
      amount: resolvedProduct.amount,
      transactionId,
      createdAtIso: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'Payment submitted successfully. Awaiting confirmation.',
      paymentId,
    });
  } catch (error) {
    console.error('Payment submit error:', error);
    return NextResponse.json({ error: 'Failed to submit payment' }, { status: 500 });
  }
}
