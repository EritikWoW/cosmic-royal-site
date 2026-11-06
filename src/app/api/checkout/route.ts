import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { buildPurchaseForm, wfpConfigured, WFP_URL } from "@/lib/wayforpay";
import { SITE } from "@/lib/site";
import { clientIp, rateLimit } from "@/lib/ratelimit";

const Body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(30),
  courseIds: z.array(z.string()).min(1).max(40),
});

export async function POST(req: Request) {
  if (!rateLimit("checkout:" + clientIp(req.headers), 10, 60_000)) return NextResponse.json({ error: "Забагато спроб, зачекайте хвилину" }, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Перевірте ім'я, email і телефон" }, { status: 400 });
  if (!wfpConfigured()) return NextResponse.json({ error: "Онлайн-оплата ще не підключена. Напишіть наставниці в чат." }, { status: 503 });

  const { name, email, phone, courseIds } = parsed.data;
  const courses = await db.course.findMany({ where: { id: { in: [...new Set(courseIds)] }, published: true, price: { gt: 0 } } });
  if (!courses.length) return NextResponse.json({ error: "Курси не знайдено" }, { status: 400 });
  const amount = courses.reduce((s, c) => s + c.price, 0);
  const session = await getSession();
  const reference = `CR-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

  await db.order.create({
    data: {
      reference, email: email.toLowerCase(), name, phone, amount, userId: session?.uid,
      items: { create: courses.map((c) => ({ courseId: c.id, title: c.title, price: c.price })) },
    },
  });

  const [firstName, ...rest] = name.split(/\s+/);
  const fields = buildPurchaseForm({
    orderReference: reference,
    orderDate: Math.floor(Date.now() / 1000),
    amount,
    products: courses.map((c) => ({ name: c.title, price: c.price, count: 1 })),
    client: { firstName, lastName: rest.join(" "), email, phone },
    returnUrl: `${SITE.siteUrl}/api/wayforpay/return?ref=${reference}`,
    serviceUrl: `${SITE.siteUrl}/api/wayforpay/callback`,
  });
  return NextResponse.json({ action: WFP_URL, fields, reference });
}
