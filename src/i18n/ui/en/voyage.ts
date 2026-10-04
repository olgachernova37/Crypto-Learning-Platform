// English UI strings: voyage — the crew (partners who join along the route) and the two bosses.
// Brand names (Phantom, Bybit EU, Marinade, Superteam, mSOL) stay as they are.
export const voyage = {
  allies: {
    phantom: {
      /** short role under the name (~20 chars) */
      role: "Keeper of keys",
      joins: "Phantom joins your crew!",
      line: "Now that you know what a wallet is, meet a real one. Phantom guards your keys on every trip and warns you about suspicious requests.",
      cta: "Get Phantom",
    },
    bybit: {
      role: "Exchange harbor",
      joins: "You've reached the Bybit EU harbor!",
      line: "Our vending machine swaps coin for coin. At the Bybit EU harbor you can turn euros from your bank card into real crypto, under EU rules.",
      cta: "Visit Bybit EU",
    },
    marinade: {
      role: "Lighthouse keeper",
      joins: "Marinade's lighthouse lights up!",
      line: "You just tried liquid staking. Marinade is the real thing: stake SOL, get mSOL, and let it grow. Try the practice quest for a Starfish NFT.",
      cta: "Start the staking quest",
    },
    superteam: {
      role: "Your crew on land",
      joins: "Superteam welcomes you ashore!",
      line: "Your voyage ends here and your community begins. Superteam runs free events, meetups and learning for people new to Solana.",
      cta: "Meet the community",
    },
  },
  crew: {
    /** pill above the crew card at the end of a lesson */
    newCrewmate: "New crewmate",
    title: "Your crew",
    empty: "Your crew is waiting along the route. The first crewmate joins after Lesson 02.",
    /** "Joins at Lesson 02" */
    joinsAt: (lessonLabel: string) => `Joins at ${lessonLabel}`,
    joinsAtFinale: "Joins at the finale",
    joined: "In your crew",
    /** label on the lesson intro / route panel */
    onThisStop: "On this stop",
    logoAlt: (brand: string) => `${brand} logo`,
  },
  bosses: {
    "hype-whirlpool": {
      name: "the Whirlpool of Hype",
      victory: "The sea is calm again. Hype can't pull you in anymore.",
    },
    "siren-island": {
      name: "the Island of Sirens",
      victory: "The songs fade away. No siren can fool you now.",
    },
  },
  battle: {
    /** "Boss: the Island of Sirens" */
    boss: (name: string) => `Boss: ${name}`,
    power: "Boss power",
    round: (n: number, total: number) => `Round ${n} of ${total}`,
    strike: "Strike!",
    nextRound: "Next round",
    finish: "Final blow! 🏆",
    shield: "Phantom's shield",
    shieldHint: "Hint from Phantom",
    /** "You beat the Island of Sirens!" */
    victoryTitle: (name: string) => `You beat ${name}!`,
    perfectHits: (hits: number, total: number) => `${hits} of ${total} perfect hits`,
    defeatFirst: "Beat the boss first",
  },
};
