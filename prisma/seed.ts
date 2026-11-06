import { PrismaClient } from "@prisma/client";
import { ALL_SEED } from "../src/data/catalog";

const db = new PrismaClient();

async function main() {
  for (const c of ALL_SEED) {
    const data = {
      title: c.title,
      direction: c.direction,
      kind: c.kind ?? "course",
      short: c.short,
      description: c.description,
      program: (c.program ?? []).join("\n"),
      lessons: c.lessons ?? null,
      price: c.price,
      featured: c.featured ?? false,
      sortOrder: c.sortOrder ?? 100,
      published: c.price > 0,
    };
    // Only create missing courses, never overwrite edits made in the admin panel
    await db.course.upsert({ where: { slug: c.slug }, update: {}, create: { slug: c.slug, ...data } });
  }
  console.log(`Seeded ${ALL_SEED.length} catalog items`);
}

main().finally(() => db.$disconnect());
