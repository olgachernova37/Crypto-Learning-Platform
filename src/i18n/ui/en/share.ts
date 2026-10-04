// English UI strings: share (the social card "I finished Crypto Voyage", "Invite a friend",
// and the /voyager page people land on from a shared link). Also used server-side for the card image.
export const share = {
  /** Shown instead of a name when none is set. */
  someone: "A voyager",

  /** The image card (1200×630 for link previews, 1080×1350 to download for stories). */
  card: {
    doneBadge: "Course finished",
    done: (name: string) => `${name} sailed through Crypto Voyage!`,
    doneSub: (lessons: number) => `${lessons} lessons about crypto, and a real NFT on Solana devnet.`,
    inviteBadge: "Invitation",
    invite: (name: string) => `${name} invites you on a crypto voyage`,
    inviteSub: "Learn crypto from zero. Short lessons, safe practice, no real money.",
  },

  /** Buttons on the finale and progress pages. */
  download: "Download my card",
  invite: "Invite a friend",
  /** Text sent with the invite link (share sheet / copied). */
  inviteText: "I'm learning crypto with Crypto Voyage: short, friendly lessons and safe practice on Solana. Come along!",
  inviteTitle: "Bring a friend aboard",
  inviteBody: "Learning is more fun together. Send a friend your invitation card.",
  copied: "Link copied. Paste it anywhere to share!",
  copyManually: (url: string) => `Copy this link to share: ${url}`,

  /** The /voyager page (where a shared link opens). */
  page: {
    doneTitle: (name: string) => `${name} finished Crypto Voyage`,
    inviteTitle: (name: string) => `${name} invites you aboard`,
    body: "Short, friendly lessons about crypto and Solana, with real practice on devnet. No real money, nothing to lose.",
    cta: "Start my voyage",
    cardAlt: "Crypto Voyage card",
  },
};
