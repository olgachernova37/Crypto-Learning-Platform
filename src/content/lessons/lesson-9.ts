import type { Lesson } from "../types";

// Hot vs cold wallets: when a beginner's savings deserve a vault (hardware wallet).
// Trezor joins the crew after this stop (see src/content/voyage.ts). Brand-neutral inside the lesson.
export const lesson9: Lesson = {
  id: "treasure-vault",
  number: 9,
  kicker: "Keeping it safe",
  title: "A vault for your treasure 🔐",
  summary: "Hot wallets and cold wallets, and when your savings deserve a safe of their own.",
  minutes: 4,
  xp: 100,
  outro: "You know when to keep coins in your pocket and when to lock them in a vault. That's real crypto wisdom. Your sea friend is waiting at the finish!",
  steps: [
    {
      id: "hot-wallet",
      title: "Your pocket wallet: a hot wallet 🔥",
      body: [
        "Apps like Phantom are called hot wallets. They live on your phone or in your browser, always connected to the internet.",
        "That makes them super handy: you can send, swap and pay in seconds, wherever you are.",
        "The flip side: if your phone gets a virus, or you tap a phishing link and approve the wrong thing, a thief can reach what's inside.",
      ],
      example: "A hot wallet is like the wallet in your pocket: perfect for coffee and the bus ticket, but you wouldn't carry all your savings in it.",
      quiz: {
        kind: "truefalse",
        question: "A hot wallet, like the Phantom app on your phone, is connected to the internet.",
        correct: true,
        explanation: "True! That's what makes it \"hot\": always online, so it's quick and handy, but also easier for scammers to reach. 🔥",
      },
    },
    {
      id: "cold-wallet",
      title: "The vault: a cold wallet 🧊",
      body: [
        "A cold wallet, also called a hardware wallet, is a small device a bit like a USB stick. Your secret keys stay inside it and never touch the internet.",
        "Every time you send coins, the device shows the details on its own little screen, and nothing moves until you press its button.",
        "So even if your computer is infected, or you landed on a fake website, a thief can't move your coins without that device in your hand.",
        "One thing doesn't change: you still get recovery words. Write them on paper and keep them offline, just like before.",
      ],
      example: "It's like a safe at home: a little slower to open than your pocket, but that's exactly the point.",
      quiz: {
        kind: "multiple",
        question: "What does a hardware wallet do for you?",
        options: [
          { id: "a", text: "Keeps your secret keys offline, away from the internet." },
          { id: "b", text: "Lets you check and confirm every transfer on the device's own screen." },
          { id: "c", text: "Makes your coins grow in value automatically." },
          { id: "d", text: "Means you never need to keep your recovery words." },
        ],
        correct: ["a", "b"],
        explanation: "It keeps your keys offline and makes you confirm every transfer on the device. It doesn't make coins grow, and you still must keep your recovery words safe. 🧊",
      },
    },
    {
      id: "when-to-switch",
      title: "When is it time for a vault? 🤔",
      body: [
        "You don't need a vault for practice coins or a few euros. A hot wallet is perfectly fine for small amounts.",
        "A good moment to get one: when the amount would really hurt to lose. For example, more than you'd ever carry around in cash.",
        "Many people use both: a hot wallet with a little for everyday, and a cold wallet for their savings.",
      ],
      example: "You keep some cash in your wallet and your savings in the bank. Same idea, just for crypto.",
      quiz: {
        kind: "single",
        question: "Your crypto has grown to an amount that would really hurt to lose. What's a good plan?",
        options: [
          { id: "a", text: "Keep everything in the app on your phone. It's the most convenient." },
          { id: "b", text: "Move your savings to a hardware wallet, and keep a small amount in your hot wallet for everyday." },
          { id: "c", text: "Save your recovery words in your phone's notes, so you never lose them." },
        ],
        correct: "b",
        explanation: "Savings in the vault, pocket money in the hot wallet. And recovery words never go into your phone: paper, offline, safe. 🔐",
      },
    },
    {
      id: "setup-safely",
      title: "Setting up your vault safely 📦",
      body: [
        "Buy a hardware wallet only from the maker's official shop or an official reseller. Never second-hand, and never from a random marketplace.",
        "When you set it up, the device creates your recovery words itself. Write them on paper. Never type them into a computer or a phone.",
        "If a device arrives with recovery words already printed or filled in, it's a scam. Whoever wrote them can empty it later.",
        "And every time you send coins, compare the address on the device's screen with the one you meant to use.",
      ],
      example: "Like getting a new door lock: you'd never use one that came with a spare key someone else already has.",
      quiz: {
        kind: "truefalse",
        question: "Your new hardware wallet arrived with a card that already has 24 recovery words printed on it. It's safe to use those words.",
        correct: false,
        explanation: "False! Real devices create the words for you during setup. Pre-printed words mean someone else knows your key. Send it back. 📦",
      },
    },
  ],
};
