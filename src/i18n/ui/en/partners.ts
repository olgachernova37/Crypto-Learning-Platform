// English UI strings: partners. Other languages translate this exact shape (src/i18n/ui/{de,cs,ru,uk}.ts).
// Brand names (Marinade, Phantom, Bybit EU, Superteam, Solana, SOL, mSOL, Solana Explorer) stay as they are.
import type { ReactNode } from "react";

/** Rich text: `b(text)` renders a bold part. Return the whole sentence as a list of parts, in your word order. */
type Bold = (text: string) => ReactNode;

export const partners = {
  // ── "Trusted harbors" page (/partners) ──
  page: {
    /** Small label above the page title */
    kicker: "We recommend",
    title: "🧭 Trusted harbors",
    intro:
      "We've picked the safest and friendliest places to help you on your future journey. Tap any of our trusted friends to see how they can help.",
    /** Small pill on a partner card once its reward was earned */
    rewardEarned: "Reward earned",
    /** Screen-reader-only text after an external link's label (keep the leading space) */
    opensInNewTab: " (opens in a new tab)",
    disclaimer: "We provide educational maps, not financial advice. Crypto is risky — start small.",
  },

  // Partner cards. `name` is only listed where it contains translatable words.
  cards: {
    marinade: {
      tagline: "Your digital savings account",
      line: "A simple, safe way to let your crypto grow peacefully while you sleep.",
      reward: "⭐️ Starfish NFT (practice) + Marinade's $10 sign-up bonus",
      cta: "Start the staking quest",
      note: "The $10 bonus is Marinade's own offer for real sign-ups. Check current terms on their site.",
    },
    trezor: {
      tagline: "A safe for your savings",
      line: "Holding more than pocket money? A hardware wallet keeps your keys offline, and nothing leaves without a press on the device.",
      reward: (xp: number) => `🔐 +${xp} XP`,
      cta: "Explore Trezor",
    },
    superteam: {
      /** "Superteam" is a brand; "Solana Community" may be translated */
      name: "Solana Community (Superteam)",
      tagline: "The friendly global family behind our network",
      line: "Crypto is better together! Discover free events and meet new friends who are also learning.",
      reward: (xp: number) => `🌟 +${xp} XP`,
      cta: "Explore the Solana community",
    },
    phantom: {
      /** "Phantom" is a brand; "Wallet" may be translated */
      name: "Phantom Wallet",
      tagline: "Your real everyday digital backpack",
      line: "Ready to graduate from our training wallet? Get the official app to carry your digital treasures safely every day.",
      reward: (xp: number) => `🛡️ "True Owner" badge + ${xp} XP`,
      cta: "Set up your Phantom wallet",
    },
    bybit: {
      tagline: "Your friendly currency exchange",
      line: "Ready to try real coins? Exchange your regular money (with a bank card) for crypto to start your journey.",
      reward: (xp: number) => `🎟️ +${xp} XP`,
      cta: "Visit Bybit EU",
    },
  },

  // ── "Before you set sail" guides on the partners page ──
  guides: {
    kicker: "Essential navigation guides",
    title: "🗺️ Before you set sail",
    network: {
      title: "🌊 Ready for the real ocean?",
      subtitle: "Devnet vs. Mainnet",
      /** "Devnet" and "Mainnet" are network names, shown in bold */
      body: (b: Bold) => [
        "In our lessons we played in a practice pool called ",
        b("Devnet"),
        ". To use real apps, you step out into the real ocean: the ",
        b("Mainnet"),
        ".",
      ],
      howTo: "How to check your network in Phantom:",
      /** Numbered steps; bold parts are Phantom's own menu names (use the names Phantom shows in your language) */
      steps: [
        (b: Bold) => ["Open Phantom and tap the ", b("Settings"), " icon (⚙️)."],
        (b: Bold) => ["Scroll down and tap ", b("Developer Settings"), "."],
        (b: Bold) => ["Find the ", b("Testnet Mode"), " switch and turn it ", b("off"), "."],
      ],
      after:
        "When Testnet Mode is off, your practice coins won't show up any more. Your wallet is now ready for real digital treasures.",
    },
    safety: {
      title: "🛡️ A quick note on safety",
      tips: [
        {
          title: "Your 12-word map is for your eyes only",
          text: "No real company or support person will ever ask for your secret recovery phrase. Keep it on paper, somewhere safe.",
        },
        { title: "Always test the waters first", text: "Trying a new app? Send a tiny test transaction first (like $1)." },
        {
          title: "Only sail with what you can afford",
          text: "We provide educational maps, not financial advice. Start small and explore safely!",
        },
      ],
    },
  },

  // ── Marinade staking quest (/partners/marinade) ──
  quest: {
    /** Back link to the partners page */
    back: "← Trusted harbors",
    kicker: "Interactive quest · Practice",
    title: "💧 Marinade staking",
    welcome: "Welcome to your first real-world simulation!",
    conceptTitle: "The concept",
    /** "staking" is shown in bold */
    concept: (b: Bold) => [
      "Imagine a traditional savings account: you put your money there, and it gives you a little extra over time. In crypto, this is called ",
      b("staking"),
      ". Marinade puts your coins to work helping run the Solana network, so they can slowly grow while you sleep. (Like any investment, rewards aren't guaranteed.)",
    ],
    step1: {
      title: "Deposit 1 practice SOL",
      /** After staking. `wallet` is a short address like "7xKX…9fQa" or null if unknown */
      done: (b: Bold, wallet: string | null) => [
        "Done! You received ",
        b("1 mSOL"),
        `, Marinade's “staked SOL” receipt token, in your training wallet${wallet ? ` (${wallet})` : ""}.`,
      ],
      /** `sol` is the formatted balance, or "…" while loading */
      balance: (sol: string) =>
        `Your training wallet has ${sol} SOL. Let's practise staking 1 of them (a simulation: no coins actually move).`,
      staking: "Staking…",
      stake: "Stake 1 practice SOL",
    },
    step2: {
      title: "Verify it onchain",
      /** `label` is the transaction description, shown in bold; `sig` is a shortened signature (keep as-is) */
      done: (b: Bold, label: string, fee: number, sig: ReactNode) => [
        "✓ Receipt found: ",
        b(label),
        `, fee ${fee} SOL, signature `,
        sig,
        ". (Practice receipt: real Solana Explorer links come with the devnet wallet.)",
      ],
      verify: "🔍 Verify it onchain",
    },
    step3: {
      title: "Claim your reward",
      done: (xp: number) => `⭐️ Your Starfish (practice NFT) is in your backpack, and +${xp} XP is yours!`,
      claim: "🎁 Claim reward (Starfish NFT)",
    },
    /** `link` is the marinade.finance link */
    realThing: (link: ReactNode) => [
      "Want to see the real thing? Visit ",
      link,
      ". Their $10 sign-up bonus is their own offer — check current terms on their site. Not financial advice.",
    ],
  },
};
