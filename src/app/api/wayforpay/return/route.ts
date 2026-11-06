import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";

/** WayForPay returns the buyer here with a POST; send them to the result page. */
async function handle(req: Request) {
  const ref = new URL(req.url).searchParams.get("ref") || "";
  return NextResponse.redirect(`${SITE.siteUrl}/payment/result?ref=${encodeURIComponent(ref)}`, 303);
}
export const POST = handle;
export const GET = handle;
