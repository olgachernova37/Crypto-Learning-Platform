import type { Lesson } from "../types";

// Inspired by solana.com/learn "Staying safe on Solana" (rewritten for beginners, not copied).
export const lesson8: Lesson = {
  id: "spot-the-scam",
  number: 8,
  kicker: "Staying safe",
  title: "Spot the scam 🛟",
  summary: "The tricks scammers use, and the simple habits that keep your wallet safe.",
  minutes: 5,
  xp: 100,
  outro: "You're now a scam-spotter! These habits protect you far better than any fancy tool. Your sea friend is waiting at the finish.",
  steps: [
    {
      id: "golden-rule",
      title: "The golden rule: your 12 words 🤫",
      body: [
        "Remember the 12-word recovery phrase from a real wallet? It's the master key to everything inside. Whoever has those words can take all your coins, and nobody can undo it.",
        "So here's the rule with no exceptions: never share them. Not with support, not with a friend, not with a website, not with an app, not even with an AI.",
        "Real support teams never message you first and never ask for your words. Write them on paper and keep them somewhere safe and offline, never in a photo or a note on your phone.",
      ],
      example: "It's like the PIN to your bank card, your house keys and your passport all in one. You'd never hand those to a stranger who messaged you.",
      quiz: {
        kind: "single",
        question: "\"Phantom Support\" messages you: \"There's a problem with your wallet. Send us your recovery phrase so we can fix it.\" What do you do?",
        options: [
          { id: "a", text: "Send it quickly, they're official support." },
          { id: "b", text: "Send only the first 6 words, just to be safe." },
          { id: "c", text: "Ignore and block them. Real support never asks for your words." },
        ],
        correct: "c",
        explanation: "Block and move on. No real company will ever ask for your recovery phrase, and even half of it helps a thief. 🤫",
      },
    },
    {
      id: "too-good-to-be-true",
      title: "Too good to be true 🎣",
      body: [
        "Scammers love big promises: \"Send 1 SOL and get 2 back!\", \"You won a free airdrop!\", \"Guaranteed profit!\" If it sounds too good to be true, it is.",
        "They also love hurry: \"Only 10 minutes left!\" Rushing you is the trick, so you don't stop to think.",
        "Watch out for surprise gifts too: random tokens or NFTs that suddenly appear in your wallet with a link to \"claim your prize\". Don't click. Just ignore or hide them.",
      ],
      example: "Like an email saying you've won a car and only need to pay the shipping fee first.",
      quiz: {
        kind: "multiple",
        question: "Which of these are red flags?",
        options: [
          { id: "a", text: "\"Send 1 SOL and we'll send you 2 back!\"" },
          { id: "b", text: "\"Hurry, this offer ends in 10 minutes!\"" },
          { id: "c", text: "A random token appears in your wallet with a link to claim a prize." },
          { id: "d", text: "Your wallet asks you to confirm a transfer you just started yourself." },
        ],
        correct: ["a", "b", "c"],
        explanation: "Doubling promises, time pressure and surprise \"prizes\" are classic scams. Confirming a transfer you started yourself is just normal. 🎣",
      },
    },
    {
      id: "lookalikes",
      title: "Lookalike websites and sneaky approvals ✍️",
      body: [
        "Some scam websites are perfect copies of real ones, with an address that's almost the same, like \"phant0m\" with a zero. Always check the address bar, and save the real sites as bookmarks.",
        "When a website wants your wallet to approve something, your wallet shows a pop-up first. Read it! A sneaky approval, called a wallet drainer, can empty your wallet in one tap.",
        "If you didn't start it, or you don't understand what it does, press Reject. And when trying a new app, start with a tiny amount.",
      ],
      example: "It's like checking the sender's address on a parcel notice text before you click: \"p0st-office\" isn't your post office.",
      quiz: {
        kind: "match",
        question: "Match each scam with how it works.",
        pairs: [
          { left: "Phishing site", right: "A fake copy of a real website" },
          { left: "Wallet drainer", right: "A sneaky approval that empties your wallet" },
          { left: "Fake support", right: "A \"helper\" who messages you first" },
        ],
        explanation: "Phishing sites copy real ones, drainers hide in approvals, and fake support reaches out first. Knowing their names makes them easy to spot. ✍️",
      },
    },
    {
      id: "safety-checklist",
      title: "Your safety checklist ✅",
      body: [
        "Let's pack it into a few habits: keep your 12 words offline and secret. Check website addresses. Read every wallet pop-up. Ignore surprise gifts. Start small with new apps.",
        "And when in doubt, slow down. A real opportunity will still be there tomorrow. A scam needs you to act right now.",
      ],
      example: "Just like you lock your front door without thinking about it, these habits become automatic after a while.",
      quiz: {
        kind: "truefalse",
        question: "If a website looks professional, it's safe to approve anything your wallet asks.",
        correct: false,
        explanation: "False! Scam sites can look beautiful. Check the address, read the pop-up, and reject anything you didn't start or don't understand. ✅",
      },
    },
    {
      id: "boss-sirens",
      title: "Boss: the Island of Sirens 🧜",
      body: [
        "Listen… a sweet song drifts over the water. The Sirens sing the oldest tricks in crypto: fake support, magic prizes and hurry, hurry!",
        "Your crewmate Phantom stands by with a shield: tap it for a hint whenever a song sounds too sweet. Every answer lands a hit, and the right ones hit hardest.",
      ],
      boss: {
        id: "siren-island",
        rounds: [
          {
            kind: "single",
            question: "🎶 \"Hi, I'm from Phantom Support! Send me your 12 words and I'll fix your wallet.\"",
            options: [
              { id: "a", text: "Block and ignore. Real support never asks for your words." },
              { id: "b", text: "Send them, support needs them to help." },
              { id: "c", text: "Send only half, just to be safe." },
            ],
            correct: "a",
            explanation: "Block and sail on. Nobody real ever asks for your recovery phrase, and even half of it helps a thief. 🤫",
            hint: "Phantom never messages you first, and never asks for your 12 words.",
          },
          {
            kind: "single",
            question: "🎶 \"Surprise! A new token just landed in your wallet: claim your $500 at claim-sol-prize.xyz!\"",
            options: [
              { id: "a", text: "Click fast before the prize expires." },
              { id: "b", text: "Don't click. Hide the token and move on." },
            ],
            correct: "b",
            explanation: "Surprise tokens with a \"claim\" link are bait. The link leads to a page that empties wallets. Hide it and move on. 🎣",
            hint: "You didn't ask for this gift. Who benefits if you click?",
          },
          {
            kind: "truefalse",
            question: "🎶 \"Send 1 SOL to this address and get 2 SOL back! Only 10 minutes left ⏳\" This is a scam.",
            correct: true,
            explanation: "True! Doubling money plus a countdown is a classic siren song. The 1 SOL would be gone forever.",
            hint: "Big promise + time pressure = ?",
          },
          {
            kind: "single",
            question: "You're on \"phant0m.app\" and a pop-up asks you to approve something you don't understand.",
            options: [
              { id: "a", text: "Approve, the website looks very professional." },
              { id: "b", text: "Reject, then check the website address." },
            ],
            correct: "b",
            explanation: "Reject! \"phant0m\" has a zero instead of an \"o\". When you don't understand a request, the answer is always no. 🛡️",
            hint: "Look closely at the letters in the address.",
          },
        ],
      },
    },
  ],
};
