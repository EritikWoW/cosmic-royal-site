import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { postUserMessage } from "@/lib/support";
import { clientIp, rateLimit } from "@/lib/ratelimit";

const COOKIE = "cr_support";

async function currentThread() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (token) {
    const t = await db.supportThread.findUnique({ where: { token } });
    if (t) return t;
  }
  const u = await getUser();
  if (u) return db.supportThread.findFirst({ where: { userId: u.id }, orderBy: { updatedAt: "desc" } });
  return null;
}

export async function GET() {
  const t = await currentThread();
  if (!t) return NextResponse.json({ thread: null, messages: [] });
  const messages = await db.supportMessage.findMany({ where: { threadId: t.id, NOT: { text: "" } }, orderBy: { createdAt: "asc" }, select: { id: true, author: true, text: true, createdAt: true } });
  return NextResponse.json({ thread: { name: t.name }, messages });
}

const Body = z.object({ text: z.string().trim().min(1).max(2000), name: z.string().trim().max(120).optional(), contact: z.string().trim().max(200).optional() });

export async function POST(req: Request) {
  if (!rateLimit("support:" + clientIp(req.headers), 12, 60_000)) return NextResponse.json({ error: "Забагато повідомлень, зачекайте хвилину" }, { status: 429 });
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Порожнє повідомлення" }, { status: 400 });
  let t = await currentThread();
  if (!t) {
    const u = await getUser();
    const name = u?.name || p.data.name;
    const contact = u?.email || p.data.contact;
    if (!name || !contact) return NextResponse.json({ error: "Вкажіть ім'я та контакт (Telegram, телефон або email)", needContact: true }, { status: 400 });
    const token = crypto.randomBytes(24).toString("hex");
    t = await db.supportThread.create({ data: { token, name, contact, userId: u?.id } });
    (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 180 });
  }
  await postUserMessage(t.id, p.data.text);
  return NextResponse.json({ ok: true });
}
