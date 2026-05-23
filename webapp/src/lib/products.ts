export const PRODUCT_REGISTRY = {
  "Netflix": { plan: "Premium", amount: 4000 }, // Stored centrally in cents/kobo
  "Amazon Prime Video": { plan: "Standard", amount: 7000 },
  "Snapchat+": { plan: "Premium", amount: 3500 },
  "Apple Music": { plan: "Standard", amount: 3000 },
  "DStv Premium": { plan: "Premium", amount: 15000 },
  "Apple TV+": { plan: "Standard", amount: 6000 },
  "iCloud": {
    "50GB": 4000,
    "200GB": 8000,
    "1TB": 15000
  }
} as const;

type ProductName = keyof typeof PRODUCT_REGISTRY;

type ResolvedProduct = {
  productName: string;
  plan: string;
  amount: number;
};

const PRODUCT_ID_SEPARATOR = '::';

/**
 * Validates and retrieves the exact backend price to prevent frontend spoofing.
 */
export function getProductPrice(productName: string, plan: string): number | null {
  if (productName === "iCloud") {
    const icloudRecord = PRODUCT_REGISTRY["iCloud"] as Record<string, number>;
    return icloudRecord[plan] || null;
  }

  if (productName in PRODUCT_REGISTRY && productName !== 'iCloud') {
    const record = PRODUCT_REGISTRY[productName as Exclude<ProductName, 'iCloud'>];
    return 'amount' in record ? record.amount : null;
  }

  return null;
}

export function createProductId(productName: string, plan: string): string {
  return `${productName}${PRODUCT_ID_SEPARATOR}${plan}`;
}

export function parseProductId(productId: string): { productName: string; plan: string } | null {
  const [productName, plan] = productId.split(PRODUCT_ID_SEPARATOR);
  if (!productName || !plan) {
    return null;
  }

  return { productName, plan };
}

export function resolveProduct(productName: string, plan: string): ResolvedProduct | null {
  const amount = getProductPrice(productName, plan);
  if (amount === null) {
    return null;
  }

  return {
    productName,
    plan,
    amount,
  };
}

export function resolveProductById(productId: string): ResolvedProduct | null {
  const parsed = parseProductId(productId);
  if (!parsed) {
    return null;
  }

  return resolveProduct(parsed.productName, parsed.plan);
}

export function formatAmount(amountInMinorUnits: number): string {
  return (amountInMinorUnits / 100).toFixed(2);
}
