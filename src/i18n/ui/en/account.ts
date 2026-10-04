// English UI strings: account (the "what's your name?" step and personal greetings).
export const account = {
  dialog: {
    title: "What should we call you?",
    sub: "Just your first name or a nickname. It's all we need to start your voyage.",
    label: "Your name",
    placeholder: "e.g. Olya",
    submit: "Set sail",
    privacy: "We only keep your name. No email, no password.",
    close: "Close",
  },
  /** small greeting on the boat route */
  hello: (name: string) => `Ahoy, ${name}! 👋`,
  /** progress page heading eyebrow */
  progressOf: (name: string) => `${name}'s voyage`,
  /** on the NFT card at the finale */
  earnedBy: (name: string) => `Earned by ${name}`,
  changeName: "Change name",
};
