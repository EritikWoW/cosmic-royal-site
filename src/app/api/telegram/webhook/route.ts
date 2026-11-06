import { NextResponse } from "next/server";
import { handleUpdate, type TgUpdate } from "@/lib/bot";

export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || req.headers.get("x-telegram-bot-api-secret-token") !== secret) return NextResponse.json({ ok: false }, { status: 401 });
  const update = (await req.json().catch(() => null)) as TgUpdate | null;
  if (update) {
    try { await handleUpdate(update); } catch (e) { console.error("bot", e); }
  }
  return NextResponse.json({ ok: true });
}
