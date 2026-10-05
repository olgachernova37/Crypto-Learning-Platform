// Czech: voyage namespace — the crew (partners who join along the route) and the two bosses.
// Boss names are in the nominative and both are masculine inanimate ("Vír", "Ostrov"),
// so "Boss: {name}" and "{name} je poražen!" work for both without gendering the learner.
export const csVoyage = {
  voyage: {
    allies: {
      phantom: {
        role: "Strážce klíčů",
        joins: "Phantom se přidává k tvé posádce!",
        line: "Teď už víš, co je peněženka, tak se seznam se skutečnou. Phantom ti na každé cestě hlídá klíče a varuje tě před podezřelými požadavky.",
        cta: "Získat Phantom",
      },
      bybit: {
        role: "Směnárenský přístav",
        joins: "Vítej v přístavu Bybit EU!",
        line: "Náš automat mění minci za minci. V přístavu Bybit EU si můžeš eura z bankovní karty proměnit ve skutečné krypto, a to podle pravidel EU.",
        cta: "Navštívit Bybit EU",
      },
      marinade: {
        role: "Strážce majáku",
        joins: "Maják Marinade se rozsvítil!",
        line: "Likvidní staking už znáš z tréninku. Marinade to umí doopravdy: stakuj SOL, získej mSOL a nech je růst. Zkus cvičný úkol a získej NFT hvězdici.",
        cta: "Začít úkol se stakingem",
      },
      trezor: {
        role: "Strážce trezoru",
        joins: "Trezor se přidává k posádce!",
        line: "Tvoje úspory si zaslouží trezor. Trezor je hardwarová peněženka z Prahy: tvoje klíče zůstávají offline a nic neodejde, dokud nezmáčkneš tlačítko na zařízení. Funguje se Solanou.",
        cta: "Prozkoumat Trezor",
      },
      superteam: {
        role: "Tvoje posádka na souši",
        joins: "Superteam tě vítá na břehu!",
        line: "Tady tvoje plavba končí a začíná tvoje komunita. Superteam pořádá akce, setkání a vzdělávání zdarma pro všechny, kdo se Solanou začínají.",
        cta: "Poznat komunitu",
      },
    },
    crew: {
      newCrewmate: "Nový člen posádky",
      title: "Tvoje posádka",
      empty: "Tvoje posádka na tebe čeká podél trasy. První člen se přidá po lekci 02.",
      // "Lekce 02" → "Přidá se v lekci 02" (locative); other labels fall back to "Přidá se: …"
      joinsAt: (lessonLabel: string) =>
        /^Lekce /.test(lessonLabel) ? `Přidá se v ${lessonLabel.replace(/^Lekce/, "lekci")}` : `Přidá se: ${lessonLabel}`,
      joinsAtFinale: "Přidá se ve finále",
      joined: "V tvé posádce",
      onThisStop: "Na této zastávce",
      logoAlt: (brand: string) => `Logo ${brand}`,
    },
    bosses: {
      "hype-whirlpool": {
        name: "Vír hypu",
        victory: "Moře je zase klidné. Hype tě už nevtáhne.",
      },
      "siren-island": {
        name: "Ostrov sirén",
        victory: "Písně utichají. Teď už tě žádná siréna neoklame.",
      },
    },
    battle: {
      boss: (name: string) => `Boss: ${name}`,
      power: "Síla bosse",
      round: (n: number, total: number) => `Kolo ${n} z ${total}`,
      strike: "Úder!",
      nextRound: "Další kolo",
      finish: "Poslední úder! 🏆",
      shield: "Štít Phantomu",
      shieldHint: "Nápověda od Phantomu",
      victoryTitle: (name: string) => `${name} je poražen!`,
      perfectHits: (hits: number, total: number) => `Přesné zásahy: ${hits} z ${total}`,
      defeatFirst: "Nejdřív poraz bosse",
    },
  },
};
