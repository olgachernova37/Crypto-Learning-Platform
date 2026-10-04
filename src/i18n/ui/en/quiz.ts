// English UI strings: quiz. Other languages translate this exact shape (src/i18n/ui/{uk,cs,ru}.ts).
export const quiz = {
  /** Small pill above each quiz telling how to answer. */
  kind: {
    single: "Choose one answer",
    multiple: "Select all that apply",
    fill: "Fill in the missing word",
    truefalse: "True or false?",
    match: "Tap a word, then tap its meaning",
  },
  /** Small tags on answer options once the quiz is checked. */
  yourPickCorrect: "Your pick, correct",
  correctAnswer: "Correct answer",
  yourPick: "Your pick",
  /** True/false buttons (also used when the answer is written out as text). */
  true: "True",
  false: "False",

  /** Fill-in-the-blank. */
  fillAria: "Your answer for the blank",
  /** Placeholder inside the blank (short, ~10 characters). */
  fillPlaceholder: "type here",
  /** Shown under a wrong fill-in answer. */
  correctAnswerIs: (answer: string) => `Correct answer: ${answer}`,

  /** Match-the-pairs. */
  match: {
    /** Column headings. */
    words: "Words",
    meanings: "Meanings",
    /** aria-label of the checked list of pairs. */
    correctPairs: "Correct pairs",
    matchedOk: "You matched this correctly.",
    matchedDiff: "You matched this differently.",
    /** aria-label of a chip that is already paired: "Wallet, matched with: An app that holds your keys". */
    matchedWith: (item: string, other: string) => `${item}, matched with: ${other}`,
    /** Screen-reader status lines. */
    pickedWord: (word: string) => `${word} selected. Now choose its meaning.`,
    pickedMeaning: (meaning: string) => `${meaning} selected. Now choose its word.`,
    pairsMatched: (done: number, total: number) => `${done} of ${total} pairs matched.`,
  },

  /** Feedback card after "Check". */
  feedback: {
    /** One of these is shown after a correct answer (any number of entries). */
    cheers: ["Lovely, that's it!", "Exactly right.", "You've got it!", "Spot on.", "Nice one!", "Yes, well done!"],
    wrong: "Not quite, and that's okay.",
    xp: (xp: number) => `+${xp} XP`,
    correctPairsShown: "The correct pairs are shown above.",
    /** "The right answer: <answer>" — the answer goes (highlighted) between `before` and `after`. */
    rightAnswer: {
      before: "The right answer: ",
      after: "",
    },
    /** Button that opens the AI guide and asks it ai.suggestions.whyWrong. */
    askWhy: "Still unsure? Ask the AI guide why",
  },
};
