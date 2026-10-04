// English UI strings: wallet. Other languages translate this exact shape (src/i18n/ui/{uk,cs,ru}.ts).
// Text the training wallet (src/lib/training-wallet.ts) produces: error messages and receipt "What" lines.
export const wallet = {
  /** Error box above the practice / mint buttons. */
  errors: {
    /** Devnet unreachable (network error). */
    unreachable: "We couldn't reach the Solana devnet. Check your connection and try again.",
    /** First balance load failed for another reason. */
    unreachableNow: "We couldn't reach the Solana devnet right now.",
    /** Devnet faucet rate-limited us. "tap" = the faucet. */
    faucetBusy: "The free devnet tap is busy right now (it limits how often it pours).",
    faucetFailed: "The faucet didn't answer. Try again in a minute.",
    sendFailed: "The transfer didn't go through. Please try again.",
    mintFailed: "Minting didn't go through. Please try again.",
  },

  /** "What" row of a transaction receipt (one short line). */
  tx: {
    faucet: (amount: number) => `Received ${amount} SOL from the devnet faucet`,
    send: (amount: number) => `Sent ${amount} SOL to a friend`,
    /** `symbol` is a token ticker, e.g. "OCN". */
    swap: (pay: number, get: number, symbol: string) => `Swapped ${pay} SOL for ${get} ${symbol}`,
    stake: (amount: number) => `Staked ${amount} SOL with Marinade (practice)`,
    /** "Pebble the Sea Turtle" is the mascot NFT's name. */
    mint: "Minted Pebble the Sea Turtle NFT",
  },
};
