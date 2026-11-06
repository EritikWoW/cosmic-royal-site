import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { AI_MODEL, buildSystemPrompt } from "@/lib/ai";
import { clientIp, rateLimit } from "@/lib/ratelimit";

const Body = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).min(1).max(40),
});

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return new Response("AI-помічник ще не налаштований. Напиши наставниці у вкладці «Наставниця».", { status: 503 });
  if (!rateLimit("ai:" + clientIp(req.headers), 20, 60_000)) return new Response("Забагато запитів, зачекай хвилинку 🙏", { status: 429 });
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success || p.data.messages.at(-1)?.role !== "user") return new Response("Bad request", { status: 400 });

  // Keep the last turns only, starting with a user turn
  let msgs = p.data.messages.slice(-20);
  while (msgs.length && msgs[0].role !== "user") msgs = msgs.slice(1);

  const client = new Anthropic();
  const system = await buildSystemPrompt();
  const stream = client.messages.stream({
    model: AI_MODEL,
    max_tokens: 1024,
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages: msgs,
  });

  const enc = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      try {
        for await (const ev of stream) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") controller.enqueue(enc.encode(ev.delta.text));
        }
      } catch (e) {
        console.error("ai", e);
        controller.enqueue(enc.encode("\n\nВибач, сталася помилка. Спробуй ще раз або напиши наставниці."));
      } finally {
        controller.close();
      }
    },
    cancel() { stream.abort(); },
  });
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}
