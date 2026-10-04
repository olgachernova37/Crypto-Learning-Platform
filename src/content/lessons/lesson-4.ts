import type { Lesson } from "../types";

export const lesson4: Lesson = {
  id: "your-first-swap",
  number: 4,
  kicker: "Exchange",
  title: "Your first swap 🔄",
  summary: "Exchange one coin for another, like changing money at the airport, but with a fair machine.",
  minutes: 4,
  xp: 100,
  outro: "You just completed your first decentralized exchange! You're officially ready for the open ocean.",
  steps: [
    {
      id: "currency-exchange",
      title: "The digital currency exchange 💱",
      body: [
        "When you travel to another country, you exchange your money at the airport, like changing euros for dollars.",
        "In crypto, this is called a swap. You're simply exchanging one type of digital coin (like SOL) for another (like our special practice Ocean Token, OCN).",
      ],
      example: "Euros to dollars at the airport desk = SOL to OCN in a swap.",
      quiz: {
        kind: "single",
        question: "What does it mean to \"swap\" in crypto?",
        options: [
          { id: "a", text: "Exchanging one type of digital coin for another." },
          { id: "b", text: "Deleting your coins permanently." },
        ],
        correct: "a",
        explanation: "A swap is an exchange: you give one coin and get another back, nothing is deleted. 💱",
      },
    },
    {
      id: "vending-machine",
      title: "The magic vending machine 🤖",
      body: [
        "In the real world, an exchange desk has a cashier who takes a cut. In crypto, you can use a DEX, a decentralized exchange.",
        "There's no human cashier! It works like a giant, fair digital vending machine: you put your SOL in, and the machine automatically gives you tokens back. It's instant and open 24/7.",
      ],
      example: "Just like a vending machine doesn't need a shop assistant to hand you a drink, a DEX doesn't need a cashier to approve your swap.",
      quiz: {
        kind: "truefalse",
        question: "You have to wait for a human cashier to approve your crypto swap.",
        correct: false,
        explanation: "False! A DEX is automatic, like a vending machine. No cashier, no waiting. 🤖",
      },
    },
    {
      id: "try-swap",
      title: "Try it yourself!",
      body: [
        "Let's use our practice vending machine. You're going to swap 0.5 of your practice SOL for 10 Ocean Tokens (OCN).",
        "Don't worry, this is still practice money!",
      ],
      practice: { kind: "swap", payAmount: 0.5, getAmount: 10, getSymbol: "OCN" },
    },
  ],
};
