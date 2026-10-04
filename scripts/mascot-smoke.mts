// Smoke test: mint the mascot NFT (Token-2022 + metadata) against any RPC, e.g. a local validator:
//   NEXT_PUBLIC_SOLANA_RPC=http://127.0.0.1:8899 npx tsx scripts/mascot-smoke.mts
import { newSeed, requestAirdrop, signerFromSeed, explorerUrl } from "../src/lib/solana/devnet";
import { mintMascotNft } from "../src/lib/solana/mascot";

const learner = await signerFromSeed(newSeed());
const phantom = await signerFromSeed(newSeed()); // stands in for a pasted Phantom address
await requestAirdrop(learner.address, 1);
const a = await mintMascotNft(learner, learner.address, { name: "Pebble the Sea Turtle", symbol: "VOYAGE", uri: "https://example.com/mascot/pebble.json" });
console.log("minted to self", a);
const b = await mintMascotNft(learner, phantom.address, { name: "Pebble the Sea Turtle", symbol: "VOYAGE", uri: "https://example.com/mascot/pebble.json" });
console.log("minted to other wallet", b, "owner", phantom.address);
console.log(explorerUrl("address", a.mint));
