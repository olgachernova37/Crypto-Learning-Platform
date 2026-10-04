// The list of registered learners, for the admin page only.
import { isAdmin } from "@/lib/server/admin";
import { listLearners, storageConfigured } from "@/lib/server/learners";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "forbidden" }, { status: 403 });
  if (!storageConfigured()) return Response.json({ storage: false, learners: [] }, { headers: { "cache-control": "no-store" } });
  try {
    return Response.json({ storage: true, learners: await listLearners() }, { headers: { "cache-control": "no-store" } });
  } catch (err) {
    console.error("[api/admin/learners]", err instanceof Error ? err.message : err);
    return Response.json({ storage: true, error: "unreachable", learners: [] }, { status: 502 });
  }
}
