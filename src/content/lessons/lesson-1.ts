import type { Lesson } from "../types";

export const lesson1: Lesson = {
  id: "your-first-wallet",
  number: 1,
  kicker: "Wallets",
  title: "Your first crypto wallet",
  summary: "A safe place for your digital treasures, and the one address you can share with anyone.",
  minutes: 4,
  xp: 50,
  outro: "You now know what a wallet is, and you have your very own practice address!",
  steps: [
    {
      id: "safe-place",
      title: "A safe place for digital treasures",
      body: [
        "Before we sail deeper, you need a safe place to keep your digital items. That's a crypto wallet!",
        "Think of it like a personal digital backpack. It holds your digital money and your unique collectibles.",
        "You're the only one in charge of it: no branch managers and no waiting in lines.",
      ],
      example: "Your banking app has opening hours for some things. A crypto wallet works at 3 a.m. on a Sunday just the same.",
      quiz: {
        kind: "single",
        question: "How is a crypto wallet different from a regular bank account?",
        options: [
          { id: "a", text: "It's open 24/7, and you are the only one in control." },
          { id: "b", text: "You have to wait in line at a physical branch to use it." },
        ],
        correct: "a",
        explanation: "Your wallet is always open and only you control it. No branch, no queue, no manager. 🎒",
      },
    },
    {
      id: "meet-phantom",
      title: "Meet Phantom 👻",
      body: [
        "Different networks need different wallets. For the fast Solana network, the friendliest wallet is called Phantom. (You might also hear about MetaMask, which is made for a different network called Ethereum.)",
        "Normally, setting up a wallet means writing down a 12-word secret recovery phrase. Because you're just starting, we've prepared a practice training wallet for you inside this course, so you can relax and focus on exploring.",
        "One rule for later, when you set up a real Phantom: those 12 words are for your eyes only. No real company or support person will ever ask for them.",
      ],
      example:
        "It's like learning to drive in an instructor's car with dual brakes before getting your own.",
      quiz: {
        kind: "truefalse",
        question: "You have to write down a complicated password right now to continue this lesson.",
        correct: false,
        explanation:
          "False! Your practice training wallet is ready for you. You'll only need the 12 words when you set up a real wallet, and then they stay private. 🔒",
      },
    },
    {
      id: "public-address",
      title: "Your public address",
      body: [
        "Every wallet has a public address, a long line of letters and numbers like 7Xb…9Yz.",
        "Think of it as your bank account number (your IBAN). If a friend wants to send you a digital gift, you give them this address.",
        "Because it's only for receiving, it's completely safe to share it with anyone!",
      ],
      example: "Just like you'd give your IBAN to a colleague who owes you for lunch, you can give your address to anyone who wants to send you crypto.",
      quiz: {
        kind: "multiple",
        question: "Which of these statements about your public address are true?",
        options: [
          { id: "a", text: "It acts like your bank account number." },
          { id: "b", text: "It is perfectly safe to share with others." },
          { id: "c", text: "It is a top-secret password you must hide." },
        ],
        correct: ["a", "b"],
        explanation:
          "Your address is like an account number: share it freely so people can send you things. The secret one is your 12-word recovery phrase, never the address. ✉️",
      },
    },
  ],
};
