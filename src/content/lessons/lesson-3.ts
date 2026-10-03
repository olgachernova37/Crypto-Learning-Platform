import type { Lesson } from "../types";

export const lesson3: Lesson = {
  id: "see-it-onchain",
  number: 3,
  kicker: "Block explorer",
  title: "See it onchain",
  summary: "Find your own transaction on Solana Explorer, the public record anyone can check.",
  minutes: 6,
  xp: 70,
  steps: [
    {
      id: "receipt-book",
      title: "A public receipt book",
      body: [
        "Remember the shared notebook? A block explorer is a website that lets anyone read it.",
        "You can look up any address or any transaction and see what happened: who sent what, when, and whether it worked.",
      ],
      example:
        "It's like the tracking page for a parcel. You paste a number and see every step of its journey.",
      quiz: {
        kind: "single",
        question: "What is a block explorer?",
        options: [
          { id: "a", text: "A website to read the blockchain's public record" },
          { id: "b", text: "A secret app only banks can use" },
          { id: "c", text: "A new wallet you need to install" },
        ],
        correct: "a",
        explanation:
          "A block explorer is a public website for reading the blockchain, like a receipt book anyone can flip through.",
      },
    },
    {
      id: "open-explorer",
      title: "Open Solana Explorer on devnet",
      body: [
        "Solana Explorer is the official explorer. Our link opens it already set to devnet, because that's where your practice coins live.",
        "Look at the top right corner: it should say Devnet. If it says Mainnet, your test transactions won't show up, so switch the network there.",
      ],
      action: {
        label: "Open Solana Explorer (devnet)",
        href: "https://explorer.solana.com/?cluster=devnet",
        note: "Opens in a new tab. Keep this lesson open so you can come back.",
      },
      quiz: {
        kind: "truefalse",
        question: "To find your practice transactions, the explorer needs to be set to Devnet.",
        correct: true,
        explanation:
          "True. Devnet and mainnet are separate notebooks. Your test coins only appear when you look at the devnet one.",
      },
    },
    {
      id: "search",
      title: "Paste your address or transaction",
      body: [
        "Copy your wallet address from Phantom and paste it into the explorer's search bar. You'll see your balance and a list of your transactions.",
        "Each transaction has its own long ID called a signature. In Phantom, open the Activity tab, tap a transaction, and choose \"View on Solana Explorer\" to jump right to it.",
      ],
      example: "The signature is like the order number on a receipt: unique, and it points to exactly one purchase.",
      quiz: {
        kind: "fill",
        question: "The unique ID of a Solana transaction is called its ___.",
        answers: ["signature", "transaction signature", "tx signature"],
        explanation:
          "Every Solana transaction has a signature, a long unique ID. Paste it into the explorer to see that exact transaction.",
      },
    },
    {
      id: "read-it",
      title: "Read what you see",
      body: [
        "A transaction page can look busy, but you only need a few lines.",
        "Result tells you if it worked (Success). Timestamp is when it happened. Fee is the tiny cost paid to the network. And the balance changes show how much SOL moved from one address to the other.",
      ],
      quiz: {
        kind: "match",
        question: "Match each line on the explorer to what it tells you.",
        pairs: [
          { left: "Result", right: "Did it work?" },
          { left: "Timestamp", right: "When it happened" },
          { left: "Fee", right: "Tiny cost to the network" },
          { left: "Balance change", right: "How much SOL moved" },
        ],
        explanation:
          "Result shows success, Timestamp shows when, Fee shows the network cost, and the balance changes show how much moved.",
      },
    },
    {
      id: "pseudonymous",
      title: "Public, but not your name",
      body: [
        "Everything on the blockchain is public. Anyone can see an address's balance and history.",
        "But addresses don't carry names. Your wallet isn't labelled \"Anna from Prague\". It's pseudonymous: public activity under a nickname made of random letters. If you share your address publicly, though, people can link it to you.",
      ],
      example:
        "Like a pen name on a public blog. Everyone can read every post, but they only know you by the pen name, unless you tell them.",
      quiz: {
        kind: "multiple",
        question: "Which things can a stranger see on the explorer?",
        options: [
          { id: "a", text: "An address's balance" },
          { id: "b", text: "Your full name and home address" },
          { id: "c", text: "The amounts and times of transactions" },
          { id: "d", text: "Your recovery phrase" },
        ],
        correct: ["a", "c"],
        explanation:
          "Balances, amounts and times are public. Your name isn't stored on the blockchain, and your recovery phrase never goes there at all.",
      },
    },
  ],
};
