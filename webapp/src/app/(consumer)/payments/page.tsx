import { redirect } from 'next/navigation';
import { createProductId, resolveProduct } from '@/lib/products';

type SearchParams = {
  product?: string;
  plan?: string;
};

export default async function PaymentPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const product = resolvedSearchParams.product;
  const plan = resolvedSearchParams.plan;

  if (!product || !plan) {
    redirect('/pricing');
  }

  const resolved = resolveProduct(product, plan);
  if (!resolved) {
    redirect('/pricing');
  }

  const productId = createProductId(resolved.productName, resolved.plan);
  redirect(`/payment?productId=${encodeURIComponent(productId)}`);
}
