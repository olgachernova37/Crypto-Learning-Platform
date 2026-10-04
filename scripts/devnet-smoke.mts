// Smoke test for src/lib/solana/devnet.ts against a local validator (or any RPC):
//   NEXT_PUBLIC_SOLANA_RPC=http://127.0.0.1:8899 npx tsx scripts/devnet-smoke.mts
import { getBalanceSol, newSeed, requestAirdrop, sendSol, signerFromSeed, getReceipt, explorerUrl } from "../src/lib/solana/devnet";

const me = await signerFromSeed(newSeed());
const friend = await signerFromSeed(newSeed());
console.log("wallet", me.address);
const a = await requestAirdrop(me.address, 1);
console.log("airdrop", a, "balance", await getBalanceSol(me.address));
const sig = await sendSol(me, friend.address, 0.1);
console.log("sent", sig);
console.log("balances", await getBalanceSol(me.address), await getBalanceSol(friend.address));
console.log("receipt", await getReceipt(sig));
console.log("explorer", explorerUrl("tx", sig));
