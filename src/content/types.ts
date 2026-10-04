// Shared content model. Agents build UI on top of these types — change them only together.

export type QuizOption = { id: string; text: string };

export type Quiz =
  | {
      kind: "single";
      question: string;
      options: QuizOption[];
      correct: string; // option id
      explanation: string;
    }
  | {
      kind: "multiple"; // UI: square checkboxes + "Select all that apply"
      question: string;
      options: QuizOption[];
      correct: string[]; // option ids
      explanation: string;
    }
  | {
      kind: "fill";
      question: string; // use "___" where the word goes
      answers: string[]; // accepted answers, compared case-insensitively
      explanation: string;
    }
  | {
      kind: "truefalse";
      question: string;
      correct: boolean;
      explanation: string;
    }
  | {
      kind: "match";
      question: string;
      pairs: { left: string; right: string }[]; // shown shuffled on the right
      explanation: string;
    };

/** One small paragraph-step of a lesson, optionally followed by a quiz. */
export type LessonStep = {
  id: string;
  title: string;
  body: string[]; // short paragraphs, friend-to-friend tone
  example?: string; // a real-life example shown in a soft card
  action?: {
    // an optional "go do it" moment (create wallet, open explorer...)
    label: string;
    href?: string;
    note?: string;
  };
  /** A hands-on practice zone. Simulated with the in-app training wallet until devnet is wired up. */
  practice?: Practice;
  quiz?: Quiz;
};

export type Practice =
  | { kind: "send"; amount: number } // send SOL from the training wallet
  | { kind: "swap"; payAmount: number; getAmount: number; getSymbol: string } // swap SOL -> token
  | { kind: "receipt" }; // show the receipt of the learner's last practice transaction

export type Lesson = {
  id: string; // url slug: /lesson/[id]
  number: number; // 0, 1, 2, 3 ... shown as "Lesson 01"
  kicker: string; // small uppercase line above the title
  title: string;
  summary: string; // one friendly sentence
  minutes: number;
  xp: number; // XP for finishing the lesson (claimed on the completion screen)
  outro?: string; // friendly line on the "Lesson completed" screen
  steps: LessonStep[];
};
