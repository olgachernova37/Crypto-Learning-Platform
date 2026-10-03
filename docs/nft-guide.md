# How to Create NFTs on Solana — Guide for the MVP

To reward learners with an NFT animal, the right tool on Solana is **Metaplex**. You do not write a smart contract from scratch — Metaplex handles the minting. Because you give the same animal to many learners, **compressed NFTs** are the cheap, scalable choice. Everything below runs free on devnet.

## Two kinds of NFT

- **Regular NFT.** Each one stored fully onchain. Fine for a few, but gets expensive when you mint many.
- **Compressed NFT (cNFT).** Data stored in a Merkle tree, hundreds of times cheaper per mint. Made for mass minting — exactly our case, where thousands of learners each get the same reward.

**For this project: use compressed NFTs.** They scale cheaply, and on devnet everything is free anyway.

## What you need before minting

1. **The image.** Your animal mascot as a PNG or similar file.
2. **Metadata.** A small JSON file with the name, description, and a link to the image. This is what wallets read to display the NFT.
3. **Storage.** Upload the image and metadata to decentralized storage (Arweave or IPFS) so the links are permanent. Metaplex has upload helpers for this.
4. **A wallet with some SOL.** On devnet you get free SOL from an airdrop to pay the tiny minting fees.

## Minting flow (with Metaplex)

1. **Connect to devnet** through an RPC endpoint and load your wallet.
2. **Upload** the image, then the metadata JSON, and keep the metadata link (URI).
3. **Create a Merkle tree** once. This is the container that holds all your compressed NFTs — you set up one tree and mint many NFTs into it. You pay for the tree once.
4. **Mint** a compressed NFT into that tree for each learner, pointing at the metadata URI. The NFT lands in their wallet address.
5. **Done** — the learner can see it in their wallet and on an explorer.

## Tools and libraries

- **Umi** — Metaplex's JavaScript/TypeScript framework. The base you build on.
- **Bubblegum (mpl-bubblegum)** — the Metaplex program for compressed NFTs. Use **Bubblegum v2**, the latest version, built for mass minting.
- **Metaplex Core** — for regular (non-compressed) NFTs, if you ever want a small number of special ones.
- **DAS API** — a read API to fetch compressed NFTs, since they are not stored like regular tokens. Wallets and explorers use it to show cNFTs.

## Easiest way to try it first

Before wiring it into the app, mint one NFT by hand to see the whole flow:

1. Use **Solana Playground** (a browser IDE, no local setup) or a small Node project with Umi and Bubblegum.
2. Create a devnet wallet and request a free **airdrop** of devnet SOL.
3. Upload a test image and metadata, create one Merkle tree, and mint one compressed NFT to your own wallet.
4. Open your wallet or an explorer and check it appears.

Once that works by hand, you move the same steps into the lesson flow.

## How the user sees their NFT

After minting, the compressed NFT appears in the collectibles / NFT tab of a wallet that supports cNFTs (Phantom does). It also shows on explorers like Solana Explorer, Solscan, or SolanaFM. This is exactly what the "view your NFT animal" mini-lesson walks the learner through.

Sources: [Metaplex Bubblegum v2](https://developers.metaplex.com/bubblegum-v2), [mpl-bubblegum on GitHub](https://github.com/metaplex-foundation/mpl-bubblegum)
