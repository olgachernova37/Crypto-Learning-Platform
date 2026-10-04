import type { Lesson } from "../types";

// Our own lesson (solana.com/learn has no memecoin chapter). Education only, never advice to buy.
export const lesson7: Lesson = {
  id: "memecoins",
  number: 7,
  kicker: "Memecoins",
  title: "Memecoins: jokes with a price tag 🐶",
  summary: "Where those funny dog coins come from, and why their prices ride a rollercoaster.",
  minutes: 4,
  xp: 50,
  outro: "You can now spot hype from a mile away. That calm, curious head is your best tool in crypto!",
  steps: [
    {
      id: "born-from-a-joke",
      title: "Born from a joke 😂",
      body: [
        "A memecoin is a coin that started as an internet joke or a funny picture. The most famous one, Dogecoin, was made in 2013 as a joke about a Shiba Inu dog meme.",
        "Solana has its own famous ones too, like BONK, another dog. Many memecoins have cute animals, inside jokes and very excited online fans.",
        "Here's the key thing: most memecoins don't have a product or a business behind them. Their price depends mostly on attention and hype: how many people are talking about them right now.",
      ],
      example: "Like a funny sticker everyone in your group chat shares for a week. Everyone loves it, until the next one comes along.",
      quiz: {
        kind: "single",
        question: "What mostly drives a memecoin's price?",
        options: [
          { id: "a", text: "Profits from a factory or a shop" },
          { id: "b", text: "Hype and attention online" },
          { id: "c", text: "A guarantee from a government" },
        ],
        correct: "b",
        explanation: "Most memecoins have no business behind them, so their price moves with attention and hype. When the buzz fades, the price usually does too. 😂",
      },
    },
    {
      id: "rollercoaster",
      title: "A rollercoaster ride 🎢",
      body: [
        "Today, anyone can create a new coin in a few minutes, so thousands of memecoins appear every single day. Most of them lose almost all of their value quickly.",
        "Prices can jump up a lot in an hour and crash just as fast. Often the people who got in early sell to the people who arrive late, excited by the hype. That's called a pump and dump.",
        "Sometimes it's worse: the creators collect people's money and simply disappear. That's called a rug pull, as in pulling the rug from under everyone's feet.",
      ],
      example: "Imagine a party where the organisers sell lots of tickets, then leave with the money before the music even starts.",
      quiz: {
        kind: "match",
        question: "Match each word with what it means.",
        pairs: [
          { left: "Pump and dump", right: "Price pushed up by hype, then early holders sell" },
          { left: "Rug pull", right: "The creators vanish with everyone's money" },
          { left: "FOMO", right: "Fear of missing out, which rushes decisions" },
        ],
        explanation: "A pump and dump inflates the price and then sells, a rug pull is creators running off with the money, and FOMO is the panicky feeling that makes people jump in too fast. 🎢",
      },
    },
    {
      id: "look-before-you-leap",
      title: "Look before you leap 🧭",
      body: [
        "We're not here to tell you what to buy or not buy. We're here to help you think clearly.",
        "If you ever come across a memecoin, ask yourself: how long has it existed? Is a big share held by just a few wallets? Is someone promising it will \"100x\"? Remember that some influencers are paid to promote coins.",
        "And the golden rule of any risky thing: only ever use money you could lose completely without it hurting your life.",
      ],
      example: "It's like a casino night with friends: fun to watch, but you only bring cash you're happy to never see again.",
      quiz: {
        kind: "truefalse",
        question: "If a memecoin went up 1000% this week, it will surely keep going up next week.",
        correct: false,
        explanation: "False! Past jumps say nothing about the future, and memecoins can crash just as fast as they rise. Stay curious and calm. 🧭",
      },
    },
    {
      id: "boss-whirlpool",
      title: "Boss: the Whirlpool of Hype 🌀",
      body: [
        "Uh-oh, the sea starts spinning! The Whirlpool of Hype pulls boats in with loud promises and rushed decisions.",
        "Beat it with what you just learned: read each message calmly and pick the clear-headed answer. Every answer lands a hit, and the right ones hit hardest.",
      ],
      boss: {
        id: "hype-whirlpool",
        rounds: [
          {
            kind: "single",
            question: "A post shouts: \"This coin will 100x by Friday, guaranteed! 🚀\" What is it?",
            options: [
              { id: "a", text: "A hype promise: nobody can guarantee a price." },
              { id: "b", text: "A safe tip from someone who knows." },
            ],
            correct: "a",
            explanation: "Nobody can guarantee where a price goes. \"Guaranteed\" plus rockets is the whirlpool's favourite song. 🌀",
            hint: "Can anyone really know the price next Friday?",
          },
          {
            kind: "truefalse",
            question: "A coin launched two hours ago, and just a few wallets hold most of it. That's a warning sign.",
            correct: true,
            explanation: "True! Brand-new and owned by a few wallets means a few people can dump it on everyone else in seconds.",
            hint: "Think about who could sell a lot at once.",
          },
          {
            kind: "single",
            question: "Everyone in your group chat is buying, and you feel you must hurry. What's that feeling called?",
            options: [
              { id: "a", text: "Staking" },
              { id: "b", text: "FOMO, the fear of missing out" },
              { id: "c", text: "A network fee" },
            ],
            correct: "b",
            explanation: "That's FOMO. Noticing it is half the win: a real chance doesn't need you to panic. 🧘",
            hint: "It's a feeling, not a feature of the blockchain.",
          },
          {
            kind: "single",
            question: "If you ever try something this risky, how much should you use?",
            options: [
              { id: "a", text: "Only money you could lose completely without it hurting." },
              { id: "b", text: "This month's rent, it'll grow fast." },
              { id: "c", text: "Borrowed money, to win bigger." },
            ],
            correct: "a",
            explanation: "Only money you could lose without it hurting your life. That one rule keeps you out of every whirlpool. ⚓",
            hint: "What if the price goes to zero tomorrow?",
          },
        ],
      },
    },
  ],
};
