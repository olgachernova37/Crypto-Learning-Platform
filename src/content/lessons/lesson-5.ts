import type { Lesson } from "../types";

// Inspired by solana.com/learn "What is staking?" (rewritten for beginners, not copied).
export const lesson5: Lesson = {
  id: "staking",
  number: 5,
  kicker: "Staking",
  title: "Put your SOL to work 🌱",
  summary: "Help keep the network safe and get a small thank-you in return, without giving your coins away.",
  minutes: 4,
  xp: 50,
  outro: "You know how staking works, and you even tried it with practice SOL. Your coins can now help the network while you sleep!",
  steps: [
    {
      id: "what-is-staking",
      title: "Helping the network, earning a thank-you 🙌",
      body: [
        "Remember the shared public notebook? Someone has to check every new page before it's added. On Solana, these checkers are called validators: computers around the world, run by people and companies.",
        "Staking means you put your SOL behind a validator you trust, like a vote of confidence. The more SOL stands behind a validator, the more say it has in checking the notebook.",
        "As a thank-you for helping keep the network honest, you get small rewards in SOL, paid out every couple of days.",
      ],
      example:
        "A bit like putting money in a savings account that pays a little interest. The difference: the reward comes from the network for helping keep it safe, and the amount can change over time.",
      quiz: {
        kind: "single",
        question: "What are you doing when you stake your SOL?",
        options: [
          { id: "a", text: "Giving your SOL to a stranger forever." },
          { id: "b", text: "Backing a validator that helps run the network, and earning small rewards for it." },
          { id: "c", text: "Swapping your SOL for a brand-new coin." },
        ],
        correct: "b",
        explanation: "Staking is a vote of confidence: your SOL backs a validator that checks the notebook, and the network thanks you with small rewards. 🌱",
      },
    },
    {
      id: "still-yours",
      title: "Your SOL stays yours 🔐",
      body: [
        "Here's the comforting part: the validator never gets your coins. Your staked SOL stays in your own wallet, under your control. The validator can't spend it or move it.",
        "You can change your mind and unstake whenever you like. It just isn't instant: Solana works in rounds called epochs, about two days each, so unlocking takes a couple of days.",
        "Rewards aren't a promise of riches. They're small, they change over time, and it helps to pick a validator that's reliable and always online.",
      ],
      example: "It's like lending your support to a candidate in a club election: they get your vote, not your wallet.",
      quiz: {
        kind: "truefalse",
        question: "Once you stake, the validator can spend your SOL however it wants.",
        correct: false,
        explanation: "False! Your staked SOL never leaves your control. The validator only gets your vote of confidence, never your coins. 🔐",
      },
    },
    {
      id: "liquid-staking",
      title: "Liquid staking: a receipt you can use 🧾",
      body: [
        "Waiting a couple of days to unstake can feel slow. That's why liquid staking exists.",
        "With a liquid staking service like Marinade, you stake your SOL and get a receipt token back, called mSOL. Your SOL keeps earning rewards, and you can swap the receipt back whenever you want.",
        "Let's try it with practice SOL. Nothing real moves: this is a safe simulation in your training wallet.",
      ],
      example: "Like a coat-check ticket: your coat stays safe in the cloakroom, and the ticket in your pocket proves it's yours.",
      practice: { kind: "stake", amount: 0.5 },
      quiz: {
        kind: "multiple",
        question: "Which of these are true about staking on Solana?",
        options: [
          { id: "a", text: "Your staked SOL still belongs to you." },
          { id: "b", text: "Unstaking usually takes a couple of days." },
          { id: "c", text: "Staking rewards are guaranteed to make you rich." },
          { id: "d", text: "Liquid staking gives you a receipt token, like mSOL." },
        ],
        correct: ["a", "b", "d"],
        explanation: "Your SOL stays yours, unlocking takes a couple of days, and liquid staking hands you a receipt like mSOL. Rewards are small and change, so never a promise of riches. 🧾",
      },
    },
  ],
};
