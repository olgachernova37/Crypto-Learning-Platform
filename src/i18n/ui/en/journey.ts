// English UI strings: journey. Other languages translate this exact shape (src/i18n/ui/{de,cs,ru,uk}.ts).
const pad = (n: number) => String(n).padStart(2, "0");

export const journey = {
  /** Screen-reader only page heading of the boat route. */
  srTitle: "Your route: pick a lesson",
  /** Small pill top-left, leads back to the landing page. */
  backToStart: "Back to the start",
  /** Counter bottom-left, e.g. "Stop 03 / 10". */
  stopCounter: (current: number, total: number) => `Stop ${pad(current)} / ${pad(total)}`,
  /** Hint under the counter (fades out once the learner moves). */
  hint: "Scroll, drag or use ← → to sail",
  prevAria: "Sail to the previous stop",
  nextAria: "Sail to the next stop",
  /** aria-label of a stop marker on the map, e.g. "Lesson 01: What is crypto (finished)". */
  stopAria: (name: string, title: string, finished: boolean) =>
    `${name}: ${title}${finished ? " (finished)" : ""}`,
  /** Under a lesson's summary, e.g. "~5 min · +50 XP". */
  lessonMeta: (minutes: number, xp: number) => `~${minutes} min · +${xp} XP`,
  /** Badge before the meta line on a finished stop (very short). */
  done: "Done",
  startLesson: "Start lesson",
  reviewLesson: "Review lesson",
  reward: {
    /** Small label above the reward stop's text (where lessons show "Lesson 01"). */
    label: "The finish",
    kicker: "Your reward",
    /** Label next to the flag on the map (short). */
    mapLabel: "Your reward",
    title: "Collect your NFT animal",
    summary: "Finish the route and a little sea friend lands in your wallet, yours to keep.",
    summaryAllDone: "You made it! A little sea friend is waiting to swim into your wallet.",
    meta: "Free · Solana devnet",
    cta: "See your reward",
  },
};
