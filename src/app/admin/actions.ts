"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { setFulfilled } from "@/lib/orders";
import { postAdminMessage } from "@/lib/support";

async function admin() {
  const u = await requireAdmin();
  if (!u) throw new Error("forbidden");
  return `web:${u.email}`;
}

export async function markFulfilled(fd: FormData) {
  const actor = await admin();
  await setFulfilled(String(fd.get("id")), actor);
  revalidatePath("/admin", "layout");
}

export async function saveCourse(fd: FormData) {
  const actor = await admin();
  const id = String(fd.get("id") || "");
  const s = (k: string) => String(fd.get(k) || "").trim();
  const data = {
    title: s("title"),
    slug: s("slug").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, ""),
    direction: s("direction"),
    kind: s("kind") === "level" ? "level" : "course",
    short: s("short"),
    description: s("description"),
    program: s("program"),
    format: s("format"),
    accessInfo: s("accessInfo"),
    price: Math.max(0, Math.round(Number(s("price")) || 0)),
    oldPrice: s("oldPrice") ? Math.round(Number(s("oldPrice"))) : null,
    lessons: s("lessons") ? Math.round(Number(s("lessons"))) : null,
    sortOrder: Math.round(Number(s("sortOrder")) || 100),
    published: fd.get("published") === "on",
    featured: fd.get("featured") === "on",
  };
  if (!data.title || !data.slug) throw new Error("Назва і slug обов'язкові");
  const c = id ? await db.course.update({ where: { id }, data }) : await db.course.create({ data });
  await audit(actor, id ? "course_updated" : "course_created", { slug: c.slug, price: c.price, published: c.published });
  revalidatePath("/", "layout");
  redirect("/admin/courses");
}

export async function deleteCourse(fd: FormData) {
  const actor = await admin();
  const id = String(fd.get("id"));
  const used = await db.orderItem.count({ where: { courseId: id } });
  if (used) await db.course.update({ where: { id }, data: { published: false } });
  else await db.course.delete({ where: { id } });
  await audit(actor, used ? "course_hidden" : "course_deleted", { id });
  revalidatePath("/", "layout");
  redirect("/admin/courses");
}

export async function replySupport(fd: FormData) {
  await admin();
  const id = String(fd.get("id"));
  const text = String(fd.get("text") || "").trim();
  if (text) await postAdminMessage(id, text);
  revalidatePath(`/admin/support/${id}`);
}

export async function toggleThread(fd: FormData) {
  const actor = await admin();
  const id = String(fd.get("id"));
  const t = await db.supportThread.findUniqueOrThrow({ where: { id } });
  await db.supportThread.update({ where: { id }, data: { open: !t.open } });
  await audit(actor, t.open ? "thread_closed" : "thread_reopened", { id });
  revalidatePath("/admin/support", "layout");
}

export async function setRole(fd: FormData) {
  const actor = await admin();
  const id = String(fd.get("id"));
  const role = fd.get("role") === "ADMIN" ? "ADMIN" : "USER";
  await db.user.update({ where: { id }, data: { role } });
  await audit(actor, "role_changed", { id, role });
  revalidatePath("/admin/users");
}

export async function saveReview(fd: FormData) {
  const actor = await admin();
  const s = (k: string) => String(fd.get(k) || "").trim();
  const data = { name: s("name"), text: s("text"), rating: Math.min(5, Math.max(1, Number(s("rating")) || 5)), photo: s("photo") || null, published: true };
  if (!data.name || !data.text) throw new Error("Ім'я і текст обов'язкові");
  const r = await db.review.create({ data });
  await audit(actor, "review_created", { id: r.id });
  revalidatePath("/", "layout");
}

export async function toggleReview(fd: FormData) {
  const actor = await admin();
  const id = String(fd.get("id"));
  const del = fd.get("delete") === "1";
  if (del) await db.review.delete({ where: { id } });
  else {
    const r = await db.review.findUniqueOrThrow({ where: { id } });
    await db.review.update({ where: { id }, data: { published: !r.published } });
  }
  await audit(actor, del ? "review_deleted" : "review_toggled", { id });
  revalidatePath("/", "layout");
}
