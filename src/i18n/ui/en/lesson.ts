// English UI strings: lesson. Other languages translate this exact shape (src/i18n/ui/{uk,cs,ru}.ts).
export const lesson = {
  /** Opening "chapter" screen of a lesson (dark sea). */
  intro: {
    backToRoute: "Back to the route",
    /** Small mono tag top-right (desktop only). */
    mode: "Devnet · Practice mode",
    start: "Let's go",
    /** Small line next to the start button: "~5 min · +50 XP · 6 steps". */
    meta: (minutes: number, xp: number, steps: number) => `~${minutes} min · +${xp} XP · ${steps} steps`,
  },

  /** Sticky top bar while reading a lesson. */
  header: {
    /** aria-label of the X button (top-left). */
    close: "Close the lesson and go back to the route",
    /** aria-label of the progress bar; `title` is the lesson title. */
    progressLabel: (title: string) => `${title} progress`,
    /** Screen-reader value of the progress bar. */
    progressValue: (step: number, total: number) => `Step ${step} of ${total}`,
  },

  /** The reading/quiz screens and the bottom action bar. */
  player: {
    /** Small mono line above the step title: "Lesson 01 · Step 2 of 6". `label` is common.lessonLabel. */
    stepEyebrow: (label: string, step: number, total: number) => `${label} · Step ${step} of ${total}`,
    /** Small mono heading above a quiz; `title` is the step title. */
    quickCheckHeading: (title: string) => `Quick check · ${title}`,
    /** Bottom bar after a quiz is checked (desktop only, one line, truncated). */
    keepExploring: "Keep exploring",
    lastStep: "That's the last step, well done!",
    nextStep: (title: string) => `Next: ${title}`,
    /** Back button while on a quiz (goes back to the reading part). */
    reread: "Reread",
    back: "Back",
    /** Main button, disabled until the practice box on the step is done. */
    practiceFirst: "Practice first",
    quickCheck: "Quick check",
    finishLesson: "Finish lesson",
    continue: "Continue",
    /** Checks the quiz answer. */
    check: "Check",
  },

  /** Boxes inside a step's reading part. */
  step: {
    example: "Real-life example",
    tryIt: "Try it yourself",
    /** Button that opens an outside site; `host` is e.g. "faucet.solana.com". */
    openSite: (host: string) => `Open ${host}`,
    /** Screen-reader text after a link that opens a new tab. */
    newTab: "(opens in a new tab)",
  },

  /** "Lesson completed" celebration screen. */
  complete: {
    /** Small mono line: "Lesson 01 · complete". `label` is common.lessonLabel. */
    eyebrow: (label: string) => `${label} · complete`,
    heading: "Lesson completed! 🎉",
    /**
     * Shown when the lesson has no own outro: "You finished <bold lesson title>. One more stop on your route, sailed."
     * The lesson title goes (in bold) between `before` and `after`.
     */
    finished: {
      before: "You finished ",
      after: ". One more stop on your route, sailed.",
    },
    claim: (xp: number) => `✨ Claim +${xp} XP ✨`,
    /** Three small stat tiles (short labels). */
    xpEarned: "XP earned",
    dayStreak: "Day streak",
    totalXp: "Total XP",
    nextLesson: "Next lesson",
    /** Button after the last lesson; leads to the NFT finale. */
    meetMascot: "Meet your mascot",
    backToRoute: "Back to the route",
    upNext: (title: string) => `Up next: ${title}`,
  },
};
