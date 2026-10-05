// English UI strings: home. Other languages translate this exact shape (src/i18n/ui/{de,cs,ru,uk}.ts).
export const home = {
  /** Little tag next to the planet illustration (bold line, then a short line). */
  tagTitle: "Stop 01 · Solana",
  tagLine: "Fast, low-cost, open to anyone",
  eyebrow: "Welcome, voyager 👋",
  /** Big headline, first line; the second line is the brand name "Solana". */
  titleLead: "Your first stop:",
  lede: "Discover crypto and blockchain from zero through short, interactive lessons made for beginners.",
  cta: "Start the journey",
  /** Small note under the button. */
  note: (lessons: number, minutes: number) =>
    `No crypto experience needed · ${lessons} short lessons · about ${minutes} min`,
  routeLabel: "On your route",
  /** The route chips under the hero, in lesson order (short topic names; the 2nd one is highlighted). */
  route: ["What is crypto", "Solana", "Wallets", "Sending SOL", "Swaps", "Staking", "NFTs", "Memecoins", "Staying safe", "Your vault"],
};
