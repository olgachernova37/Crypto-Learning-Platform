// English UI strings: privacy (the /privacy page, "delete my data", and the training-wallet notice).
// Keep it honest and plain: this text must match what the app really stores (see src/lib/profile.ts,
// src/lib/server/learners.ts, src/app/api/ai/route.ts).
export const privacy = {
  /** Small link in the name dialog, the lessons drawer and the progress page. */
  link: "Privacy",
  eyebrow: "Privacy",
  title: "Your data, in plain words",
  intro:
    "Crypto Voyage is a small learning project by Olga Chernova, a student at 42 Prague. We keep as little as we can. Here is all of it.",
  updated: "Last updated: October 2026",
  sections: [
    {
      title: "What we keep about you",
      body: "Only the name or nickname you type in. It is saved on your device and, when our database is switched on, on our server too, together with a random ID, your language and the dates you joined and last visited. No email, no password, no phone number.",
    },
    {
      title: "What stays on your device only",
      body: "Your progress, XP and streak, your practice wallet and the Phantom address you connected. They live in this browser's storage and never reach our server.",
    },
    {
      title: "The AI guide",
      body: "When you ask the guide something, your question and the lesson step you are on are sent to Google Gemini so it can write an answer. Your name is not sent. Please don't type personal details into the chat.",
    },
    {
      title: "Visit statistics",
      body: "We count page visits with Vercel Web Analytics. It uses no cookies and doesn't identify you. It only shows us things like how many people finish a lesson.",
    },
    {
      title: "The blockchain is public",
      body: "Everything on Solana devnet is public by design: anyone can see wallet addresses and transactions on Solana Explorer. Devnet coins have no value.",
    },
    {
      title: "Who helps us run it",
      body: "The site runs on Vercel, and the list of names is stored with Upstash. They process data only on our behalf. We never sell data and never show ads.",
    },
    {
      title: "Why we keep it",
      body: "So you don't have to type your name again, and so we can see how many people the course helps. That is our legitimate interest in running and improving it.",
    },
    {
      title: "Your rights",
      body: "You can see, correct or delete your data at any time: change your name in the app, or use the button below to delete everything. Under the GDPR you can also complain to a data protection authority (in Czechia, that's ÚOOÚ).",
    },
  ],
  contactTitle: "Questions?",
  contactBody: "Open an issue on our GitHub page and we'll answer.",
  contactLink: "Write to us on GitHub",

  delete: {
    title: "Delete my data",
    body: "Removes your name from our server and clears everything this site saved in this browser: name, progress, XP and the practice wallet. This can't be undone.",
    button: "Delete my data",
    confirm: "Sure? Everything will be deleted.",
    yes: "Yes, delete",
    no: "Cancel",
    busy: "Deleting…",
    done: "Done. Everything is deleted.",
    failed: "We cleared this browser, but couldn't reach our server. Try again later, or write to us.",
  },

  /** One line under the balances in the practice wallet. */
  walletNotice:
    "This practice wallet lives only in this browser. A new browser or cleared data means a new wallet. It's for learning only: never send real crypto here.",
};
