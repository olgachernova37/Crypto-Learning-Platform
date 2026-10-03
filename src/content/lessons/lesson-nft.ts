import type { Lesson } from "../types";

export const lessonNft: Lesson = {
  id: "your-nft-animal",
  number: 4,
  kicker: "Your reward",
  title: "Meet your NFT animal",
  summary: "Find the animal you just earned in your wallet, and learn what an NFT actually is.",
  minutes: 4,
  xp: 100,
  steps: [
    {
      id: "what-is-nft",
      title: "What is an NFT?",
      body: [
        "An NFT is a one-of-a-kind digital item with a certificate recorded on the blockchain. The certificate says which wallet owns it, and everyone can check it.",
        "A regular coin is like any other coin of the same kind. An NFT is unique: yours is yours, and it's not the same as anyone else's.",
      ],
      example:
        "Think of a signed, numbered print from an artist. Lots of people can see the picture, but only one person holds print number 7 with its certificate.",
      quiz: {
        kind: "single",
        question: "What makes an NFT different from a regular coin?",
        options: [
          { id: "a", text: "It's unique and its owner is recorded on the blockchain" },
          { id: "b", text: "It's always worth a lot of money" },
          { id: "c", text: "It only exists as a picture on your phone" },
        ],
        correct: "a",
        explanation:
          "An NFT is one-of-a-kind, with ownership written on the blockchain. It isn't automatically valuable, and it's more than just a picture file.",
      },
    },
    {
      id: "find-it",
      title: "Find it in Phantom",
      body: [
        "Open Phantom and make sure Testnet Mode is still on, since your animal lives on devnet.",
        "Tap the Collectibles tab (the little grid icon). Your sea animal should be waiting there. If it isn't yet, give it a minute and pull down to refresh.",
      ],
      action: {
        label: "Open Phantom, then tap Collectibles",
        note: "Tap the animal to see its details, and open it in Solana Explorer if you like.",
      },
      quiz: {
        kind: "fill",
        question: "In Phantom, NFTs show up in the ___ tab.",
        answers: ["collectibles", "collectible", "collectibles tab"],
        explanation:
          "NFTs live in Phantom's Collectibles tab. Remember to keep Testnet Mode on to see devnet ones.",
      },
    },
    {
      id: "badge-not-investment",
      title: "A learning badge, not an investment",
      body: [
        "Your animal is a badge that proves you finished the course. It's a little memory of your first steps in crypto.",
        "It's not something to buy or sell, and it isn't financial advice in disguise. It's a thank-you for learning.",
      ],
      example: "Like a medal from a fun run. It means a lot to you, but you didn't run for the money.",
      quiz: {
        kind: "truefalse",
        question: "Your NFT animal is a learning badge, not an investment.",
        correct: true,
        explanation:
          "True. It's proof that you finished the course. Enjoy it as a keepsake.",
      },
    },
    {
      id: "devnet-value",
      title: "Why it has no money value",
      body: [
        "Your animal was made on devnet, the practice network. Things on devnet are real blockchain records, but they don't carry any money value.",
        "That's on purpose: you get the full experience of owning an NFT, with zero risk and zero cost.",
      ],
      quiz: {
        kind: "multiple",
        question: "Which statements about your NFT animal are true?",
        options: [
          { id: "a", text: "It lives on Solana devnet" },
          { id: "b", text: "You can sell it for real money" },
          { id: "c", text: "Its owner is recorded on the blockchain" },
          { id: "d", text: "It proves you finished the course" },
        ],
        correct: ["a", "c", "d"],
        explanation:
          "It lives on devnet, its owner is recorded onchain, and it shows you finished the course. Devnet items have no money value, so it can't be sold for real money.",
      },
    },
  ],
};
