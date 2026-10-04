// Russian: voyage — the crew (partners who join along the route) and the two bosses.
export const ruVoyage = {
  voyage: {
    allies: {
      phantom: {
        role: "Хранитель ключей",
        joins: "Phantom в твоей команде!",
        line: "Теперь ты знаешь, что такое кошелёк, — познакомься с настоящим. Phantom бережёт твои ключи в каждом плавании и предупреждает о подозрительных запросах.",
        cta: "Установить Phantom",
      },
      bybit: {
        role: "Гавань обмена",
        joins: "Ты в гавани Bybit EU!",
        line: "Наш автомат меняет одну монету на другую. А в гавани Bybit EU можно превратить евро с банковской карты в настоящую крипту — по правилам ЕС.",
        cta: "Перейти на Bybit EU",
      },
      marinade: {
        role: "Смотритель маяка",
        joins: "Маяк Marinade зажёгся!",
        line: "Тренировка по ликвидному стейкингу пройдена! Marinade — это по-настоящему: стейкай SOL, получай mSOL и смотри, как он растёт. Пройди тренировочный квест и получи NFT-морскую звезду.",
        cta: "Начать квест по стейкингу",
      },
      superteam: {
        role: "Твоя команда на суше",
        joins: "Superteam встречает тебя на берегу!",
        line: "Здесь заканчивается плавание и начинается твоё сообщество. Superteam проводит бесплатные мероприятия, встречи и обучение для новичков в Solana.",
        cta: "Познакомиться с сообществом",
      },
    },
    crew: {
      newCrewmate: "Новый член команды",
      title: "Твоя команда",
      empty: "Твоя команда ждёт тебя на маршруте. Первый участник присоединится после урока 02.",
      joinsAt: (lessonLabel: string) => `Присоединится: ${lessonLabel}`,
      joinsAtFinale: "Присоединится на финише",
      joined: "В твоей команде",
      onThisStop: "На этой остановке",
      logoAlt: (brand: string) => `Логотип ${brand}`,
    },
    bosses: {
      "hype-whirlpool": {
        name: "Водоворот хайпа",
        victory: "Море снова спокойно. Хайп больше не затянет тебя.",
      },
      "siren-island": {
        name: "Остров сирен",
        victory: "Песни стихают. Теперь ни одной сирене тебя не обмануть.",
      },
    },
    battle: {
      boss: (name: string) => `Босс: ${name}`,
      power: "Сила босса",
      round: (n: number, total: number) => `Раунд ${n} из ${total}`,
      strike: "Удар!",
      nextRound: "Следующий раунд",
      finish: "Решающий удар! 🏆",
      shield: "Щит Phantom",
      shieldHint: "Подсказка от Phantom",
      // Gender-neutral and case-safe: the name stays in the nominative.
      victoryTitle: (name: string) => `Победа! ${name} позади`,
      perfectHits: (hits: number, total: number) => `Точных ударов: ${hits} из ${total}`,
      defeatFirst: "Сначала победи босса",
    },
  },
};
