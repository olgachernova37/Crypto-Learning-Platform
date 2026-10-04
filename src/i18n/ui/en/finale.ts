// English UI strings: finale. Other languages translate this exact shape (src/i18n/ui/{uk,cs,ru}.ts).
// The finale page (src/components/lesson/FinaleView.tsx) and minting the mascot (MintMascot.tsx).
export const finale = {
  backToRoute: "Back to the route",
  /** Small mono tag top-right. */
  tag: "Devnet · Finale",
  eyebrow: "The end of the route",
  kicker: "Finale",
  title: "Meet your mascot! 🐢",
  intro:
    "Look how far you've come! You mastered wallets, sent crypto, tracked receipts, and even made a decentralized swap. To celebrate your graduation, a unique ocean mascot is waiting for your digital backpack.",

  /** Card shown while some lessons are unfinished. */
  locked: {
    title: "Almost there!",
    body: (done: number, total: number) =>
      `Finish all ${total} lessons to unlock your mascot. You've done ${done} of ${total}.`,
    continue: "Continue the route",
  },

  /** Link to the partners page. */
  partners: "Trusted harbors",
  share: "Share the journey",
  /** Text shared via the phone's share sheet (with a link to the site). */
  shareText:
    "I just sailed through my first crypto lessons on Crypto Voyage and earned a little sea-animal learning badge!",
  shareCopied: "Link copied. Paste it anywhere to share!",
  shareCopyManually: (url: string) => `Copy this link to share: ${url}`,

  /** NFT preview card. */
  card: {
    badge: "Devnet · Learning badge",
    /** Mascot NFT name. */
    name: "Pebble the Sea Turtle",
    subtitle: "Finished the Crypto Voyage course",
    /** aria-label of the status icon. */
    claimed: "Claimed",
    notClaimed: "Not claimed yet",
  },

  /** Minting the mascot. */
  mint: {
    /** sr-only legend of the choice. */
    whereLegend: "Where should your mascot live?",
    whereTitle: "Where should Pebble live?",
    trainingLabel: "My training wallet",
    trainingHint: "Easiest: no app needed.",
    phantomLabel: "My own Phantom wallet",
    phantomHint: "Connect your Phantom, or paste its address (it's safe to share).",
    phantomAddress: "Your Phantom address",
    /** Input placeholder — an example address, keep the address part. */
    phantomPlaceholder: "e.g. 7Xb…9Yz",
    phantomInvalid: "That doesn't look like a Solana address yet.",
    /** "Connect Phantom" flow (only the public address is shared; nothing is signed). */
    connect: "👻 Connect Phantom",
    connecting: "Waiting for Phantom…",
    /** `addr` is a short address like "7Xb2…9Yz1" */
    connected: (addr: string) => `Connected: ${addr}`,
    useAnother: "Use another address",
    notInstalled: "Phantom isn't installed in this browser.",
    install: "Install Phantom",
    openInApp: "Open this page in the Phantom app",
    rejected: "The connection was cancelled in Phantom. Try again, or paste your address below.",
    orPaste: "…or paste your address",
    connectSafe: "Connecting only shares your public address. We never ask you to sign anything, and never for your 12 words.",
    switchToPractice: "Continue in practice mode (simulated)",
    button: "🎁 Mint my mascot",
    busy: "Minting on Solana…",
    note: "A real 1-of-1 NFT on Solana devnet. Free: devnet coins have no value.",

    /** After minting. */
    minted: "Your mascot is minted! 🎉",
    /** `addr` is a short wallet address like "7Xb2…9Yz1". */
    mintedRealPhantom: (addr: string) =>
      `Pebble is a real NFT on Solana devnet, living in your Phantom wallet (${addr}). Exactly one exists — it's yours.`,
    mintedRealTraining:
      "Pebble is a real NFT on Solana devnet, living in your training wallet. Exactly one exists — it's yours.",
    mintedPractice: "Pebble lives in your practice backpack (simulated). Try again on devnet any time.",
    seeOnExplorer: "See it on Solana Explorer",
    opensInNewTab: "(opens in a new tab)",
    findTitle: "Where to find your new friend 📱",
    /** Steps for finding the NFT in Phantom (Phantom's own menu names — match their app if translated). */
    phantomSteps: [
      "Open Phantom → Settings → Developer Settings, and turn on Testnet Mode (Solana Devnet).",
      "Tap the Collectibles tab (the icon with little squares, ⊞).",
      "Pebble may take a minute to appear while the wallet catches up.",
    ],
    trainingFind:
      "In a wallet app like Phantom, NFTs live in the Collectibles tab (the icon with little squares, ⊞). Your Pebble is in the training wallet here — next time, send it straight to your own Phantom.",
  },
};
