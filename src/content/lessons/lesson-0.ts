import type { Lesson } from "../types";

export const lesson0: Lesson = {
  id: "what-is-crypto",
  number: 0,
  kicker: "Start here",
  title: "What is crypto, really?",
  summary: "The big idea behind crypto and blockchain, explained like you would to a friend over coffee.",
  minutes: 6,
  xp: 50,
  steps: [
    {
      id: "money-is-agreement",
      title: "Money is an agreement",
      body: [
        "Look at a banknote. It's just paper with a nice print. It's worth something because all of us agree it is, and because we trust the bank and the country behind it to keep that agreement.",
        "Crypto is a new kind of that agreement. Instead of one bank keeping the records, thousands of computers around the world keep them together.",
      ],
      example:
        "Think of a coffee shop loyalty card. The stamps only mean something because you and the café both agree that ten stamps = a free latte.",
      quiz: {
        kind: "single",
        question: "Why does money have value?",
        options: [
          { id: "a", text: "Because the paper itself is expensive" },
          { id: "b", text: "Because people agree it's worth something and trust the system behind it" },
          { id: "c", text: "Because it's made by computers" },
        ],
        correct: "b",
        explanation:
          "Money works because we all agree on it and trust whoever keeps the records. Crypto keeps that idea, but the records are kept by many computers instead of one bank.",
      },
    },
    {
      id: "shared-notebook",
      title: "A notebook everyone shares",
      body: [
        "Imagine one notebook where every payment is written down: \"Anna sent Ben 5 coins.\" Now imagine thousands of people each holding an exact copy of that notebook.",
        "That's a blockchain. New pages of payments (called blocks) are added one after another, like a chain, and every copy gets the same new page.",
      ],
      example:
        "It's like a family group chat where everyone sees every message. Nobody needs to ask one person \"what was said?\" because everyone has the whole history.",
      quiz: {
        kind: "fill",
        question: "A blockchain is like a shared ___ that everyone has a copy of.",
        answers: ["notebook", "note book", "ledger", "record book", "record", "book"],
        explanation:
          "A blockchain is a shared notebook (people also call it a ledger). Everyone holds the same copy, and new pages, called blocks, are added in order.",
      },
    },
    {
      id: "no-secret-edits",
      title: "Why nobody can secretly edit it",
      body: [
        "If one person scribbled a fake payment into their copy, it wouldn't match all the other copies. The network simply ignores the copy that doesn't match.",
        "Each new page is also sealed with a kind of digital fingerprint of the page before it. Change an old page and every fingerprint after it breaks, so tampering is obvious.",
      ],
      example:
        "It's like one guest at a wedding claiming the cake was blue, while 300 other guests have photos of a white cake. Nobody believes the one odd story.",
      quiz: {
        kind: "truefalse",
        question: "One person can quietly change an old payment on the blockchain, and nobody would notice.",
        correct: false,
        explanation:
          "False. Thousands of matching copies plus the \"fingerprint\" seals between pages mean a sneaky change wouldn't match and gets rejected.",
      },
    },
    {
      id: "meet-solana",
      title: "Meet Solana",
      body: [
        "There isn't just one blockchain. There are many, a bit like there are different phone networks. Bitcoin was the first one. Ethereum and Solana came later.",
        "In this course we use Solana. It's known for being fast and cheap: a payment usually goes through in about a second and the fee is a tiny fraction of a cent. Its own coin is called SOL.",
      ],
      example:
        "If Bitcoin is a reliable old post office, Solana is more like sending a text message: quick, and it costs almost nothing.",
      quiz: {
        kind: "match",
        question: "Match each word to what it means.",
        pairs: [
          { left: "Blockchain", right: "A shared record book" },
          { left: "Block", right: "One page of payments" },
          { left: "Solana", right: "A fast, low-fee blockchain" },
          { left: "SOL", right: "Solana's own coin" },
        ],
        explanation:
          "A blockchain is the shared record book, a block is one page in it, Solana is the blockchain we use, and SOL is its coin.",
      },
    },
    {
      id: "risk",
      title: "Crypto is exciting, and risky",
      body: [
        "Prices of crypto coins can jump up or drop a lot, sometimes in a single day. That's why the golden rule is: never put in more money than you could calmly lose.",
        "Good news for now: in this course you'll practise with test coins that have no real value. You can't lose a thing while you learn.",
      ],
      example:
        "Treat it like a trip to a fun fair. You decide your budget before you go, not while you're on the rollercoaster.",
      quiz: {
        kind: "multiple",
        question: "Which of these are healthy habits with crypto?",
        options: [
          { id: "a", text: "Only invest money you could afford to lose" },
          { id: "b", text: "Borrow money because a friend says a coin will \"go to the moon\"" },
          { id: "c", text: "Practise first with test coins" },
          { id: "d", text: "Expect prices to go up and down" },
        ],
        correct: ["a", "c", "d"],
        explanation:
          "Investing only what you can lose, practising first and expecting ups and downs are all smart. Borrowing money because of hype is a classic way to get hurt.",
      },
    },
  ],
};
