// English UI strings: practice. Other languages translate this exact shape (src/i18n/ui/{uk,cs,ru}.ts).
// The "Action Zone" inside a lesson step (src/components/lesson/PracticeZone.tsx).
export const practice = {
  /** aria-label of the whole practice block. */
  zoneLabel: "Practice zone",

  /** Wallet header (dark strip at the top). */
  header: {
    /** Phone width — keep very short. */
    titleShort: "Training wallet",
    title: "Your training wallet",
    /** Small button after the address; shown after the address is copied. */
    copy: "copy",
    copied: "copied!",
    /** Shown instead of the address while the wallet is being made. */
    creating: "creating…",
    /** Small pill: which network the wallet uses. */
    modeDevnet: "Devnet",
    modePractice: "Practice",
    /** Balance pill label for a simulated token: "OCN · practice". */
    tokenPractice: (symbol: string) => `${symbol} · practice`,
    seeOnExplorer: "See it on Explorer",
  },

  /** Screen-reader note after links that open a new tab. */
  opensInNewTab: "(opens in a new tab)",

  /** Step 1 on devnet: the wallet is empty. */
  faucet: {
    title: "First, fill up from the faucet 🚰",
    body: "Your wallet is empty. The devnet faucet pours free test SOL — no real money, ever.",
    button: "Get free test SOL",
    busy: "Pouring test SOL…",
  },

  /** Under an error message (devnet mode). The sentence is before + link (faucet.solana.com) + after. */
  error: {
    altFaucetBefore: "You can also get coins at",
    /** Must match header.copy (the button name in quotes). */
    altFaucetAfter: "— paste your address (tap “copy” next to it above), choose Devnet, and come back. We'll notice the coins automatically.",
    switchToPractice: "Or continue in practice mode (simulated)",
  },

  /** "receipt" practice when the learner hasn't sent anything yet. */
  noTransferYet: (amount: number) => `No transfer yet. Send ${amount} test SOL now and we'll show you its receipt.`,

  /** Main action button. */
  action: {
    swap: (symbol: string) => `Swap to ${symbol}`,
    stake: (amount: number) => `Stake ${amount} SOL`,
    send: (amount: number) => `Send ${amount} SOL`,
    swapping: "Swapping…",
    staking: "Staking…",
    sending: "Sending…",
  },

  /** Success line after the action. */
  success: {
    swap: "The vending machine gave you your tokens!",
    stake: "Staked! Your mSOL receipt is in your wallet.",
    send: "Sent! It arrived in about a second.",
  },

  /** Prompt + button to open the receipt. */
  verify: {
    promptSimulated: "Did it really happen? Let's verify!",
    promptSend: "Did you send it? Let's check the public notebook!",
    button: "🔍 Verify it onchain",
  },

  /** Send form (rows: label on the left, value on the right). */
  sendForm: {
    to: "To (a friend)",
    amount: "Amount",
    fee: "Network fee",
  },

  swapForm: {
    youPay: "You pay",
    youGet: "You get",
    /** Name of the practice token, shown after "10 OCN". */
    tokenName: "Ocean Token",
    note: "Practice swap: simulated in your training wallet, no real tokens move.",
  },

  stakeForm: {
    youStake: "You stake",
    youGetReceipt: "You get a receipt",
    /** Shown after "≈ 0.5 mSOL". */
    keepsEarning: "keeps earning rewards",
    note: "Practice staking: simulated in your training wallet, no real coins move.",
  },

  /** Transaction receipt card. */
  receipt: {
    title: "Transaction receipt",
    /** Status pill (after a ✓). */
    success: "Success",
    failed: "Failed",
    what: "What",
    signature: "Signature",
    from: "From (you)",
    to: "To",
    amount: "Amount",
    fee: "Network fee",
    time: "Time",
    network: "Network",
    networkDevnet: "Solana devnet",
    networkPractice: "Practice (simulated)",
    viewOnExplorer: "View on Solana Explorer",
    realNote: "That's the real public record. Notice: only addresses, never your name.",
    practiceNote:
      "This is a practice receipt (simulated). On devnet the same button opens the real record on Solana Explorer. Notice: addresses only, never your name.",
  },
};
