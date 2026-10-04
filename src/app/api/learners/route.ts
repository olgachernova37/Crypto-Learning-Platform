// POST {id, name, locale}: a learner introduces themselves (name only, no email, no password).
// DELETE {id}: "Delete my data" on /privacy.
import { isLocale } from "@/i18n/locales";
import { cleanName, deleteLearner, saveLearner } from "@/lib/server/learners";

const hits = new Map<string, number[]>();

function tooMany(request: Request): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 10) return true;
  hits.set(ip, [...recent, now]);
  if (hits.size > 5000) hits.clear();
  return false;
}

const validId = (v: unknown) => (typeof v === "string" && /^[a-zA-Z0-9-]{8,64}$/.test(v) ? v : "");

export async function DELETE(request: Request) {
  if (tooMany(request)) return Response.json({ ok: false }, { status: 429 });
  let body: { id?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    /* empty */
  }
  const id = validId(body.id);
  if (!id) return Response.json({ ok: false }, { status: 400 });
  try {
    await deleteLearner(id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[api/learners]", err instanceof Error ? err.message : err);
    return Response.json({ ok: false }, { status: 502 });
  }
}

export async function POST(request: Request) {
  if (tooMany(request)) return Response.json({ ok: false }, { status: 429 });

  let body: { id?: unknown; name?: unknown; locale?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    /* empty */
  }
  const id = validId(body.id);
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
