import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";

const COOKIE = "cr_session";
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me-dev-secret-change-me");

export type Session = { uid: string; role: "USER" | "ADMIN" };

export async function createSession(s: Session) {
  const token = await new SignJWT(s).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("30d").sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function verifyToken(token?: string): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { uid: String(payload.uid), role: payload.role === "ADMIN" ? "ADMIN" : "USER" };
  } catch {
    return null;
  }
}

export async function getSession() {
  return verifyToken((await cookies()).get(COOKIE)?.value);
}

export async function getUser() {
  const s = await getSession();
  if (!s) return null;
  return db.user.findUnique({ where: { id: s.uid }, select: { id: true, email: true, name: true, phone: true, telegram: true, role: true } });
}

export async function requireAdmin() {
  const u = await getUser();
  if (!u || u.role !== "ADMIN") return null;
  return u;
}

export const hashPassword = (p: string) => bcrypt.hash(p, 10);
export const checkPassword = (p: string, h: string) => bcrypt.compare(p, h);

/** Emails listed in ADMIN_EMAILS become admins on registration/login. */
export const isAdminEmail = (email: string) =>
  (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean).includes(email.toLowerCase());

export const SESSION_COOKIE = COOKIE;
