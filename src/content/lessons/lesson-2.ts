import type { Lesson } from "../types";

export const lesson2: Lesson = {
  id: "send-and-receive",
  number: 2,
  kicker: "Practice, no real money",
  title: "Send and receive",
  summary: "Make your first transaction with free test coins, with zero risk.",
  minutes: 7,
  xp: 70,
  steps: [
    {
      id: "practice-money",
      title: "Devnet = practice money",
      body: [
        "Everything in this lesson happens on devnet, Solana's practice network. It works exactly like the real thing, but the coins are free and worth nothing.",
        "So go ahead and click around. If something goes wrong, nothing is lost. That's the whole point of practising here.",
      ],
      example: "Like playing a board game with paper money before you ever touch a real wallet.",
      quiz: {
        kind: "truefalse",
        question: "Making a mistake on devnet can cost you real money.",
        correct: false,
        explanation:
          "False. Devnet coins have no value, so mistakes here are free lessons, not losses.",
      },
    },
    {
      id: "faucet",
      title: "Get free test SOL from the faucet",
      body: [
        "To practise sending, you first need some test SOL. You get it from a faucet: a website that drips out free devnet coins.",
        "Open the Solana faucet, paste your wallet address, pick a small amount like 1 SOL and request it. If it says you've hit a limit, just wait a little and try again.",
      ],
      example: "Think of it as the free sample stand at the market. A small taste, no payment needed.",
      action: {
        label: "Open the Solana faucet",
        href: "https://faucet.solana.com",
        note: "Make sure it's set to devnet. In a few seconds the test SOL appears in Phantom.",
      },
      quiz: {
        kind: "single",
        question: "What is a faucet in crypto?",
        options: [
          { id: "a", text: "A place to buy real coins at a discount" },
          { id: "b", text: "A website that gives out free test coins for practice" },
          { id: "c", text: "A part of your wallet that stores your recovery phrase" },
        ],
        correct: "b",
        explanation:
          "A faucet hands out free test coins on practice networks like devnet. They have no real value, they're just for learning.",
      },
    },
    {
      id: "copy-address",
      title: "Copy your address",
      body: [
        "To receive coins, someone needs your public address. In Phantom, tap your account name at the top (or the Receive button) and copy the address.",
        "It's long and random-looking, so always copy and paste it. Never type it out by hand.",
      ],
      example:
        "Like giving your home address to a delivery service. Sharing it is safe: it lets things come in, not go out.",
      quiz: {
        kind: "fill",
        question: "To receive coins, you share your public ___.",
        answers: ["address", "wallet address", "public address"],
        explanation:
          "Your public address is safe to share. It only lets people send coins to you. Your recovery phrase is the one you never share.",
      },
    },
    {
      id: "send-tiny",
      title: "Send a tiny amount",
      body: [
        "Let's send your first transaction. Ask a friend for their devnet address, or use a second wallet account in Phantom.",
        "Tap Send, paste the address, type a tiny amount like 0.01 SOL, check everything, and confirm. In about a second, it's done. You just made a real blockchain transaction!",
      ],
      example: "It's like sending money in a banking app, only there's no bank in the middle.",
      quiz: {
        kind: "multiple",
        question: "What do you need to send SOL to someone?",
        options: [
          { id: "a", text: "Their public address" },
          { id: "b", text: "Their recovery phrase" },
          { id: "c", text: "The amount you want to send" },
          { id: "d", text: "A tiny bit of SOL for the network fee" },
        ],
        correct: ["a", "c", "d"],
        explanation:
          "You need their address, the amount, and a little SOL for the fee. You never need anyone's recovery phrase, theirs or yours.",
      },
    },
    {
      id: "fee",
      title: "The network fee, in plain words",
      body: [
        "Every transaction pays a small fee. It goes to the computers that check and record your payment in the shared notebook.",
        "On Solana the fee is tiny: usually much less than a cent. On devnet you pay it with test SOL, so it's free for you.",
      ],
      example: "Like a stamp on a letter. A small price so the postal service carries it for you.",
      quiz: {
        kind: "single",
        question: "What is the network fee for?",
        options: [
          { id: "a", text: "Paying the computers that check and record your transaction" },
          { id: "b", text: "A tip for the person you're sending to" },
          { id: "c", text: "A monthly subscription to Phantom" },
        ],
        correct: "a",
        explanation:
          "The fee pays the network for checking and recording your transaction. On Solana it's a tiny fraction of a cent.",
      },
    },
    {
      id: "no-undo",
      title: "Double-check, there is no undo",
      body: [
        "Blockchain transactions can't be reversed. There's no bank to call and no \"cancel\" button. If coins go to the wrong address, they're gone.",
        "So before you confirm, check the first and last few characters of the address, and the amount. For big amounts, people often send a tiny test first.",
      ],
      example: "It's like posting a letter into a mailbox: once it's in, you can't reach back in and grab it.",
      quiz: {
        kind: "truefalse",
        question: "If you send coins to the wrong address, Phantom support can reverse it for you.",
        correct: false,
        explanation:
          "False. Nobody can reverse a blockchain transaction, not even the wallet company. That's why a calm double-check before confirming matters so much.",
      },
    },
  ],
};
