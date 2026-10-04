// Real Solana DEVNET helpers for the in-browser practice wallet.
// Devnet coins have no value. The wallet's key lives only in this browser (localStorage) and is
// never shown or sent anywhere — it exists so a beginner can make real devnet transactions
// without installing anything. Never use this for real money.

import {
  address,
  appendTransactionMessageInstructions,
  createKeyPairSignerFromPrivateKeyBytes,
  createSolanaRpc,
  createTransactionMessage,
  devnet,
  getBase64EncodedWireTransaction,
  getSignatureFromTransaction,
  lamports,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type Instruction,
  type KeyPairSigner,
  type Signature,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";

export const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com";
export const LAMPORTS_PER_SOL = 1_000_000_000;

/** Solana Explorer link for a transaction or address on our cluster. */
export function explorerUrl(kind: "tx" | "address", value: string) {
  const isDevnet = RPC_URL.includes("devnet");
  const q = isDevnet ? "cluster=devnet" : `cluster=custom&customUrl=${encodeURIComponent(RPC_URL)}`;
  return `https://explorer.solana.com/${kind}/${value}?${q}`;
}

// typed as a devnet RPC so test-only methods like requestAirdrop are available
const makeRpc = () => createSolanaRpc(devnet(RPC_URL));
let rpcSingleton: ReturnType<typeof makeRpc> | null = null;
export const rpc = () => (rpcSingleton ??= makeRpc());

/** Restore (or create) the browser practice wallet from a 32-byte secret seed. */
export async function signerFromSeed(seed: Uint8Array): Promise<KeyPairSigner> {
  return createKeyPairSignerFromPrivateKeyBytes(seed);
}

export function newSeed(): Uint8Array {
  const seed = new Uint8Array(32);
  crypto.getRandomValues(seed);
  return seed;
}

export async function getBalanceSol(addr: string): Promise<number> {
  const { value } = await rpc().getBalance(address(addr), { commitment: "confirmed" }).send();
  return Number(value) / LAMPORTS_PER_SOL;
}

async function waitForConfirmation(sig: Signature, timeoutMs = 45_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const { value } = await rpc().getSignatureStatuses([sig]).send();
    const st = value[0];
    if (st?.err) throw new Error("The network rejected the transaction.");
    if (st && (st.confirmationStatus === "confirmed" || st.confirmationStatus === "finalized")) return;
    await new Promise((r) => setTimeout(r, 800));
  }
  throw new Error("The network is slow right now. Please try again in a moment.");
}

/** Ask the devnet faucet for free test SOL. Public faucets are often rate-limited. */
export async function requestAirdrop(addr: string, sol = 1): Promise<Signature> {
  const sig = await rpc()
    .requestAirdrop(address(addr), lamports(BigInt(Math.round(sol * LAMPORTS_PER_SOL))), { commitment: "confirmed" })
    .send();
  await waitForConfirmation(sig);
  return sig;
}

/** Build, sign (fee payer + any signers inside the instructions), send and confirm one transaction. */
export async function sendInstructions(feePayer: KeyPairSigner, instructions: Instruction[]): Promise<Signature> {
  const { value: latestBlockhash } = await rpc().getLatestBlockhash({ commitment: "confirmed" }).send();
  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(feePayer, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) => appendTransactionMessageInstructions(instructions, m),
  );
  const signed = await signTransactionMessageWithSigners(message);
  const sig = getSignatureFromTransaction(signed);
  await rpc().sendTransaction(getBase64EncodedWireTransaction(signed), { encoding: "base64" }).send();
  await waitForConfirmation(sig);
  return sig;
}

/** Send SOL from the practice wallet. Returns the transaction signature once confirmed. */
export async function sendSol(from: KeyPairSigner, to: string, sol: number): Promise<Signature> {
  return sendInstructions(from, [
    getTransferSolInstruction({
      source: from,
      destination: address(to),
      amount: lamports(BigInt(Math.round(sol * LAMPORTS_PER_SOL))),
    }),
  ]);
}

/** Read a confirmed transaction for the receipt (fee, time, status). */
export async function getReceipt(sig: string) {
  const tx = await rpc()
    .getTransaction(sig as Signature, { commitment: "confirmed", maxSupportedTransactionVersion: 0, encoding: "json" })
    .send();
  if (!tx) return null;
  return {
    feeSol: Number(tx.meta?.fee ?? 0) / LAMPORTS_PER_SOL,
    blockTime: tx.blockTime ? Number(tx.blockTime) * 1000 : null,
    ok: !tx.meta?.err,
    slot: Number(tx.slot),
  };
}
