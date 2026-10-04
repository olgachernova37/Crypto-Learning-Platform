// Writes the English lesson text template (docs/i18n/lessons.en.json) and checks every translation
// file for missing/extra keys and wrong array lengths.  Run: npx tsx scripts/i18n-lessons.mts
import fs from "node:fs";
import { lessonsText } from "../src/content/i18n";

const en = lessonsText();
fs.mkdirSync("docs/i18n", { recursive: true });
fs.writeFileSync("docs/i18n/lessons.en.json", JSON.stringify(en, null, 2) + "\n");

let problems = 0;
const walk = (a: unknown, b: unknown, path: string, lang: string) => {
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return report(lang, path, "missing or not a list");
    // body paragraphs may differ in count; quiz pairs/answers must not be empty
    if (b.length === 0) return report(lang, path, "empty list");
    if (path.endsWith(".pairs") && a.length !== b.length) return report(lang, path, `has ${b.length} pairs, English has ${a.length}`);
    if (path.endsWith(".pairs")) a.forEach((x, i) => walk(x, b[i], `${path}[${i}]`, lang));
    return;
  }
  if (a && typeof a === "object") {
    if (!b || typeof b !== "object") return report(lang, path, "missing");
    for (const k of Object.keys(a)) walk((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`, lang);
    for (const k of Object.keys(b)) if (!(k in (a as object))) report(lang, `${path}.${k}`, "extra key (typo?)");
    return;
  }
  if (typeof b !== "string" || !b.trim()) report(lang, path, "missing text");
};
function report(lang: string, path: string, msg: string) {
  problems++;
  if (problems < 60) console.log(`${lang}: ${path} — ${msg}`);
}
for (const lang of ["uk", "cs", "ru"]) {
  const file = `src/content/i18n/${lang}.json`;
  walk(en, JSON.parse(fs.readFileSync(file, "utf8")), "", lang);
}
console.log(problems ? `${problems} problem(s)` : "all lesson translations complete ✓");
