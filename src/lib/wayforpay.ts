import crypto from "crypto";

/** WayForPay docs: https://wiki.wayforpay.com/en/view/852102 (Purchase) and 852131 (serviceUrl). */
const hmac = (parts: (string | number)[]) =>
  crypto.createHmac("md5", process.env.WAYFORPAY_SECRET_KEY || "").update(parts.join(";"), "utf8").digest("hex");

export const WFP_URL = "https://secure.wayforpay.com/pay";

export function wfpConfigured() {
  return Boolean(process.env.WAYFORPAY_MERCHANT_ACCOUNT && process.env.WAYFORPAY_SECRET_KEY);
}

export type PurchaseInput = {
  orderReference: string;
  orderDate: number; // unix seconds
  amount: number;
  products: { name: string; price: number; count: number }[];
  client: { firstName: string; lastName?: string; email: string; phone: string };
  returnUrl: string;
  serviceUrl: string;
};

/** Fields for an auto-submitted POST form to WFP_URL. */
export function buildPurchaseForm(p: PurchaseInput): Record<string, string | string[]> {
  const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT || "";
  const merchantDomainName = process.env.WAYFORPAY_DOMAIN || new URL(p.returnUrl).hostname;
  const names = p.products.map((x) => x.name);
  const counts = p.products.map((x) => String(x.count));
  const prices = p.products.map((x) => String(x.price));
  const signature = hmac([merchantAccount, merchantDomainName, p.orderReference, p.orderDate, p.amount, "UAH", ...names, ...counts, ...prices]);
  return {
    merchantAccount,
    merchantAuthType: "SimpleSignature",
    merchantDomainName,
    merchantSignature: signature,
    orderReference: p.orderReference,
    orderDate: String(p.orderDate),
    amount: String(p.amount),
    currency: "UAH",
    orderTimeout: "49000",
    "productName[]": names,
    "productPrice[]": prices,
    "productCount[]": counts,
    clientFirstName: p.client.firstName,
    clientLastName: p.client.lastName || "",
    clientEmail: p.client.email,
    clientPhone: p.client.phone,
    language: "UA",
    returnUrl: p.returnUrl,
    serviceUrl: p.serviceUrl,
  };
}

export type WfpCallback = {
  merchantAccount: string;
  orderReference: string;
  merchantSignature: string;
  amount: number;
  currency: string;
  authCode?: string;
  cardPan?: string;
  transactionStatus: string;
  reasonCode?: number | string;
  [k: string]: unknown;
};

export function verifyCallback(b: WfpCallback) {
  const expected = hmac([
    b.merchantAccount, b.orderReference, b.amount, b.currency,
    b.authCode ?? "", b.cardPan ?? "", b.transactionStatus, b.reasonCode ?? "",
  ]);
  const a = Buffer.from(expected);
  const c = Buffer.from(String(b.merchantSignature || ""));
  return a.length === c.length && crypto.timingSafeEqual(a, c);
}

export function acceptResponse(orderReference: string) {
  const time = Math.floor(Date.now() / 1000);
  return { orderReference, status: "accept", time, signature: hmac([orderReference, "accept", time]) };
}

/** WayForPay sends JSON, sometimes as the single key of a form-encoded body. */
export function parseCallbackBody(raw: string): WfpCallback | null {
  try { return JSON.parse(raw); } catch {}
  try {
    const params = new URLSearchParams(raw);
    const keys = [...params.keys()];
    if (keys.length === 1) return JSON.parse(keys[0]);
    return Object.fromEntries(params) as unknown as WfpCallback;
  } catch { return null; }
}
