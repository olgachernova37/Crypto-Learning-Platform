import type { Lesson } from "../types";

// Inspired by solana.com/learn "What are NFTs?" (rewritten for beginners, not copied).
export const lesson6: Lesson = {
  id: "nfts",
  number: 6,
  kicker: "NFTs",
  title: "One of a kind 🖼️",
  summary: "Why some digital things are unique, and what owning one really means.",
  minutes: 4,
  xp: 50,
  outro: "Now you know what an NFT really is. Spoiler: a one-of-a-kind sea friend is waiting for you at the end of the route!",
  steps: [
    {
      id: "one-of-a-kind",
      title: "Swappable vs one of a kind 🎟️",
      body: [
        "A 10-euro note is just like any other 10-euro note. If you swap yours for a friend's, nobody loses anything. Things like that are called fungible: every piece is the same. SOL is fungible too.",
        "Now think of a concert ticket for seat 12B, or your grandma's painting. There's only one, so you can't simply swap it for another. That's non-fungible.",
        "An NFT, a non-fungible token, is a one-of-a-kind digital item. The blockchain keeps a public record of who owns it, so anyone can check.",
      ],
      example: "Any 1-euro coin will do for a coffee. But your boarding pass for seat 14A? Only that one gets you on the plane.",
      quiz: {
        kind: "match",
        question: "Match each word with its meaning.",
        pairs: [
          { left: "Fungible", right: "Every piece is the same, like coins" },
          { left: "Non-fungible", right: "One of a kind, like a ticket for seat 12B" },
          { left: "NFT", right: "A unique digital item with a public owner record" },
        ],
        explanation: "Fungible = all the same, non-fungible = one of a kind, and an NFT is a unique digital item whose owner anyone can check. 🎟️",
      },
    },
    {
      id: "not-just-pictures",
      title: "Not just pictures 🎮",
      body: [
        "You may have heard of NFTs as pricey cartoon pictures. But that's just one use. An NFT can be anything that needs to be unique and provably yours.",
        "Event tickets that can't be faked, an item in a video game you truly own, a club membership card, a certificate for finishing a course, or a piece of digital art.",
        "On Solana, making NFTs is very cheap. There's even a \"compressed\" kind that lets a game or festival hand out thousands of them for just a few cents.",
      ],
      example: "Imagine your gym card living in your wallet app: it proves you're a member, and nobody can copy it.",
      quiz: {
        kind: "multiple",
        question: "Which of these could be an NFT?",
        options: [
          { id: "a", text: "A concert ticket for one specific seat" },
          { id: "b", text: "A sword you own in a video game" },
          { id: "c", text: "A membership card for a book club" },
          { id: "d", text: "1 SOL, exactly like every other SOL" },
        ],
        correct: ["a", "b", "c"],
        explanation: "Tickets, game items and memberships are one of a kind, so they fit perfectly. 1 SOL is the same as any other SOL, so it's fungible, not an NFT. 🎮",
      },
    },
    {
      id: "what-you-own",
      title: "What you really own 🔑",
      body: [
        "Here's a surprise for many people: owning an NFT of an artwork usually doesn't give you the copyright. You own that unique token, not the right to print the picture on T-shirts.",
        "Anyone can screenshot the picture. What they can't copy is the public record that says you're the owner.",
        "The picture itself is often stored on another service, and Solana keeps track of who owns it. At the end of this route you'll get your own NFT: Pebble the Sea Turtle, a learning badge with no money value, just proof of your voyage.",
      ],
      example: "Buying a signed print from an artist makes it yours to hang on the wall, but the artist still owns the right to the artwork.",
      quiz: {
        kind: "truefalse",
        question: "Buying an NFT of an artwork automatically gives you the copyright to it.",
        correct: false,
        explanation: "False! You own the unique token and its public owner record. The copyright usually stays with the artist. 🔑",
      },
    },
  ],
};
