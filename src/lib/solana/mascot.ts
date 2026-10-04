// Mint the learner's mascot as a real 1-of-1 NFT on Solana devnet, using Token Extensions
// (Token-2022): the name, symbol and metadata link live on the mint itself (metadata pointer +
// token metadata extensions), so no extra programs are needed. After minting, the mint
// authority is removed, so exactly one can ever exist.

import { address, generateKeyPairSigner, none, some, type KeyPairSigner } from "@solana/kit";
import { getCreateAccountInstruction } from "@solana-program/system";
import {
  AuthorityType,
  TOKEN_2022_PROGRAM_ADDRESS,
  extension,
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstruction,
  getInitializeMintInstruction,
  getMintSize,
  getMintToInstruction,
  getPostInitializeInstructionsForMintExtensions,
  getPreInitializeInstructionsForMintExtensions,
  getSetAuthorityInstruction,
} from "@solana-program/token-2022";
import { rpc, sendInstructions } from "./devnet";

export type MascotMetadata = { name: string; symbol: string; uri: string };

export async function mintMascotNft(payer: KeyPairSigner, recipient: string, meta: MascotMetadata) {
  const mint = await generateKeyPairSigner();
  const owner = address(recipient);

  const pointer = extension("MetadataPointer", { authority: some(payer.address), metadataAddress: some(mint.address) });
  const tokenMetadata = extension("TokenMetadata", {
    updateAuthority: some(payer.address),
    mint: mint.address,
    name: meta.name,
    symbol: meta.symbol,
    uri: meta.uri,
    additionalMetadata: new Map(),
  });

  // allocate space for the fixed-size extension now; fund rent for the metadata that grows into it
  const space = BigInt(getMintSize([pointer]));
  const rent = await rpc().getMinimumBalanceForRentExemption(BigInt(getMintSize([pointer, tokenMetadata]))).send();

  const [ata] = await findAssociatedTokenPda({ owner, mint: mint.address, tokenProgram: TOKEN_2022_PROGRAM_ADDRESS });

  const signature = await sendInstructions(payer, [
    getCreateAccountInstruction({ payer, newAccount: mint, lamports: rent, space, programAddress: TOKEN_2022_PROGRAM_ADDRESS }),
    ...getPreInitializeInstructionsForMintExtensions(mint.address, [pointer]),
    getInitializeMintInstruction({ mint: mint.address, decimals: 0, mintAuthority: payer.address, freezeAuthority: none() }),
    ...getPostInitializeInstructionsForMintExtensions(mint.address, payer, [tokenMetadata]),
    getCreateAssociatedTokenIdempotentInstruction({
      payer,
      ata,
      owner,
      mint: mint.address,
      tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
    }),
    getMintToInstruction({ mint: mint.address, token: ata, mintAuthority: payer, amount: BigInt(1) }),
    getSetAuthorityInstruction({ owned: mint.address, owner: payer, authorityType: AuthorityType.MintTokens, newAuthority: none() }),
  ]);

  return { mint: mint.address as string, signature: signature as string };
}
