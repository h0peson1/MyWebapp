import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { resolveProductById } from '@/lib/products';
import { verifyToken } from '@/lib/auth';
import PaymentCheckoutClient from './PaymentCheckoutClient';

export const metadata = {
  title: 'Payment',
  description: 'Submit payment proof for your chosen StreamSaaS plan.',
  robots: {
    index: false,
    follow: false,
  },
};

type SearchParams = {
  productId?: string;
  months?: string;
};

export default async function PaymentPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const productId = resolvedSearchParams.productId;
  const initialMonths = resolvedSearchParams.months ? parseInt(resolvedSearchParams.months, 10) : 1;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!productId) {
    redirect('/pricing');
  }

  const session = token ? await verifyToken(token) : null;
  if (!session?.userId) {
    redirect(`/register?next=${encodeURIComponent(`/payment?productId=${productId}&months=${initialMonths}`)}`);
  }

  const resolved = resolveProductById(productId);
  if (!resolved) {
    redirect('/pricing');
  }

  return (
    <PaymentCheckoutClient
      productId={productId}
      resolvedProduct={resolved}
      initialMonths={initialMonths}
    />
  );
}
