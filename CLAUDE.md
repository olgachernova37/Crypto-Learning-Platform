@AGENTS.md

# CLAUDE.md

Crypto learning web platform for complete beginners (Duolingo + SoloLearn style), built for the SolanaCZE Build Station / Colosseum hackathon. Full product spec: [SPEC.md](SPEC.md). NFT minting notes: [docs/nft-guide.md](docs/nft-guide.md).

## Must-follow rules

- **Devnet only.** Never touch mainnet, never ask for or handle private keys or seed phrases.
- **Audience is non-developers.** No code is taught. Lesson text is warm, simple, friend-to-friend, with real-life examples, no jargon.
- **UI language: English** (Ukrainian may come later — keep strings easy to extract).
- **Mobile-first, responsive.** Every screen must work on a phone; bottom nav on mobile.
- **No hearts/lives, no leaderboard.** Gamification = streak + XP + NFT animal reward.
- **Wrong answer → show the correct one with an explanation right away** (no "try again" loop).
- Multiple-correct quizzes use square checkboxes + "select all that apply".

## Design

- Rounded shapes everywhere, soft and airy, lots of white space, friendly sans-serif font (font not chosen yet).
- Ocean palette — use these as design tokens:
  - Deep ocean `#0D2B45` (text, dark accents)
  - Ocean teal `#1E5A6E` (primary)
  - Seafoam `#6BA7A0` (secondary / success)
  - Sandy beige `#DCC8AA` (warm accent)
  - Light sky `#B7D4E6` (light backgrounds)
- **Lesson + quiz template: https://2025.oceanx.org/** (animation described step by step in SPEC.md, frames in `docs/design/oceanx-*.png`): globe intro → zoom to ocean → top-down boat sailing a full-screen animated deep-blue sea with a wake → chapter text fades in bottom-right ("Lesson 01" label, kicker, big headline, one line, pill button) → lesson opens FULL-SCREEN as a new page (theirs is a side slide-in panel — never do that; a lesson needs the whole screen) → zoom out to globe for the finale. Copy the feel, never their content, logo or photos. Mapping: their chapter label ("Chapter 01 · place") → "Lesson 01 · topic"; "Keep exploring" → next; "Back to timeline" → "Back to the route"; "Enter experience" → globe start button; "Share the journey" → NFT finale (table in SPEC.md).
- References in `docs/design/` — take the layout ideas (answer rows with A/B/C badges, rounded numbered lesson cards with progress bars, welcome banner, celebration screen), not their colors.

## Stack

Next.js · Solana Kit · embedded wallet (provider TBD), Phantom later · Metaplex compressed NFTs (Bubblegum v2, Umi) · Solana Explorer links.

## Solana (devnet)

- `src/lib/solana/devnet.ts` — RPC, airdrop, transfer, receipt, Explorer links (Solana Kit). `src/lib/training-wallet.ts` — the hook every screen uses (devnet mode + practice fallback).
- `src/lib/solana/mascot.ts` — mints the mascot NFT (Token-2022 + metadata extension). Metadata route: `src/app/mascot/pebble.json/route.ts`. Smoke test: `scripts/mascot-smoke.mts`.
- Test without devnet access: run `solana-test-validator`, build with `NEXT_PUBLIC_SOLANA_RPC=http://127.0.0.1:8899`, or `NEXT_PUBLIC_SOLANA_RPC=http://127.0.0.1:8899 npx tsx scripts/devnet-smoke.mts`.

## Pages

Home ("Welcome, voyager — Your first stop: Solana": illustrated Solana planet + our boat arriving, CTA "Start the journey" → /journey) → Lessons list (a boat sails a route; each stop = a lesson) → Lesson on its own new page, not a slide-in (steps + quizzes + "Ask AI" button) → Partners ("We recommend"). All in the ocean palette.
