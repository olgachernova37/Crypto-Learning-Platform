// Who registered: kept in Upstash Redis (Vercel Marketplace → Upstash, free tier) through its REST API.
// Vercel adds KV_REST_API_URL / KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL / _TOKEN) automatically.
// Without them, registration still works on the learner's device; the admin page just says so.
import "server-only";

export type Learner = { id: string; name: string; locale: string; joinedAt: string; lastSeen: string };

const KEY = "cv:learners";
const url = () => (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/$/, "");
const token = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
export const storageConfigured = () => !!url() && !!token();

async function redis<T>(command: (string | number)[]): Promise<T> {
  const res = await fetch(url(), {
    method: "POST",
    headers: { authorization: `Bearer ${token()}`, "content-type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || data.error) throw new Error(`redis ${res.status}: ${data.error ?? ""}`);
  return data.result as T;
}

export async function saveLearner(l: { id: string; name: string; locale: string }): Promise<void> {
  if (!storageConfigured()) return;
  const now = new Date().toISOString();
  const prev = await redis<string | null>(["HGET", KEY, l.id]);
  const joinedAt = prev ? ((JSON.parse(prev) as Learner).joinedAt ?? now) : now;
  await redis(["HSET", KEY, l.id, JSON.stringify({ ...l, joinedAt, lastSeen: now } satisfies Learner)]);
}

export async function listLearners(): Promise<Learner[]> {
  if (!storageConfigured()) return [];
  const flat = await redis<string[]>(["HGETALL", KEY]);
  const out: Learner[] = [];
  for (let i = 1; i < flat.length; i += 2) {
    try {
      out.push(JSON.parse(flat[i]) as Learner);
    } catch {
      /* skip a broken row */
    }
  }
  return out.sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
}

/** Names are shown back to the admin only; still keep them short and plain. */
export function cleanName(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
}
