import { db } from "./db";
import { directionByKey } from "./directions";
import type { Course } from "@prisma/client";
import type { CourseLite } from "@/components/CourseCard";

export const toLite = (c: Course): CourseLite => {
  const d = directionByKey(c.direction);
  return { id: c.id, slug: c.slug, title: c.title, short: c.short, price: c.price, cover: d.cover, directionTitle: d.title, kind: c.kind, lessons: c.lessons, featured: c.featured };
};

export const publishedCourses = () =>
  db.course.findMany({ where: { published: true }, orderBy: [{ kind: "asc" }, { sortOrder: "asc" }, { price: "asc" }] });
