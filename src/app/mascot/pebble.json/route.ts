// Off-chain metadata for the mascot NFT (the on-chain token points here via its `uri`).
// Wallets and explorers read this JSON to show the name, picture and traits.

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  return Response.json(
    {
      name: "Pebble the Sea Turtle",
      symbol: "VOYAGE",
      description:
        "A learning badge from Crypto Voyage: earned by finishing the beginner route: wallets, transfers, block explorers, swaps, staking, NFTs, memecoins and staying safe. Minted on Solana devnet — it has no monetary value.",
      image: `${origin}/mascot/pebble.png`,
      external_url: origin,
      attributes: [
        { trait_type: "Course", value: "Crypto Voyage" },
        { trait_type: "Lessons", value: "5" },
        { trait_type: "Network", value: "Solana devnet" },
      ],
      properties: { category: "image", files: [{ uri: `${origin}/mascot/pebble.png`, type: "image/png" }] },
    },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
