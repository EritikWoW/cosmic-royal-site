import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { tg } from "@/lib/telegram";
import { SITE } from "@/lib/site";

/** Admin-only: registers the bot webhook and command list. */
export async function POST() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_WEBHOOK_SECRET) return NextResponse.json({ error: "Додайте TELEGRAM_BOT_TOKEN і TELEGRAM_WEBHOOK_SECRET" }, { status: 400 });
  const hook = await tg("setWebhook", { url: `${SITE.siteUrl}/api/telegram/webhook`, secret_token: process.env.TELEGRAM_WEBHOOK_SECRET, allowed_updates: ["message", "callback_query"] });
  await tg("setMyCommands", { commands: [
    { command: "menu", description: "Меню адміністратора" },
    { command: "stats", description: "Статистика продажів" },
    { command: "orders", description: "Останні замовлення" },
    { command: "support", description: "Відкриті звернення" },
    { command: "courses", description: "Курси та ціни" },
  ] });
  return NextResponse.json({ ok: Boolean(hook) });
}
