import { db } from "./db";
import { adminChatIds, esc, tg, type InlineKb } from "./telegram";
import { formatUAH, SITE } from "./site";
import { setFulfilled } from "./orders";
import { postAdminMessage } from "./support";
import { audit } from "./audit";

type TgUser = { id: number; first_name?: string; username?: string };
type TgMessage = { message_id: number; chat: { id: number }; from?: TgUser; text?: string; reply_to_message?: { message_id: number; text?: string } };
type TgCallback = { id: string; from: TgUser; data?: string; message?: TgMessage };
export type TgUpdate = { update_id: number; message?: TgMessage; callback_query?: TgCallback };

const MENU: InlineKb = [
  [{ text: "📊 Статистика", callback_data: "stats" }, { text: "🧾 Замовлення", callback_data: "orders" }],
  [{ text: "💬 Звернення", callback_data: "threads" }, { text: "🎓 Курси", callback_data: "courses" }],
  [{ text: "🌐 Адмінка на сайті", url: `${SITE.siteUrl}/admin` }],
];

const isAdmin = (id?: number) => id !== undefined && adminChatIds().includes(String(id));
const send = (chat_id: number, text: string, kb?: InlineKb) =>
  tg("sendMessage", { chat_id, text, parse_mode: "HTML", disable_web_page_preview: true, ...(kb ? { reply_markup: { inline_keyboard: kb } } : {}) });

const STATUS: Record<string, string> = { PAID: "✅", PENDING: "⏳", DECLINED: "❌", EXPIRED: "⌛", REFUNDED: "↩️" };

async function stats() {
  const since = new Date(Date.now() - 30 * 864e5);
  const [users, paid, paid30, pending, threads, unfulfilled] = await Promise.all([
    db.user.count(),
    db.order.aggregate({ where: { status: "PAID" }, _sum: { amount: true }, _count: true }),
    db.order.aggregate({ where: { status: "PAID", paidAt: { gte: since } }, _sum: { amount: true }, _count: true }),
    db.order.count({ where: { status: "PENDING" } }),
    db.supportThread.count({ where: { open: true } }),
    db.order.count({ where: { status: "PAID", fulfilled: false } }),
  ]);
  return `📊 <b>Статистика</b>\n\n💰 За 30 днів: <b>${formatUAH(paid30._sum.amount || 0)}</b> (${paid30._count} опл.)\n💎 Усього: ${formatUAH(paid._sum.amount || 0)} (${paid._count} опл.)\n🔑 Чекають на доступ: <b>${unfulfilled}</b>\n⏳ Неоплачені замовлення: ${pending}\n👥 Користувачів: ${users}\n💬 Відкритих звернень: ${threads}`;
}

async function orders(chat: number) {
  const list = await db.order.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { items: true } });
  if (!list.length) return send(chat, "Замовлень ще немає.");
  const text = list.map((o) => `${STATUS[o.status]} <b>${formatUAH(o.amount)}</b> · ${esc(o.name)}${o.status === "PAID" ? (o.fulfilled ? " · 🔑" : " · <b>доступ не видано</b>") : ""}\n   ${esc(o.items.map((i) => i.title).join(", "))}\n   <code>${o.reference}</code>`).join("\n\n");
  const kb: InlineKb = list.filter((o) => o.status === "PAID" && !o.fulfilled).map((o) => [{ text: `✅ Видано: ${o.name.slice(0, 20)} (${formatUAH(o.amount)})`, callback_data: `ful:${o.id}` }]);
  return send(chat, `🧾 <b>Останні замовлення</b>\n\n${text}`, kb.length ? kb : undefined);
}

async function threads(chat: number) {
  const list = await db.supportThread.findMany({ where: { open: true }, orderBy: { updatedAt: "desc" }, take: 10, include: { messages: { where: { NOT: { text: "" } }, orderBy: { createdAt: "desc" }, take: 1 } } });
  if (!list.length) return send(chat, "Відкритих звернень немає 🌙");
  for (const t of list) {
    const last = t.messages[0];
    await send(chat, `💬 <b>${esc(t.name)}</b> (${esc(t.contact)})\n${last ? `${last.author === "ADMIN" ? "Ви" : "Клієнт"}: ${esc(last.text.slice(0, 300))}` : ""}\n\n<i>Відповідайте реплаєм.</i>\n#t${t.id}`, [[{ text: "✔️ Закрити звернення", callback_data: `close:${t.id}` }]]);
  }
}

async function courses(chat: number) {
  const list = await db.course.findMany({ orderBy: [{ kind: "asc" }, { sortOrder: "asc" }] });
  const text = list.map((c) => `${c.published ? "🟢" : "⚪️"} ${esc(c.title)} · ${formatUAH(c.price)}\n   <code>${c.slug}</code>`).join("\n");
  return send(chat, `🎓 <b>Курси</b>\n\n${text}\n\nЗмінити ціну: <code>/price slug 1490</code>\nПриховати/показати: <code>/toggle slug</code>`);
}

export async function handleUpdate(u: TgUpdate) {
  if (u.callback_query) {
    const cq = u.callback_query;
    const chat = cq.message?.chat.id;
    if (!isAdmin(cq.from.id) || !chat) return tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Немає доступу" });
    const [cmd, arg, arg2] = (cq.data || "").split(":");
    const actor = `tg:${cq.from.username || cq.from.id}`;
    await tg("answerCallbackQuery", { callback_query_id: cq.id });
    if (cmd === "stats") return send(chat, await stats(), MENU);
    if (cmd === "orders") return orders(chat);
    if (cmd === "threads") return threads(chat);
    if (cmd === "courses") return courses(chat);
    if (cmd === "ful" && arg) {
      const o = await setFulfilled(arg, actor);
      return send(chat, `🔑 Доступ за замовленням <code>${o.reference}</code> позначено як виданий.`);
    }
    if (cmd === "close" && arg) {
      await db.supportThread.update({ where: { id: arg }, data: { open: false } });
      await audit(actor, "thread_closed", { id: arg });
      return send(chat, "✔️ Звернення закрито.");
    }
    if (cmd === "price" && arg && arg2) {
      const c = await db.course.update({ where: { id: arg }, data: { price: Number(arg2) } });
      await audit(actor, "price_changed", { slug: c.slug, price: c.price });
      return send(chat, `💲 Ціну «${esc(c.title)}» змінено на ${formatUAH(c.price)}.`);
    }
    if (cmd === "toggle" && arg) {
      const c = await db.course.findUniqueOrThrow({ where: { id: arg } });
      const n = await db.course.update({ where: { id: arg }, data: { published: !c.published } });
      await audit(actor, "course_toggled", { slug: n.slug, published: n.published });
      return send(chat, `${n.published ? "🟢 Показано" : "⚪️ Приховано"}: ${esc(n.title)}`);
    }
    return;
  }

  const m = u.message;
  if (!m?.text) return;
  const chat = m.chat.id;
  if (!isAdmin(m.from?.id)) {
    return send(chat, `Вітаю! Це службовий бот сайту ${esc(SITE.mentorName)}.\nКаталог курсів і AI-помічник: ${SITE.siteUrl}\n\nВаш Telegram ID: <code>${m.from?.id}</code>`);
  }

  // Reply to a support notification → answer goes to the site chat
  if (m.reply_to_message) {
    const tag = m.reply_to_message.text?.match(/#t([a-z0-9]+)/i)?.[1];
    const threadId = tag || (await db.supportMessage.findFirst({ where: { tgMessageId: m.reply_to_message.message_id } }))?.threadId;
    if (threadId) {
      await postAdminMessage(threadId, m.text);
      await db.supportThread.update({ where: { id: threadId }, data: { open: true } });
      return send(chat, "📨 Відповідь надіслано в чат на сайті.");
    }
  }

  const [cmd, a1, a2] = m.text.trim().split(/\s+/);
  switch (cmd.split("@")[0]) {
    case "/start":
    case "/menu":
      return send(chat, `🌙 <b>Адмін-панель ${esc(SITE.mentorName)}</b>\n\nСюди приходять оплати та повідомлення з сайту.`, MENU);
    case "/stats": return send(chat, await stats(), MENU);
    case "/orders": return orders(chat);
    case "/support": return threads(chat);
    case "/courses": return courses(chat);
    case "/price": {
      const c = a1 ? await db.course.findUnique({ where: { slug: a1 } }) : null;
      const p = Number(a2);
      if (!c || !Number.isInteger(p) || p <= 0) return send(chat, "Формат: <code>/price slug 1490</code>");
      return send(chat, `Змінити ціну «${esc(c.title)}» з ${formatUAH(c.price)} на <b>${formatUAH(p)}</b>?`, [[{ text: "✅ Так, змінити", callback_data: `price:${c.id}:${p}` }]]);
    }
    case "/toggle": {
      const c = a1 ? await db.course.findUnique({ where: { slug: a1 } }) : null;
      if (!c) return send(chat, "Формат: <code>/toggle slug</code>");
      return send(chat, `${c.published ? "Приховати" : "Показати"} «${esc(c.title)}» на сайті?`, [[{ text: "✅ Так", callback_data: `toggle:${c.id}` }]]);
    }
    default:
      return send(chat, "Оберіть дію:", MENU);
  }
}
