/** Minimal Telegram Bot API client (no dependencies). */
const api = (method: string) => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`;

export const tgConfigured = () => Boolean(process.env.TELEGRAM_BOT_TOKEN);

/** Telegram user ids allowed to use admin commands. */
export const adminChatIds = () =>
  (process.env.TELEGRAM_ADMIN_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);

export async function tg<T = unknown>(method: string, body: Record<string, unknown>): Promise<T | null> {
  if (!tgConfigured()) return null;
  try {
    const r = await fetch(api(method), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    if (!j.ok) console.error("telegram", method, j.description);
    return j.ok ? (j.result as T) : null;
  } catch (e) {
    console.error("telegram", method, e);
    return null;
  }
}

export type InlineKb = { text: string; callback_data?: string; url?: string }[][];

export const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);

/** Sends a message to every admin. Returns the sent message ids by chat. */
export async function notifyAdmins(text: string, keyboard?: InlineKb) {
  const out: { chatId: string; messageId: number }[] = [];
  for (const chatId of adminChatIds()) {
    const m = await tg<{ message_id: number }>("sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(keyboard ? { reply_markup: { inline_keyboard: keyboard } } : {}),
    });
    if (m) out.push({ chatId, messageId: m.message_id });
  }
  return out;
}
