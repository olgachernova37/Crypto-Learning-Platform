import type { Lesson } from "../types";

export const lesson0: Lesson = {
  id: "what-is-crypto",
  number: 0,
  kicker: "Start here",
  title: "What is crypto and blockchain?",
  summary: "The big idea behind crypto, explained like you would to a friend over coffee.",
  minutes: 4,
  xp: 50,
  outro: "You did an amazing job grasping the basics. You're one step closer to becoming a true crypto explorer!",
  steps: [
    {
      id: "money-without-borders",
      title: "Money without borders",
      body: [
        "Welcome! Grab a cozy seat. We're about to explore the world of crypto together, and I promise it's much simpler than it sounds.",
        "Cryptocurrency (or just \"crypto\") is simply digital money. You can't hold it in your hand like a physical coin, but it works everywhere in the world.",
        "Because it doesn't belong to any specific country or bank, you can send it to a friend across the globe just as easily as sending a text message!",
      ],
      example:
        "Think of how a photo travels: you tap send, and a second later it's on your friend's phone in another country. Crypto moves money in a similar way.",
      quiz: {
        kind: "truefalse",
        question: "Cryptocurrency is a special type of physical coin that you can keep in your real-life purse.",
        correct: false,
        explanation: "False! Crypto is entirely digital. You keep it safely on your phone or computer, not in your real purse. 👜",
      },
    },
    {
      id: "public-notebook",
      title: "The magic public notebook",
      body: [
        "If there's no central bank holding the money, how do we know who has what?",
        "Instead of a bank keeping secret records, crypto uses a blockchain. Imagine a giant, magical digital notebook that everyone in the world can read, but absolutely no one can erase or cheat.",
        "Every time someone sends money, a new permanent line is written in this notebook for everyone to see.",
      ],
      example:
        "It's like a shared family recipe book where every change is written in ink and every relative has an identical copy. Nobody can quietly rewrite grandma's recipe.",
      quiz: {
        kind: "single",
        question: "What is the easiest way to describe a blockchain?",
        options: [
          { id: "a", text: "A giant, public digital notebook that cannot be erased." },
          { id: "b", text: "A secret file kept on a bank manager's computer." },
          { id: "c", text: "A physical diary locked in a library." },
        ],
        correct: "a",
        explanation:
          "A blockchain is a giant digital notebook that's completely public, so no single bank has to keep a secret file. 📖",
      },
    },
    {
      id: "no-boss",
      title: "No boss in charge",
      body: [
        "Because everyone shares a copy of this magical notebook, there's no single boss. No CEO, no bank manager, and no central office decides what you can do with your coins.",
        "This is what people mean when they say crypto is decentralized. A whole community of computers works together as a team to make sure everything is fair.",
      ],
      example:
        "Like a neighbourhood book-swap shelf: there's no shop owner, everyone follows the same simple rules, and everyone can see what's there.",
      quiz: {
        kind: "multiple",
        question: "What does it mean when we say a network is \"decentralized\"?",
        options: [
          { id: "a", text: "There is no single boss or CEO in charge." },
          { id: "b", text: "A bank manager has to approve your weekend transactions." },
          { id: "c", text: "The network works together as a team to check the rules." },
          { id: "d", text: "No central office can randomly freeze your account." },
        ],
        correct: ["a", "c", "d"],
        explanation:
          "Decentralized means there is no central boss or bank manager. The network runs itself as a team. 🤝",
      },
    },
    {
      id: "why-sail",
      title: "Why sail these waters?",
      body: [
        "Why use crypto instead of your regular banking app? Because it gives you true ownership of your digital money and items.",
        "Plus, modern networks like Solana make this incredibly fast and practically free. It's like sending a quick chat message instead of mailing a heavy package!",
        "One honest note before we sail on: crypto prices can go up and down a lot. Only ever put in money you could afford to lose.",
      ],
      example:
        "On Solana, a typical network fee is a tiny fraction of a cent, far less than a bank transfer abroad.",
      quiz: {
        kind: "fill",
        question: "Modern crypto networks like Solana make sending digital money incredibly ___ and practically free.",
        answers: ["fast", "quick", "speedy"],
        explanation: "We were looking for fast! Solana is built to be extremely speedy. ⚡",
      },
    },
  ],
};
