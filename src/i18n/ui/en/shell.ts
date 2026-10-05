// English UI strings: shell. Other languages translate this exact shape (src/i18n/ui/{de,cs,ru,uk}.ts).
export const shell = {
  /** aria-label of the logo link in the top bar (keep the brand name). */
  homeAria: "Crypto Voyage — home",
  /** aria-label of the main navigation (top bar on desktop, bottom nav on phones). */
  mainNav: "Main",
  nav: {
    // Short: the bottom nav on phones has 4 narrow columns (max ~10 characters).
    journey: "Journey",
    lessons: "Lessons",
    progress: "Progress",
    partners: "Partners",
  },
  /** The white "Lessons ☰" pill in the dark top bar (keep short, ~10 characters). */
  lessonsButton: "Lessons",
  drawer: {
    /** Small label above the drawer title. */
    eyebrow: "Your voyage",
    title: "Lessons",
    closeAria: "Close lessons",
    /** Under the drawer title, e.g. "3 of 10 finished". */
    finished: (done: number, total: number) => `${done} of ${total} finished`,
    /** aria-label of the lesson list. */
    listAria: "Lessons",
    /** Badge on a finished lesson row (very short). */
    done: "Done",
    /** Lesson length on a row, e.g. "5 min" (very short). */
    minutes: (min: number) => `${min} min`,
    /** Screen-reader only, read after a finished lesson's title. */
    finishedSr: "(finished)",
    progress: "Progress",
    partners: "Partners",
    backToRoute: "Back to the route",
  },
  stats: {
    /** Tooltip on the flame (streak) chip. */
    streakTitle: "Days in a row",
    /** Screen-reader only, read right after the streak number (note the leading space). */
    streakSr: (days: number): string => (days === 1 ? " day streak" : " days streak"),
    /** Tooltip on the XP chip. */
    xpTitle: "Experience points",
    /** Unit shown after the XP number (very short). */
    xpUnit: "XP",
  },
};
