export const PRODUCT_REGISTRY = {
  "Netflix": { plan: "Premium", amount: 499 }, // Stored centrally in cents/kobo
  "Amazon Prime Video": { plan: "Standard", amount: 399 },
  "Snapchat+": { plan: "Premium", amount: 199 },
  "Apple Music": { plan: "Standard", amount: 449 },
  "DStv Premium": { plan: "Premium", amount: 1299 },
  "Apple TV+": { plan: "Standard", amount: 349 },
  "iCloud": {
    "50GB": 99,
    "200GB": 299,
    "2TB": 999
  }
} as const;

/**
 * Validates and retrieves the exact backend price to prevent frontend spoofing.
 */
export function getProductPrice(productName: string, plan: string): number | null {
  if (productName === "iCloud") {
    const icloudRecord = PRODUCT_REGISTRY["iCloud"] as Record<string, number>;
    return icloudRecord[plan] || null;
  }

  const record = (PRODUCT_REGISTRY as any)[productName];
  if (record) return record.amount;

  return null;
}
