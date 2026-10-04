// Admin session: one shared password (ADMIN_PASSWORD, server env only). After login the browser
// gets an httpOnly cookie holding "expiry.signature" (HMAC-SHA256 with ADMIN_SECRET, or the password
// itself if no separate secret is set). Nothing secret is ever sent to the client.
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "cv_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // a week: enough for hackathon demos

const password = () => process.env.ADMIN_PASSWORD?.trim() || "";
const secret = () => process.env.ADMIN_SECRET?.trim() || password();

export const adminConfigured = () => password().length > 0;

const sign = (payload: string) => createHmac("sha256", secret()).update(`cv-admin:${payload}`).digest("base64url");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(input: string): boolean {
  return adminConfigured() && safeEqual(input, password());
}

export function newToken(): { value: string; maxAge: number } {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return { value: `${exp}.${sign(exp)}`, maxAge: MAX_AGE };
}

export function verifyToken(token: string | undefined): boolean {
  if (!token || !adminConfigured()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, sign(exp));
}

export async function isAdmin(): Promise<boolean> {
  return verifyToken((await cookies()).get(ADMIN_COOKIE)?.value);
}
