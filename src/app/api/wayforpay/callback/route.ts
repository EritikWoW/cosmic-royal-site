import { NextResponse } from "next/server";
import { acceptResponse, parseCallbackBody, verifyCallback } from "@/lib/wayforpay";
import { applyPaymentStatus } from "@/lib/orders";
import { audit } from "@/lib/audit";

/** WayForPay serviceUrl: server-to-server payment status notification. */
export async function POST(req: Request) {
  const raw = await req.text();
  const body = parseCallbackBody(raw);
  if (!body?.orderReference) return NextResponse.json({ error: "bad request" }, { status: 400 });
  if (!verifyCallback(body)) {
    await audit("wayforpay", "bad_signature", { reference: body.orderReference });
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }
  if (body.merchantAccount !== process.env.WAYFORPAY_MERCHANT_ACCOUNT) return NextResponse.json({ error: "wrong merchant" }, { status: 400 });
  const res = await applyPaymentStatus(body.orderReference, body.transactionStatus, Math.round(Number(body.amount)), body);
  if (!res.ok && res.reason === "not_found") return NextResponse.json({ error: "unknown order" }, { status: 404 });
  return NextResponse.json(acceptResponse(body.orderReference));
}
