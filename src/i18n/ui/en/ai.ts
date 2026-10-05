// English UI strings: ai. Other languages translate this exact shape (src/i18n/ui/{de,cs,ru,uk}.ts).
export const ai = {
  /** Button that opens the AI guide (short, fits a small pill). */
  open: "Ask AI",
  title: "Your AI guide",
  /** Subtitle under the title; `step` is the current step title (one line, truncated). */
  sailingWith: (step: string) => `Sailing with you · ${step}`,
  close: "Close the AI guide",
  /** Screen-reader label for the typing dots. */
  thinking: "The guide is thinking",
  questionLabel: "Your question",
  placeholder: "Ask about this step…",
  send: "Send question",
  /** Small print under the input. */
  disclaimer: "Learning only, not financial advice. Never share your recovery phrase.",
  /** Fallback replies when the guide can't answer. */
  noAnswer: "Hmm, I couldn't think of an answer. Try asking another way?",
  offline: "I couldn't reach the guide just now. Check your connection and try again?",
  /** First message from the guide, depending on where the learner is. */
  greeting: {
    /** After a wrong quiz answer. */
    missed:
      "Ahoy! That one was tricky. Want me to explain why the right answer fits? Mistakes are just part of the route.",
    /** On a quiz, before checking. */
    quiz: "Ahoy! Need a nudge? I'll give you a hint, not the answer, so the win stays yours.",
    /** While reading a step. */
    read: "Ahoy, voyager! Stuck or just curious about this step? Ask me anything, in your own words.",
  },
  /** Tap-to-ask chips (each is sent to the guide as the learner's question). */
  suggestions: {
    whyWrong: "Why was my answer wrong?",
    anotherExample: "Give me another example",
    hint: "Can I have a hint?",
    simpler: "Explain this more simply",
    realLife: "Give me a real-life example",
  },
};
