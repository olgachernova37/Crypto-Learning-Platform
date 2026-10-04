// Ukrainian UI strings: voyage — the crew (partners who join along the route) and the two bosses.
// Brand names (Phantom, Bybit EU, Marinade, Superteam, mSOL) stay as they are.
// Boss names are in the nominative case: the battle sentences are built around that.
export const ukVoyage = {
  voyage: {
    allies: {
      phantom: {
        role: "Хранитель ключів",
        joins: "Phantom приєднується до екіпажу!",
        line: "Тепер ти знаєш, що таке гаманець, тож знайомся зі справжнім. Phantom береже твої ключі в кожній подорожі й попереджає про підозрілі запити.",
        cta: "Встановити Phantom",
      },
      bybit: {
        role: "Гавань обміну",
        joins: "Попереду гавань Bybit EU!",
        line: "Наш чесний автомат міняє монету на монету. А в гавані Bybit EU можна обміняти євро з банківської картки на справжню крипту — за правилами ЄС.",
        cta: "Перейти на Bybit EU",
      },
      marinade: {
        role: "Хранитель маяка",
        joins: "Маяк Marinade засвітився!",
        line: "Тренування з ліквідного стейкінгу позаду, а Marinade — це вже по-справжньому: застейкай SOL, отримай mSOL і дай йому рости. Пройди тренувальний квест і забери NFT «Морська зірка».",
        cta: "Почати квест зі стейкінгу",
      },
      superteam: {
        role: "Твій екіпаж на суші",
        joins: "Superteam зустрічає тебе на березі!",
        line: "Тут твоя подорож закінчується, а починається спільнота. Superteam проводить безкоштовні події, зустрічі й навчання для тих, хто тільки знайомиться з Solana.",
        cta: "До спільноти",
      },
    },
    crew: {
      newCrewmate: "Поповнення в екіпажі",
      title: "Твій екіпаж",
      empty: "Твій екіпаж чекає на тебе вздовж маршруту. Перший член екіпажу приєднається після уроку 02.",
      /** "Приєднається: Урок 02" (lessonLabel is already "Урок 02") */
      joinsAt: (lessonLabel: string) => `Приєднається: ${lessonLabel}`,
      joinsAtFinale: "Приєднається у фіналі",
      joined: "В екіпажі",
      onThisStop: "На цій зупинці",
      logoAlt: (brand: string) => `Логотип ${brand}`,
    },
    bosses: {
      "hype-whirlpool": {
        name: "Вир хайпу",
        victory: "Море знову спокійне. Хайп більше не затягне тебе у вир.",
      },
      "siren-island": {
        name: "Острів сирен",
        victory: "Пісні стихають. Тепер жодна сирена тебе не обдурить.",
      },
    },
    battle: {
      /** "Бос: Острів сирен" */
      boss: (name: string) => `Бос: ${name}`,
      power: "Сила боса",
      round: (n: number, total: number) => `Раунд ${n} з ${total}`,
      strike: "Удар!",
      nextRound: "Наступний раунд",
      finish: "Вирішальний удар! 🏆",
      shield: "Щит Phantom",
      shieldHint: "Підказка від Phantom",
      /** "Острів сирен переможено!" — impersonal form avoids gendered "переміг/перемогла" */
      victoryTitle: (name: string) => `${name} переможено!`,
      perfectHits: (hits: number, total: number) => `Влучних ударів: ${hits} з ${total}`,
      defeatFirst: "Спершу переможи боса",
    },
  },
};
