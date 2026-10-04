// POST {id, name, locale}: a learner introduces themselves (name only, no email, no password).
import { isLocale } from "@/i18n/locales";
import { cleanName, saveLearner } from "@/lib/server/learners";

const hits = new Map<string, number[]>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 10) return Response.json({ ok: false }, { status: 429 });
  hits.set(ip, [...recent, now]);
  if (hits.size > 5000) hits.clear();

  let body: { id?: unknown; name?: unknown; locale?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    /* empty */
  }
  const id = typeof body.id === "string" && /^[a-zA-Z0-9-]{8,64}$/.test(body.id) ? body.id : "";
  const name = cleanName(body.name);
  if (!id || !name) return Response.json({ ok: false }, { status: 400 });
  try {
    await saveLearner({ id, name, locale: isLocale(body.locale) ? body.locale : "en" });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[api/learners]", err instanceof Error ? err.message : err);
    return Response.json({ ok: false }, { status: 502 });
  }
}
