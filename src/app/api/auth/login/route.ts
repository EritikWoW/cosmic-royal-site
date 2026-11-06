import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkPassword, createSession, isAdminEmail } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/ratelimit";

const Body = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1) });

export async function POST(req: Request) {
  if (!rateLimit("login:" + clientIp(req.headers), 10, 60_000)) return NextResponse.json({ error: "Забагато спроб, зачекайте хвилину" }, { status: 429 });
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Невірний email або пароль" }, { status: 400 });
  let user = await db.user.findUnique({ where: { email: p.data.email } });
  if (!user || !(await checkPassword(p.data.password, user.passwordHash))) return NextResponse.json({ error: "Невірний email або пароль" }, { status: 401 });
  if (isAdminEmail(user.email) && user.role !== "ADMIN") user = await db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  await createSession({ uid: user.id, role: user.role });
  return NextResponse.json({ ok: true, admin: user.role === "ADMIN" });
}
