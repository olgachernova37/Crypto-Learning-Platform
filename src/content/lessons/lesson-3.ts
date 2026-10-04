import type { Lesson } from "../types";

export const lesson3: Lesson = {
  id: "see-it-onchain",
  number: 3,
  kicker: "Block explorer",
  title: "The digital receipt",
  summary: "Track your transaction like a parcel, on a public website anyone can check.",
  minutes: 3,
  xp: 50,
  outro: "You know how to track your digital footprints!",
  steps: [
    {
      id: "tracking-package",
      title: "Tracking your digital package 📦",
      body: [
        "Have you ever ordered something online and kept refreshing the tracking page? In crypto, we have a Block Explorer.",
        "It's a public website that works like a global package tracker. You type in a wallet address, and it shows every transaction that address has ever made!",
      ],
      example: "Solana's official one is called Solana Explorer. Others you may meet are Solscan and SolanaFM.",
      quiz: {
        kind: "single",
        question: "What is a Block Explorer most similar to?",
        options: [
          { id: "a", text: "A website where you track a package or look up a receipt." },
          { id: "b", text: "A secret folder for passwords." },
        ],
        correct: "a",
        explanation: "An explorer is a public receipt book: look up any transaction, like tracking a parcel. 🔍",
      },
    },
    {
      id: "your-footprint",
      title: "Seeing your own footprint 👣",
      body: [
        "Because the blockchain is public, anyone can look at these receipts. But they only show wallet addresses, never your real name.",
        "Below is the receipt of the test SOL you sent in the last lesson: who sent it, who received it, the amount, the tiny fee and the time.",
        "Tap \"Open it on Solana Explorer\" to see the very same receipt on the public website that anyone in the world can check.",
      ],
      example:
        "It's like a bank statement, except anyone can look it up, and it shows wallet addresses instead of names.",
      practice: { kind: "receipt" },
      quiz: {
        kind: "fill",
        question: "The website we use to check our transaction receipts is called a block ___.",
        answers: ["explorer"],
        explanation: "It's a block explorer: it lets you explore the blocks of the public notebook. 🧭",
      },
    },
  ],
};
