// Checks src/i18n/ui/{de,uk,cs,ru}.ts against the English dictionary: missing keys, extra keys,
// wrong value types (string vs function vs list).  Run: npx tsx scripts/i18n-ui.mts [lang]
import { en } from "../src/i18n/ui/en";
import { de } from "../src/i18n/ui/de";
import { uk } from "../src/i18n/ui/uk";
import { cs } from "../src/i18n/ui/cs";
import { ru } from "../src/i18n/ui/ru";

const all = { de, uk, cs, ru } as Record<string, unknown>;
const only = process.argv[2];
let problems = 0;
const kind = (v: unknown) => (Array.isArray(v) ? "list" : typeof v);
function walk(a: unknown, b: unknown, path: string, lang: string) {
  if (b === undefined) return report(lang, path, "missing");
  if (kind(a) !== kind(b)) return report(lang, path, `is ${kind(b)}, English is ${kind(a)}`);
  if (typeof a === "function" && (a as () => void).length !== (b as () => void).length)
    report(lang, path, `function takes ${(b as () => void).length} args, English takes ${(a as () => void).length}`);
  if (Array.isArray(a) && Array.isArray(b) && b.length === 0) report(lang, path, "empty list");
  if (a && typeof a === "object" && !Array.isArray(a)) {
    for (const k of Object.keys(a)) walk((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`, lang);
    for (const k of Object.keys(b as object)) if (!(k in (a as object))) report(lang, `${path}.${k}`, "extra key");
  }
}
function report(lang: string, path: string, msg: string) {
  problems++;
  if (problems < 80) console.log(`${lang}: ${path} — ${msg}`);
}
for (const [lang, d] of Object.entries(all)) if (!only || only === lang) walk(en, d, "", lang);
console.log(problems ? `${problems} problem(s)` : "UI translations complete ✓");
