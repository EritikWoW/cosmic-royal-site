import { db } from "./db";
import { esc, notifyAdmins } from "./telegram";

export async function postUserMessage(threadId: string, text: string) {
  const thread = await db.supportThread.findUniqueOrThrow({ where: { id: threadId } });
  const msg = await db.supportMessage.create({ data: { threadId, author: "USER", text } });
  await db.supportThread.update({ where: { id: threadId }, data: { open: true } });
  const sent = await notifyAdmins(
    `💬 <b>${esc(thread.name)}</b> (${esc(thread.contact)})\n\n${esc(text)}\n\n<i>Відповідайте реплаєм на це повідомлення, і відповідь з'явиться в чаті на сайті.</i>\n#t${thread.id}`,
  );
  if (sent[0]) await db.supportMessage.update({ where: { id: msg.id }, data: { tgMessageId: sent[0].messageId } });
  // Store every admin copy so a reply from any admin routes correctly
  for (const s of sent.slice(1)) {
    await db.supportMessage.create({ data: { threadId, author: "USER", text: "", tgMessageId: s.messageId } }).catch(() => {});
  }
  return msg;
}

export async function postAdminMessage(threadId: string, text: string) {
  return db.supportMessage.create({ data: { threadId, author: "ADMIN", text } });
}
