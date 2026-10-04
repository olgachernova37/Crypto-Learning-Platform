// GET: am I admin? · POST {password}: log in · DELETE: log out.
import { cookies } from "next/headers";
import { ADMIN_COOKIE, adminConfigured, checkPassword, isAdmin, newToken } from "@/lib/server/admin";

export async function GET() {
  return Response.json({ admin: await isAdmin(), configured: adminConfigured() }, { headers: { "cache-control": "no-store" } });
}

// slow down password guessing (per server instance)
const attempts = new Map<string, number[]>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 8) return Response.json({ error: "tooMany" }, { status: 429 });

  let password = "";
  try {
    password = String(((await request.json()) as { password?: unknown }).password ?? "");
  } catch {
    /* empty */
  }
  if (!adminConfigured()) return Response.json({ error: "notConfigured" }, { status: 503 });
  if (!checkPassword(password)) {
    attempts.set(ip, [...recent, now]);
    return Response.json({ error: "wrong" }, { status: 401 });
  }
  attempts.delete(ip);
  const { value, maxAge } = newToken();
  (await cookies()).set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return Response.json({ admin: true });
}

export async function DELETE() {
  (await cookies()).delete(ADMIN_COOKIE);
  return Response.json({ admin: false });
}
