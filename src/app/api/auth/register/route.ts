import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, hashPassword, isAdminEmail } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/ratelimit";

const Body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: z.string().trim().max(30).optional(),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  if (!rateLimit("reg:" + clientIp(req.headers), 5, 60_000)) return NextResponse.json({ error: "Забагато спроб" }, { status: 429 });
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Перевірте дані. Пароль має бути від 8 символів." }, { status: 400 });
  const { name, email, phone, password } = p.data;
  if (await db.user.findUnique({ where: { email } })) return NextResponse.json({ error: "Такий email вже зареєстровано" }, { status: 409 });
  const user = await db.user.create({ data: { name, email, phone, passwordHash: await hashPassword(password), role: isAdminEmail(email) ? "ADMIN" : "USER" } });
  await createSession({ uid: user.id, role: user.role });
  return NextResponse.json({ ok: true });
}
