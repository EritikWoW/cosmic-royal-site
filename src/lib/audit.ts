import { db } from "./db";
import type { Prisma } from "@prisma/client";

export const audit = (actor: string, action: string, data?: Prisma.InputJsonValue) =>
  db.auditLog.create({ data: { actor, action, data } }).catch((e) => console.error("audit", e));
