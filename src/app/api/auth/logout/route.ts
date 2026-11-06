import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";
import { SITE } from "@/lib/site";

export async function POST() {
  await destroySession();
  return NextResponse.redirect(`${SITE.siteUrl}/`, 303);
}
