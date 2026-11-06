import { db } from "./db";
import { esc, notifyAdmins } from "./telegram";
import { formatUAH } from "./site";
import { audit } from "./audit";
import type { OrderStatus } from "@prisma/client";

const statusMap: Record<string, OrderStatus> = {
  Approved: "PAID",
  Declined: "DECLINED",
  Expired: "EXPIRED",
  Refunded: "REFUNDED",
  Voided: "REFUNDED",
};

/**
 * Applies a WayForPay transaction status to an order. Idempotent: repeated
 * callbacks with the same status change nothing and notify nobody twice.
 */
export async function applyPaymentStatus(reference: string, wfpStatus: string, amount: number, payload: object) {
  const order = await db.order.findUnique({ where: { reference }, include: { items: true } });
  if (!order) return { ok: false as const, reason: "not_found" };
  const next = statusMap[wfpStatus];

  if (next === "PAID" && amount !== order.amount) {
    await audit("wayforpay", "amount_mismatch", { reference, expected: order.amount, got: amount });
    return { ok: false as const, reason: "amount_mismatch" };
  }
  if (!next || order.status === next || order.status === "PAID" && next !== "REFUNDED") {
    await db.order.update({ where: { id: order.id }, data: { wfpStatus, wfpPayload: payload } });
    return { ok: true as const, changed: false };
  }

  const updated = await db.order.updateMany({
    where: { id: order.id, status: order.status },
    data: { status: next, wfpStatus, wfpPayload: payload, ...(next === "PAID" ? { paidAt: new Date() } : {}) },
  });
  if (updated.count === 0) return { ok: true as const, changed: false };
  await audit("wayforpay", `order_${next.toLowerCase()}`, { reference, amount });

  if (next === "PAID") {
    const lines = order.items.map((i) => `• ${esc(i.title)} (${formatUAH(i.price)})`).join("\n");
    await notifyAdmins(
      `💰 <b>Нова оплата ${formatUAH(order.amount)}</b>\n\n${lines}\n\n👤 ${esc(order.name)}\n📧 ${esc(order.email)}\n📱 ${esc(order.phone)}\n🧾 <code>${order.reference}</code>\n\nВидайте доступ і натисніть кнопку нижче.`,
      [[{ text: "✅ Доступ видано", callback_data: `ful:${order.id}` }]],
    );
  }
  return { ok: true as const, changed: true };
}

export async function setFulfilled(orderId: string, actor: string) {
  const o = await db.order.update({ where: { id: orderId }, data: { fulfilled: true } });
  await audit(actor, "order_fulfilled", { reference: o.reference });
  return o;
}
