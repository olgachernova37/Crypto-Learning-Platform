// English UI strings: progress. Other languages translate this exact shape (src/i18n/ui/{de,cs,ru,uk}.ts).
// The progress page (src/components/progress/ProgressView.tsx).
export const progress = {
  eyebrow: "Your progress",
  title: "Look how far you've sailed",

  /** XP card. */
  xp: {
    heading: "Experience",
    /** Unit after the big number. */
    unit: "XP",
    nothingYet: "Every step and quiz adds a little more. Keep going!",
    lessonsFinished: (done: number, total: number) => `${done} of ${total} lessons finished — lovely work.`,
  },

  /** Streak card. */
  streak: {
    daysInRow: (n: number) => `${n} ${n === 1 ? "day" : "days"} in a row`,
    activeToday: "You learned today — see you tomorrow.",
    keepGoing: "A tiny lesson today keeps it going.",
    start: "Learn a little today to start a new streak.",
    /** aria-label of the 7-day row. */
    weekLabel: "The last 7 days",
    /** Under today's circle (very short). */
    today: "Today",
    /** Screen-reader text per day; `day` is "Today" or a date like 2026-10-04. */
    dayLearned: (day: string) => `${day}: learned`,
    dayNoLesson: (day: string) => `${day}: no lesson`,
  },

  /** Lesson cards. */
  lessons: {
    heading: "Your lessons",
    doneCount: (done: number, total: number) => `${done} / ${total} done`,
    /** Small status at the right of a card (very short). */
    stateDone: "Done",
    stateNotStarted: "Not started",
    stateSteps: (n: number) => `${n} steps`,
    stateStepsDone: (done: number, total: number) => `${done}/${total}`,
    /** aria-label of a card's progress bar. */
    progressLabel: (title: string) => `${title} progress`,
  },

  /** NFT animal card. */
  nft: {
    eyebrow: "Your NFT animal",
    claimedTitle: "Your animal is in your wallet",
    claimedBody: "It's yours, on Solana devnet — proof that you learned something new.",
    lockedTitle: "Finish the lessons to earn your animal",
    lockedBody: (done: number, total: number) =>
      `A little sea friend waits at the end of the route. ${done} of ${total} lessons done.`,
    continue: "Continue the journey",
  },

  /** Reset at the bottom. */
  reset: {
    button: "Reset progress",
    confirm: "Erase all XP, your streak and lessons?",
    yes: "Yes, start over",
    no: "Keep my progress",
  },

  /** First visit, nothing done yet. */
  empty: {
    title: "Your voyage starts here",
    body: "Nothing here yet — and that's perfect. The first lesson takes about five minutes, and everything you learn will show up on this page.",
    cta: "Start your journey",
    earnXp: "Earn XP",
    buildStreak: "Build a streak",
    getAnimal: "Get an animal",
  },

  /** sr-only while loading. */
  loading: "Loading your progress…",
};
