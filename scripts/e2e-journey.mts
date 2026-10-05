// End-to-end "a learner's whole voyage": landing → name → route → all lessons (reading, quizzes,
// boss battles, practice wallet) → finale NFT → progress page. Like a real person: no admin shortcuts.
// Some answers are deliberately wrong, to check that the correct one + explanation show up at once.
//
// On every screen it also checks: no page crash, nothing wider than the screen, no English UI text
// left in other languages, and that "select all that apply" quizzes really use square checkboxes.
//
// Run against a running site (build first: npm run build && npm start):
//   npx tsx scripts/e2e-journey.mts                         # all 4 languages × phone + laptop
//   npx tsx scripts/e2e-journey.mts --locales=uk --sizes=phone --base=https://…vercel.app
//   --headed shows the browser, --slow adds pauses, --reduced-motion turns animations off
// Screenshots of failures land in test-results/.
// Without devnet access the practice wallet switches to practice mode, just like for a real learner.
import { chromium, type Browser, type Page } from "playwright";
import fs from "node:fs";
import { lessons } from "../src/content/lessons";
import { localizeLesson } from "../src/content/i18n";
import { LOCALES, type Locale } from "../src/i18n/locales";
import { dictFor } from "../src/i18n/dict";
import { en as EN } from "../src/i18n/ui/en";
import type { Quiz } from "../src/content/types";

const arg = (k: string) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
const flag = (k: string) => process.argv.includes(`--${k}`);
const BASE = (arg("base") ?? process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const locales = (arg("locales")?.split(",") ?? [...LOCALES]) as Locale[];
const SIZES = { phone: { width: 390, height: 844 }, small: { width: 360, height: 640 }, laptop: { width: 1366, height: 768 } };
const sizes = (arg("sizes")?.split(",") ?? ["phone", "laptop"]) as (keyof typeof SIZES)[];
const PARALLEL = Number(arg("parallel") ?? 4);
const T = 20_000; // max wait for any one thing

const STEP_XP = 10;
const ROUND_XP = 10;

/** Every 3rd question is answered wrong on purpose (index counts quizzes + boss rounds in order). */
const wrongOnPurpose = (n: number) => n % 3 === 1;

// ---------- helpers ----------

/** English UI strings that must not show up when another language is chosen. */
function englishLeftovers(locale: Locale): string[] {
  if (locale === "en") return [];
  const local = dictFor(locale) as unknown as Record<string, unknown>;
  const out: string[] = [];
  const walk = (a: unknown, b: unknown) => {
    if (typeof a === "string") {
      if (a !== b && a.length >= 12 && a.includes(" ") && !/[{}<>]/.test(a)) out.push(a);
    } else if (a && typeof a === "object" && !Array.isArray(a)) {
      for (const k of Object.keys(a)) walk((a as Record<string, unknown>)[k], (b as Record<string, unknown> | undefined)?.[k]);
    }
  };
  walk(EN, local);
  return out;
}

class Run {
  log: string[] = [];
  problems: string[] = [];
  quizNo = 0;
  xp = 0;
  wrong = 0;
  right = 0;
  constructor(
    public page: Page,
    public locale: Locale,
    public size: string,
    public leftovers: string[],
  ) {}
  get tag() {
    return `${this.locale}/${this.size}`;
  }
  fail(msg: string) {
    this.problems.push(msg);
  }

  /** Checks that run on every screen. */
  async screen(name: string) {
    const p = this.page;
    const { overflow, text } = await p.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      text: document.body.innerText,
    }));
    if (overflow > 1) this.fail(`${name}: page is ${overflow}px wider than the screen`);
    for (const s of this.leftovers) if (text.includes(s)) this.fail(`${name}: English text left: "${s}"`);
  }

  async shot(name: string) {
    fs.mkdirSync("test-results", { recursive: true });
    const file = `test-results/${this.locale}-${this.size}-${name.replace(/[^a-z0-9]+/gi, "-")}.png`;
    await this.page.screenshot({ path: file, fullPage: false }).catch(() => {});
    return file;
  }
}

/** A piece of the question that is plain text on screen (a fill-in question has an input where "___" is). */
const probe = (q: Quiz) => (q.question.split("___")[0].trim() || q.question.split("___")[1]?.trim() || q.question).slice(0, 30);

const byTest = (p: Page, id: string) => p.locator(`[data-testid="${id}"]`);
/** Is it on screen right now (no waiting)? */
const shown = async (p: Page, id: string) => (await byTest(p, id).count()) > 0 && (await byTest(p, id).first().isVisible());
const usable = async (p: Page, id: string) => (await shown(p, id)) && (await byTest(p, id).first().isEnabled({ timeout: 1000 }));

async function clickWhenEnabled(p: Page, id: string) {
  const el = byTest(p, id).first();
  await el.waitFor({ state: "visible", timeout: T });
  await p.waitForFunction((sel) => !(document.querySelector(sel) as HTMLButtonElement | null)?.disabled, `[data-testid="${id}"]`, {
    timeout: T,
  });
  await el.click();
}

/** Picks an answer (right or deliberately wrong) the way a person would: tapping the visible cards. */
async function answer(p: Page, q: Quiz, wrong: boolean, scope: string, run: Run) {
  const t = dictFor(run.locale);
  const root = p.locator(scope);
  switch (q.kind) {
    case "single": {
      const id = wrong ? q.options.find((o) => o.id !== q.correct)!.id : q.correct;
      await root.locator(`label:has(input[data-option="${id}"])`).click();
      break;
    }
    case "multiple": {
      // UI promise: square checkboxes + "Select all that apply"
      const types = await root.locator("input[data-option]").evaluateAll((els) => els.map((e) => (e as HTMLInputElement).type));
      if (types.some((x) => x !== "checkbox")) run.fail(`multiple-choice "${q.question}" is not using checkboxes`);
      const round = await root.locator("label:has(input[data-option]) > span:last-of-type").first().evaluate((el) => {
        const cs = getComputedStyle(el);
        return { r: parseFloat(cs.borderTopLeftRadius), w: el.getBoundingClientRect().width };
      });
      if (!(round.r < round.w / 2 - 1)) run.fail(`multiple-choice "${q.question}": the box is round, not square`);
      if (!(await root.getByText(t.quiz.kind.multiple).count())) run.fail(`multiple-choice "${q.question}": no "${t.quiz.kind.multiple}" label`);
      const ids = wrong ? [q.options.find((o) => !q.correct.includes(o.id))!.id] : q.correct;
      for (const id of ids) await root.locator(`label:has(input[data-option="${id}"])`).click();
      break;
    }
    case "truefalse":
      await root.locator(`label:has(input[data-tf="${wrong ? !q.correct : q.correct}"])`).click();
      break;
    case "fill":
      await root.getByRole("textbox").fill(wrong ? "zzz" : q.answers[0]);
      break;
    case "match":
      for (let i = 0; i < q.pairs.length; i++) {
        await root.locator(`[data-left="${i}"]`).click();
        await root.locator(`[data-right="${wrong ? (i + 1) % q.pairs.length : i}"]`).click();
      }
      break;
  }
}

/** After "Check": the verdict, and for a wrong answer the correct one + the explanation, right away. */
async function verifyFeedback(p: Page, q: Quiz, wrong: boolean, scope: string, run: Run, where: string) {
  const fb = p.locator(`${scope} [data-testid="quiz-feedback"]`).first();
  await fb.waitFor({ state: "visible", timeout: T });
  const correct = (await fb.getAttribute("data-correct")) === "true";
  if (correct === wrong) run.fail(`${where}: answered ${wrong ? "wrong" : "right"} but the feedback says ${correct ? "correct" : "wrong"}`);
  const text = await fb.innerText();
  const expl = q.explanation.trim().slice(0, 40);
  if (!text.includes(expl)) run.fail(`${where}: explanation not shown in the feedback`);
  if (wrong) {
    run.wrong++;
    const page = await p.locator(scope).innerText();
    const shown =
      q.kind === "single"
        ? page.includes(q.options.find((o) => o.id === q.correct)!.text)
        : q.kind === "multiple"
          ? q.options.filter((o) => q.correct.includes(o.id)).every((o) => page.includes(o.text))
          : q.kind === "fill"
            ? page.includes(q.answers[0])
            : true;
    if (!shown) run.fail(`${where}: the correct answer is not shown after a wrong answer`);
  } else run.right++;
}

async function doPractice(p: Page, run: Run, where: string) {
  const until = Date.now() + 60_000;
  while (Date.now() < until) {
    if (await shown(p, "practice-done")) return;
    if (await shown(p, "practice-switch")) {
      run.log.push(`${where}: devnet not reachable → practice mode`);
      await byTest(p, "practice-switch").click();
    } else if (await usable(p, "practice-faucet")) {
      await byTest(p, "practice-faucet").click();
    } else if (await usable(p, "practice-run")) {
      await byTest(p, "practice-run").click();
    } else if (!(await byTest(p, "practice-run").count()) && !(await byTest(p, "practice-done").count())) {
      return; // a receipt-only box that is already filled in
    }
    await p.waitForTimeout(400);
  }
  run.fail(`${where}: practice box never finished`);
}

async function fightBoss(p: Page, run: Run, rounds: Quiz[], where: string) {
  const scope = '[data-testid="boss"]';
  for (let r = 0; r < rounds.length; r++) {
    const q = rounds[r];
    const wrong = wrongOnPurpose(run.quizNo++);
    await p.locator(scope).getByText(probe(q)).first().waitFor({ timeout: T });
    await answer(p, q, wrong, scope, run);
    await clickWhenEnabled(p, "boss-action"); // strike
    await verifyFeedback(p, q, wrong, scope, run, `${where} round ${r + 1}`);
    run.xp += wrong ? ROUND_XP / 2 : ROUND_XP;
    await clickWhenEnabled(p, "boss-action"); // next round / finish
  }
  await p.waitForSelector(`${scope}[data-won="true"]`, { timeout: T });
}

async function playLesson(p: Page, run: Run, n: number) {
  const lesson = localizeLesson(lessons[n], run.locale);
  const where = `L${n + 1} ${lesson.id}`;
  await p.waitForURL(`**/lesson/${lesson.id}`, { timeout: T });
  await clickWhenEnabled(p, "lesson-start");

  for (const step of lesson.steps) {
    const w = `${where}/${step.id}`;
    const h1 = p.locator("main h1").first();
    await h1.waitFor({ timeout: T });
    const title = (await h1.innerText()).trim();
    if (title !== step.title.trim()) run.fail(`${w}: heading is "${title}", expected "${step.title}"`);
    await run.screen(`${w} read`);
    if (step.boss) await fightBoss(p, run, step.boss.rounds, w);
    if (step.practice) await doPractice(p, run, w);
    await clickWhenEnabled(p, "lesson-next");
    run.xp += STEP_XP;

    if (step.quiz) {
      const wrong = wrongOnPurpose(run.quizNo++);
      await p.getByText(probe(step.quiz)).first().waitFor({ timeout: T });
      await answer(p, step.quiz, wrong, "main", run);
      await run.screen(`${w} quiz`);
      await clickWhenEnabled(p, "lesson-next"); // Check
      await verifyFeedback(p, step.quiz, wrong, "main", run, w);
      const label = await byTest(p, "lesson-next").innerText();
      if (/try again|ещё раз|ще раз|znovu/i.test(label)) run.fail(`${w}: shows a "try again" loop`);
      await clickWhenEnabled(p, "lesson-next"); // Continue / Finish
    }
  }

  // completion screen
  await clickWhenEnabled(p, "claim-xp");
  run.xp += lesson.xp;
  await run.screen(`${where} complete`);
  await clickWhenEnabled(p, "next-stop");
}

async function journey(browser: Browser, locale: Locale, size: keyof typeof SIZES): Promise<Run> {
  const ctx = await browser.newContext({ viewport: SIZES[size], reducedMotion: flag("reduced-motion") ? "reduce" : "no-preference" });
  await ctx.addInitScript((l) => {
    if (!localStorage.getItem("crypto-voyage-locale")) localStorage.setItem("crypto-voyage-locale", l);
  }, locale);
  const page = await ctx.newPage();
  const run = new Run(page, locale, size, englishLeftovers(locale));
  page.on("pageerror", (e) => run.fail(`page crashed: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const s = m.text();
    // a learner without devnet access sees a friendly message; the browser still logs the failed request
    if (/devnet|8899|Failed to load resource|ERR_|fetch failed|NetworkError|rpc/i.test(s)) return;
    run.fail(`console error: ${s.slice(0, 200)}`);
  });
  const t0 = Date.now();
  try {
    // landing → name
    await page.goto(BASE + "/");
    // the server sends English; the chosen language switches in once the page is running
    const flashStart = Date.now();
    await page.waitForFunction((cta) => document.querySelector('[data-testid="start-journey"]')?.textContent?.includes(cta), dictFor(locale).home.cta, {
      timeout: T,
    });
    if (Date.now() - flashStart > 1500) run.log.push(`landing: English showed for ${Date.now() - flashStart}ms before switching`);
    await run.screen("landing");
    const noScroll = await page.evaluate(() => {
      const st = document.querySelector('[class*="stage"]');
      return st ? st.scrollHeight - st.clientHeight : 0;
    });
    if (noScroll > 1) run.fail(`landing scrolls by ${noScroll}px`);
    await clickWhenEnabled(page, "start-journey");
    const dialog = page.getByRole("dialog");
    await dialog.waitFor({ timeout: T });
    await dialog.getByRole("textbox").fill(`Tester ${locale}`);
    await dialog.locator('[type="submit"]').click();

    // the route: open the first stop
    await page.waitForURL("**/journey", { timeout: T });
    await run.screen("journey");
    await clickWhenEnabled(page, "open-stop");

    for (let n = 0; n < lessons.length; n++) await playLesson(page, run, n);

    // finale: mint the mascot into the training wallet
    await page.waitForURL("**/finale", { timeout: T });
    await run.screen("finale");
    const mintUntil = Date.now() + 60_000;
    while (!(await shown(page, "minted")) && Date.now() < mintUntil) {
      if (await shown(page, "mint-switch")) await byTest(page, "mint-switch").click();
      else if (await usable(page, "mint")) await byTest(page, "mint").click({ force: true });
      await page.waitForTimeout(700);
    }
    if (!(await shown(page, "minted"))) run.fail("finale: the mascot was never minted");

    // progress: XP adds up, every lesson finished, NFT claimed
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("crypto-voyage-progress-v1") ?? "{}"));
    if (saved.xp !== run.xp) run.fail(`XP is ${saved.xp}, expected ${run.xp}`);
    if ((saved.completedLessons ?? []).length !== lessons.length)
      run.fail(`${(saved.completedLessons ?? []).length} of ${lessons.length} lessons marked finished`);
    if (!saved.nftClaimed) run.fail("NFT not marked as claimed");
    await page.goto(BASE + "/progress");
    await page.waitForTimeout(800);
    await run.screen("progress");
    const progressText = await page.locator("main").innerText();
    if (!progressText.replace(/\s/g, "").includes(String(run.xp))) run.fail(`progress page doesn't show ${run.xp} XP`);
  } catch (e) {
    run.fail(`stopped: ${(e as Error).message.split("\n")[0]}`);
  }
  if (run.problems.length) run.log.push(`screenshot: ${await run.shot("last")}`);
  run.log.push(`${((Date.now() - t0) / 1000).toFixed(0)}s · ${run.right} right + ${run.wrong} wrong answers · ${run.xp} XP`);
  await ctx.close();
  return run;
}

// ---------- main ----------
const browser = await chromium.launch({ headless: !flag("headed"), slowMo: flag("slow") ? 150 : 0 });
const jobs = locales.flatMap((l) => sizes.map((s) => [l, s] as const));
console.log(`Testing ${jobs.length} full voyages on ${BASE} (${lessons.length} lessons each)…\n`);
const results: Run[] = [];
let next = 0;
await Promise.all(
  Array.from({ length: Math.min(PARALLEL, jobs.length) }, async () => {
    while (next < jobs.length) {
      const [l, s] = jobs[next++];
      const r = await journey(browser, l, s);
      results.push(r);
      console.log(`${r.problems.length ? "✗" : "✓"} ${r.tag.padEnd(10)} ${r.log.at(-1)}`);
      for (const pr of r.problems.slice(0, 15)) console.log(`    - ${pr}`);
      if (r.problems.length > 15) console.log(`    … and ${r.problems.length - 15} more`);
      for (const l2 of r.log.slice(0, -1)) if (l2.startsWith("screenshot")) console.log(`    ${l2}`);
    }
  }),
);
await browser.close();
const bad = results.filter((r) => r.problems.length);
console.log(bad.length ? `\n${bad.length} of ${results.length} voyages had problems.` : `\nAll ${results.length} voyages passed ✓`);
process.exit(bad.length ? 1 : 0);
