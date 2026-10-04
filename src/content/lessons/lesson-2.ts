import type { Lesson } from "../types";

export const lesson2: Lesson = {
  id: "send-and-receive",
  number: 2,
  kicker: "Practice money",
  title: "Let's move some magic money! ✨",
  summary: "Make your first transfer with practice coins: zero risk, and you can't break anything.",
  minutes: 4,
  xp: 50,
  outro: "You just made your first real blockchain transaction, with test coins. How cool is that?!",
  steps: [
    {
      id: "safe-space",
      title: "A completely safe space",
      body: [
        "Today, you'll make your first crypto transfer! Take a deep breath: we're using \"play money\" on a practice network called Devnet.",
        "Think of it like a flight simulator. There's absolutely zero risk, and you can't break anything.",
      ],
      example: "Pilots train for hours in simulators before flying a real plane. Devnet is our simulator.",
      quiz: {
        kind: "truefalse",
        question: "If I click the wrong button in this lesson, I might accidentally lose my real money.",
        correct: false,
        explanation: "False! Everything here is practice money with no real value. Click away, nothing can go wrong. 🛟",
      },
    },
    {
      id: "solana-speed",
      title: "The magic of Solana speed 🚀",
      body: [
        "When you send money through a traditional bank on a Friday, it might not arrive until Monday.",
        "On Solana, when you press \"send\", your friend receives it in about a second, anywhere in the world, 24/7. And the fee is a tiny fraction of a cent.",
      ],
      example: "It's the difference between posting a letter and sending a text.",
      quiz: {
        kind: "single",
        question: "Why is sending crypto on Solana so awesome?",
        options: [
          { id: "a", text: "It arrives in about a second, 24/7." },
          { id: "b", text: "It only works during normal business hours." },
        ],
        correct: "a",
        explanation: "Solana never closes: transfers land in about a second, day or night, weekends included. ⚡",
      },
    },
    {
      id: "paying-it-forward",
      title: "Paying it forward 💌",
      body: [
        "Below is your training wallet. It's a real wallet on Solana's practice network, created just for you in this browser.",
        "First, use the magical \"faucet\" to pour some free test SOL into it. A faucet is simply a tap that gives out free test coins.",
        "Then let's send a little bit! The friend's address is already filled in. Press send to give away 0.1 test SOL.",
        "Tip for real life: always double-check the address before you send, because blockchain transfers can't be undone.",
      ],
      practice: { kind: "send", amount: 0.1 },
    },
  ],
};
