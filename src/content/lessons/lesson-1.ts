import type { Lesson } from "../types";

export const lesson1: Lesson = {
  id: "your-first-wallet",
  number: 1,
  kicker: "Wallets",
  title: "Your first wallet",
  summary: "What a wallet really is, how to keep it safe, and how to open your very own Phantom wallet.",
  minutes: 7,
  xp: 60,
  steps: [
    {
      id: "keychain",
      title: "A wallet is a keychain, not a purse",
      body: [
        "Here's the surprising part: your coins never actually sit inside your wallet app. They live on the blockchain, in that shared notebook.",
        "What the wallet holds are your keys: the proof that certain coins in the notebook belong to you, and the power to send them.",
      ],
      example:
        "It's like a safe-deposit box at a bank. The box (your coins) stays in the vault. What you carry around is the key.",
      quiz: {
        kind: "truefalse",
        question: "Your coins are stored inside the wallet app on your phone.",
        correct: false,
        explanation:
          "False. Your coins live on the blockchain. The wallet app keeps the keys that prove they're yours, which is why you can open the same wallet on a new phone.",
      },
    },
    {
      id: "address-vs-phrase",
      title: "Your address and your secret phrase",
      body: [
        "Every wallet comes with two very different things. Your public address is a long line of letters and numbers. You can share it freely, so people can send you coins.",
        "Your secret recovery phrase is a list of words (usually 12). It's the master key to everything in the wallet. Whoever has these words has your coins.",
      ],
      example:
        "Your address is like your email address: give it to anyone who wants to write to you. The recovery phrase is like the password to that email, plus your bank PIN, plus your house key, all in one.",
      quiz: {
        kind: "match",
        question: "Match each wallet word to what it's like in real life.",
        pairs: [
          { left: "Public address", right: "Your email, safe to share" },
          { left: "Recovery phrase", right: "A master key, never share" },
          { left: "Wallet app", right: "A keychain for your keys" },
        ],
        explanation:
          "Share your address like an email. Guard your recovery phrase like the master key to your home. The app is just the keychain that holds the keys.",
      },
    },
    {
      id: "scammers",
      title: "The one rule that keeps you safe",
      body: [
        "No real company, support team, website or friend will ever need your recovery phrase. Not Phantom, not a bank, not this course. Never.",
        "So if anyone asks for it, by message, email, phone or a \"verify your wallet\" website, it's a scam. Close the chat and don't type the words anywhere.",
      ],
      example:
        "It's like someone calling \"from your bank\" and asking for your card PIN. A real bank never asks, so the request itself tells you it's fake.",
      quiz: {
        kind: "single",
        question: "A friendly \"Phantom support\" account messages you: to fix a problem, they need your 12 secret words. What do you do?",
        options: [
          { id: "a", text: "Send the words, they're from support" },
          { id: "b", text: "Send only the first 6 words to be safe" },
          { id: "c", text: "Don't share anything. It's a scam, so block and move on" },
        ],
        correct: "c",
        explanation:
          "Anyone asking for your recovery phrase is a scammer, even if they look official. Even half the words helps them, so never share any of them.",
      },
    },
    {
      id: "different-wallets",
      title: "Different wallets for different networks",
      body: [
        "Just like some phones work better on certain networks, wallets are built around certain blockchains.",
        "MetaMask, for example, is the classic wallet for Ethereum. For Solana, the most popular choice is Phantom, and that's the one we'll use together.",
      ],
      example:
        "It's a bit like loyalty apps: your supermarket app won't collect points at the airline. Pick the wallet that speaks your network's language.",
      quiz: {
        kind: "fill",
        question: "To use Solana in this course, we'll install the ___ wallet.",
        answers: ["phantom", "phantom wallet"],
        explanation:
          "Phantom is the go-to wallet for Solana. MetaMask is the well-known example for Ethereum.",
      },
    },
    {
      id: "install-phantom",
      title: "Install Phantom",
      body: [
        "Time to make it real. Download Phantom from its official website, either as a phone app or a browser extension. Always use the official link, because copycat apps exist.",
        "Tap \"Create a new wallet\". Phantom will show you your recovery phrase. Write it on paper and keep it somewhere safe at home. No screenshots, no notes app, no sending it to yourself.",
      ],
      action: {
        label: "Open Phantom download page",
        href: "https://phantom.com/download",
        note: "Opens phantom.com in a new tab. Come back here when your wallet is ready.",
      },
      quiz: {
        kind: "multiple",
        question: "Which of these are safe ways to set up your wallet?",
        options: [
          { id: "a", text: "Download Phantom only from the official site or app store" },
          { id: "b", text: "Write the recovery phrase on paper and keep it at home" },
          { id: "c", text: "Take a screenshot of the phrase so you don't lose it" },
          { id: "d", text: "Never type the phrase into a website that asks for it" },
        ],
        correct: ["a", "b", "d"],
        explanation:
          "Official download, paper backup and never typing the phrase into websites are the safe habits. Screenshots can be synced to the cloud or seen by other apps, so skip them.",
      },
    },
    {
      id: "devnet-mode",
      title: "Switch to practice mode",
      body: [
        "Solana has a practice playground called devnet. Coins there are free test coins with no real value, perfect for learning.",
        "In Phantom, open Settings, then Developer Settings, and turn on Testnet Mode. Then choose Solana Devnet. (Menu names can shift a little when the app updates.)",
      ],
      example:
        "It's like a driving school car with a second brake pedal. Same real road rules, zero danger.",
      action: {
        label: "Testnet Mode on, Solana Devnet chosen",
        note: "You'll see a small banner in Phantom telling you you're on a test network. That means it worked.",
      },
      quiz: {
        kind: "truefalse",
        question: "Test coins on Solana devnet can be sold for real money.",
        correct: false,
        explanation:
          "False. Devnet coins are free practice coins with no value. That's exactly why it's the perfect place to learn without any risk.",
      },
    },
  ],
};
