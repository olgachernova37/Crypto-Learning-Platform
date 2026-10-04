import type { ReactNode } from "react";
import type { DeepPartial } from "../types";
import type { Dict } from "./en";

// Ukrainian translation of src/i18n/ui/en.ts. Anything missing falls back to English.
// Addresses the learner with «ти» and avoids gendered past-tense forms where possible.

/** Ukrainian plural: 1 / 2–4 / 5+ (11–14 → many). */
const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};
/** Decimal comma: 0.1 → "0,1". */
const dec = (n: number) => String(n).replace(".", ",");
const pad = (n: number) => String(n).padStart(2, "0");

type Bold = (text: string) => ReactNode;

export const uk: DeepPartial<Dict> = {
  common: {
    language: "Мова",
    appName: "Crypto Voyage",
    lessonLabel: (num: string) => `Урок ${num}`,
  },

  shell: {
    homeAria: "Crypto Voyage — головна",
    mainNav: "Головне меню",
    nav: {
      journey: "Подорож",
      lessons: "Уроки",
      progress: "Прогрес",
      partners: "Партнери",
    },
    lessonsButton: "Уроки",
    drawer: {
      eyebrow: "Твоя подорож",
      title: "Уроки",
      closeAria: "Закрити список уроків",
      finished: (done: number, total: number) => `Пройдено ${done} з ${total}`,
      listAria: "Уроки",
      done: "Готово",
      minutes: (min: number) => `${min} хв`,
      finishedSr: "(пройдено)",
      progress: "Прогрес",
      partners: "Партнери",
      backToRoute: "Назад до маршруту",
    },
    stats: {
      streakTitle: "Днів поспіль",
      // en.ts infers a literal return type here, hence the cast
      streakSr: (days: number) => ` ${plural(days, "день", "дні", "днів")} поспіль`,
      xpTitle: "Очки досвіду",
      xpUnit: "XP",
    },
  },

  home: {
    tagTitle: "Зупинка 01 · Solana",
    tagLine: "Швидка, недорога, відкрита для всіх",
    eyebrow: "Вітаємо на борту 👋",
    titleLead: "Твоя перша зупинка:",
    lede: "Відкрий для себе крипту й блокчейн з нуля — у коротких інтерактивних уроках для початківців.",
    cta: "Вирушити в подорож",
    note: (lessons: number, minutes: number) =>
      `Досвід у крипті не потрібен · ${lessons} ${plural(lessons, "короткий урок", "короткі уроки", "коротких уроків")} · близько ${minutes} хв`,
    routeLabel: "На твоєму маршруті",
    route: ["Що таке крипта", "Solana", "Гаманці", "Надсилання SOL", "Свапи", "Стейкінг", "NFT", "Мемкоїни", "Безпека"],
  },

  journey: {
    srTitle: "Твій маршрут: обери урок",
    backToStart: "На початок",
    stopCounter: (current: number, total: number) => `Зупинка ${pad(current)} / ${pad(total)}`,
    hint: "Гортай, тягни або тисни ← →, щоб плисти",
    prevAria: "Плисти до попередньої зупинки",
    nextAria: "Плисти до наступної зупинки",
    stopAria: (name: string, title: string, finished: boolean) =>
      `${name}: ${title}${finished ? " (пройдено)" : ""}`,
    lessonMeta: (minutes: number, xp: number) => `~${minutes} хв · +${xp} XP`,
    done: "Готово",
    startLesson: "Почати урок",
    reviewLesson: "Повторити урок",
    reward: {
      label: "Фініш",
      kicker: "Твоя нагорода",
      mapLabel: "Нагорода",
      title: "Отримай свою NFT-тваринку",
      summary: "Пройди маршрут — і маленький морський друг припливе у твій гаманець, щоб лишитися з тобою назавжди.",
      summaryAllDone: "Тобі вдалося! Маленький морський друг уже чекає, щоб приплисти у твій гаманець.",
      meta: "Безкоштовно · Solana devnet",
      cta: "До нагороди",
    },
  },

  lesson: {
    intro: {
      backToRoute: "Назад до маршруту",
      mode: "Devnet · Режим практики",
      start: "Поїхали",
      meta: (minutes: number, xp: number, steps: number) =>
        `~${minutes} хв · +${xp} XP · ${steps} ${plural(steps, "крок", "кроки", "кроків")}`,
    },
    header: {
      close: "Закрити урок і повернутися до маршруту",
      progressLabel: (title: string) => `Прогрес уроку «${title}»`,
      progressValue: (step: number, total: number) => `Крок ${step} з ${total}`,
    },
    player: {
      stepEyebrow: (label: string, step: number, total: number) => `${label} · Крок ${step} з ${total}`,
      quickCheckHeading: (title: string) => `Швидка перевірка · ${title}`,
      keepExploring: "Досліджуй далі",
      lastStep: "Це останній крок, молодець!",
      nextStep: (title: string) => `Далі: ${title}`,
      reread: "Перечитати",
      back: "Назад",
      practiceFirst: "Спершу практика",
      quickCheck: "Швидка перевірка",
      finishLesson: "Завершити урок",
      continue: "Далі",
      check: "Перевірити",
    },
    step: {
      example: "Приклад із життя",
      tryIt: "Спробуй на практиці",
      openSite: (host: string) => `Відкрити ${host}`,
      newTab: "(відкривається в новій вкладці)",
    },
    complete: {
      eyebrow: (label: string) => `${label} · пройдено`,
      heading: "Урок пройдено! 🎉",
      finished: {
        before: "Урок ",
        after: " — позаду. Ще одна зупинка твого маршруту пройдена!",
      },
      claim: (xp: number) => `✨ Забрати +${xp} XP ✨`,
      xpEarned: "Здобуто XP",
      dayStreak: "Днів поспіль",
      totalXp: "Усього XP",
      nextLesson: "Наступний урок",
      meetMascot: "До талісмана",
      backToRoute: "Назад до маршруту",
      upNext: (title: string) => `Далі: ${title}`,
    },
  },

  quiz: {
    kind: {
      single: "Обери одну відповідь",
      multiple: "Обери всі правильні",
      fill: "Впиши пропущене слово",
      truefalse: "Правда чи неправда?",
      match: "Торкнися слова, а потім його значення",
    },
    yourPickCorrect: "Твій вибір, правильно",
    correctAnswer: "Правильна відповідь",
    yourPick: "Твій вибір",
    true: "Правда",
    false: "Неправда",
    fillAria: "Твоя відповідь у пропуск",
    fillPlaceholder: "пиши тут",
    correctAnswerIs: (answer: string) => `Правильна відповідь: ${answer}`,
    match: {
      words: "Слова",
      meanings: "Значення",
      correctPairs: "Правильні пари",
      matchedOk: "Цю пару складено правильно.",
      matchedDiff: "Тут у тебе вийшла інша пара.",
      matchedWith: (item: string, other: string) => `${item}, у парі з: ${other}`,
      pickedWord: (word: string) => `Обрано «${word}». Тепер обери його значення.`,
      pickedMeaning: (meaning: string) => `Обрано «${meaning}». Тепер обери до нього слово.`,
      pairsMatched: (done: number, total: number) =>
        `Складено ${done} з ${total} ${plural(total, "пари", "пар", "пар")}.`,
    },
    feedback: {
      cheers: ["Чудово, саме так!", "Абсолютно правильно.", "Влучно!", "Точно в ціль.", "Клас!", "Так, молодець!"],
      wrong: "Не зовсім — і це нормально.",
      xp: (xp: number) => `+${xp} XP`,
      correctPairsShown: "Правильні пари показано вище.",
      rightAnswer: {
        before: "Правильна відповідь: ",
        after: "",
      },
      askWhy: "Є сумніви? Запитай ШІ-гіда, чому так",
    },
  },

  ai: {
    open: "Запитати ШІ",
    title: "Твій ШІ-гід",
    sailingWith: (step: string) => `Пливемо разом · ${step}`,
    close: "Закрити ШІ-гіда",
    thinking: "Гід думає",
    questionLabel: "Твоє запитання",
    placeholder: "Запитай про цей крок…",
    send: "Надіслати запитання",
    disclaimer: "Лише для навчання, не фінансова порада. Нікому не давай свою фразу відновлення.",
    noAnswer: "Хм, не вдалося знайти відповідь. Спробуєш запитати інакше?",
    offline: "Зараз не вдалося зв'язатися з гідом. Перевір з'єднання і спробуй ще раз?",
    greeting: {
      missed:
        "Агов! Це питання було з підступом. Пояснити, чому підходить саме правильна відповідь? Помилки — просто частина маршруту.",
      quiz: "Агов! Потрібна підказка? Я натякну, але не скажу відповідь, щоб перемога лишилася твоєю.",
      read: "Агов, мандрівнику! Щось незрозуміло чи просто цікаво про цей крок? Питай будь-що, своїми словами.",
    },
    suggestions: {
      whyWrong: "Чому моя відповідь неправильна?",
      anotherExample: "Дай ще один приклад",
      hint: "Можна підказку?",
      simpler: "Поясни простіше",
      realLife: "Дай приклад із життя",
    },
  },

  practice: {
    zoneLabel: "Зона практики",
    header: {
      titleShort: "Гаманець",
      title: "Твій навчальний гаманець",
      copy: "копіювати",
      copied: "скопійовано!",
      creating: "створюємо…",
      modeDevnet: "Devnet",
      modePractice: "Практика",
      tokenPractice: (symbol: string) => `${symbol} · практика`,
      seeOnExplorer: "Переглянути в Explorer",
    },
    opensInNewTab: "(відкривається в новій вкладці)",
    faucet: {
      title: "Спершу наповни гаманець із крана 🚰",
      body: "Твій гаманець порожній. Кран devnet наливає безкоштовні тестові SOL — жодних справжніх грошей.",
      button: "Отримати тестові SOL",
      busy: "Наливаємо тестові SOL…",
    },
    error: {
      altFaucetBefore: "Монети також можна отримати на",
      altFaucetAfter:
        "— встав свою адресу (натисни «копіювати» біля неї вище), обери Devnet і повертайся. Ми помітимо монети автоматично.",
      switchToPractice: "Або продовж у режимі практики (симуляція)",
    },
    noTransferYet: (amount: number) =>
      `Переказів ще немає. Надішли ${dec(amount)} тестових SOL — і ми покажемо тобі квитанцію.`,
    action: {
      swap: (symbol: string) => `Обміняти на ${symbol}`,
      stake: (amount: number) => `Застейкати ${dec(amount)} SOL`,
      send: (amount: number) => `Надіслати ${dec(amount)} SOL`,
      swapping: "Обмінюємо…",
      staking: "Стейкаємо…",
      sending: "Надсилаємо…",
    },
    success: {
      swap: "Автомат видав тобі токени!",
      stake: "Готово! Твоя квитанція mSOL уже в гаманці.",
      send: "Надіслано! Дійшло приблизно за секунду.",
    },
    verify: {
      promptSimulated: "Це справді сталося? Перевірмо!",
      promptSend: "Переказ надіслано? Зазирнімо у відкритий зошит!",
      button: "🔍 Перевірити в блокчейні",
    },
    sendForm: {
      to: "Кому (подрузі)",
      amount: "Сума",
      fee: "Комісія мережі",
    },
    swapForm: {
      youPay: "Віддаєш",
      youGet: "Отримуєш",
      tokenName: "Ocean Token",
      note: "Тренувальний обмін: це симуляція у твоєму навчальному гаманці, справжні токени не переміщуються.",
    },
    stakeForm: {
      youStake: "Стейкаєш",
      youGetReceipt: "Отримуєш квитанцію",
      keepsEarning: "і далі приносить винагороди",
      note: "Тренувальний стейкінг: це симуляція у твоєму навчальному гаманці, справжні монети не переміщуються.",
    },
    receipt: {
      title: "Квитанція транзакції",
      success: "Успішно",
      failed: "Помилка",
      what: "Що",
      signature: "Підпис",
      from: "Від (ти)",
      to: "Кому",
      amount: "Сума",
      fee: "Комісія мережі",
      time: "Час",
      network: "Мережа",
      networkDevnet: "Solana devnet",
      networkPractice: "Практика (симуляція)",
      viewOnExplorer: "Переглянути в Solana Explorer",
      realNote: "Це справжній відкритий запис. Зверни увагу: лише адреси, жодних імен.",
      practiceNote:
        "Це тренувальна квитанція (симуляція). У devnet ця сама кнопка відкриває справжній запис у Solana Explorer. Зверни увагу: лише адреси, жодних імен.",
    },
  },

  wallet: {
    errors: {
      unreachable: "Не вдалося зв'язатися з Solana devnet. Перевір з'єднання і спробуй ще раз.",
      unreachableNow: "Зараз не вдається зв'язатися з Solana devnet.",
      faucetBusy: "Безкоштовний кран devnet зараз зайнятий (він обмежує, як часто можна наливати).",
      faucetFailed: "Кран не відповів. Спробуй ще раз за хвилину.",
      sendFailed: "Переказ не вдався. Спробуй, будь ласка, ще раз.",
      mintFailed: "Не вдалося викарбувати NFT. Спробуй, будь ласка, ще раз.",
    },
    tx: {
      faucet: (amount: number) => `Отримано ${dec(amount)} SOL із крана devnet`,
      send: (amount: number) => `Надіслано ${dec(amount)} SOL подрузі`,
      swap: (pay: number, get: number, symbol: string) => `Обміняно ${dec(pay)} SOL на ${dec(get)} ${symbol}`,
      stake: (amount: number) => `Застейкано ${dec(amount)} SOL у Marinade (практика)`,
      mint: "Викарбувано NFT «Морська черепашка Пебл»",
    },
  },

  finale: {
    backToRoute: "Назад до маршруту",
    tag: "Devnet · Фінал",
    eyebrow: "Кінець маршруту",
    kicker: "Фінал",
    title: "Знайомся: твій талісман! 🐢",
    intro:
      "Поглянь, який шлях уже позаду! Гаманці, перекази, квитанції і навіть обмін на децентралізованій біржі — тепер усе це тобі під силу. На честь твого випуску унікальний океанський талісман чекає на місце у твоєму цифровому рюкзаку.",
    locked: {
      title: "Майже на місці!",
      body: (done: number, total: number) =>
        `Пройди всі ${total} ${plural(total, "урок", "уроки", "уроків")}, щоб відкрити свого талісмана. Пройдено ${done} з ${total}.`,
      continue: "Продовжити маршрут",
    },
    partners: "Надійні гавані",
    share: "Поділитися подорожжю",
    shareText:
      "Мої перші уроки про крипту на Crypto Voyage — позаду, а в нагороду я отримую навчальний значок із маленькою морською тваринкою!",
    shareCopied: "Посилання скопійовано. Встав його будь-де, щоб поділитися!",
    shareCopyManually: (url: string) => `Скопіюй це посилання, щоб поділитися: ${url}`,
    card: {
      badge: "Devnet · Навчальний значок",
      name: "Морська черепашка Пебл",
      subtitle: "Курс Crypto Voyage пройдено",
      claimed: "Отримано",
      notClaimed: "Ще не отримано",
    },
    mint: {
      whereLegend: "Де житиме твій талісман?",
      whereTitle: "Де житиме Пебл?",
      trainingLabel: "Мій навчальний гаманець",
      trainingHint: "Найпростіше: жодних застосунків не треба.",
      phantomLabel: "Мій власний гаманець Phantom",
      phantomHint: "Встав свою адресу Phantom (нею безпечно ділитися).",
      phantomAddress: "Твоя адреса Phantom",
      phantomPlaceholder: "напр. 7Xb…9Yz",
      phantomInvalid: "Це поки не схоже на адресу Solana.",
      switchToPractice: "Продовжити в режимі практики (симуляція)",
      button: "🎁 Викарбувати талісмана",
      busy: "Карбуємо в Solana…",
      note: "Справжнє NFT в єдиному екземплярі в Solana devnet. Безкоштовно: монети devnet нічого не варті.",
      minted: "Твого талісмана викарбувано! 🎉",
      mintedRealPhantom: (addr: string) =>
        `Пебл — справжнє NFT у Solana devnet, і живе воно у твоєму гаманці Phantom (${addr}). Такий існує лише один — і він твій.`,
      mintedRealTraining:
        "Пебл — справжнє NFT у Solana devnet, і живе воно у твоєму навчальному гаманці. Такий існує лише один — і він твій.",
      mintedPractice: "Пебл живе у твоєму тренувальному рюкзаку (симуляція). Спробуй ще раз у devnet будь-коли.",
      seeOnExplorer: "Переглянути в Solana Explorer",
      opensInNewTab: "(відкривається в новій вкладці)",
      findTitle: "Де знайти нового друга 📱",
      phantomSteps: [
        "Відкрий Phantom → Налаштування (Settings) → Налаштування розробника (Developer Settings) і ввімкни Режим тестової мережі (Testnet Mode, Solana Devnet).",
        "Торкнися вкладки «Колекційні» (Collectibles, значок із квадратиками ⊞).",
        "Пебл може з'явитися не одразу — гаманцю треба хвилинку, щоб оновитися.",
      ],
      trainingFind:
        "У застосунку-гаманці, як-от Phantom, NFT живуть на вкладці «Колекційні» (Collectibles, значок із квадратиками ⊞). Твій Пебл зараз тут, у навчальному гаманці, — а наступного разу надсилай його одразу у свій Phantom.",
    },
  },

  progress: {
    eyebrow: "Твій прогрес",
    title: "Поглянь, скільки вже пропливли",
    xp: {
      heading: "Досвід",
      unit: "XP",
      nothingYet: "Кожен крок і кожна перевірка додають трошки. Так тримати!",
      lessonsFinished: (done: number, total: number) =>
        `Пройдено ${done} з ${total} ${plural(total, "уроку", "уроків", "уроків")} — чудова робота.`,
    },
    streak: {
      daysInRow: (n: number) => `${n} ${plural(n, "день", "дні", "днів")} поспіль`,
      activeToday: "Сьогодні урок зараховано — до зустрічі завтра.",
      keepGoing: "Маленький урок сьогодні — і серія триватиме.",
      start: "Повчися трохи сьогодні, щоб почати нову серію.",
      weekLabel: "Останні 7 днів",
      today: "Сьогодні",
      dayLearned: (day: string) => `${day}: було навчання`,
      dayNoLesson: (day: string) => `${day}: без уроку`,
    },
    lessons: {
      heading: "Твої уроки",
      doneCount: (done: number, total: number) => `${done} / ${total} пройдено`,
      stateDone: "Пройдено",
      stateNotStarted: "Не почато",
      stateSteps: (n: number) => `${n} ${plural(n, "крок", "кроки", "кроків")}`,
      stateStepsDone: (done: number, total: number) => `${done}/${total}`,
      progressLabel: (title: string) => `Прогрес уроку «${title}»`,
    },
    nft: {
      eyebrow: "Твоя NFT-тваринка",
      claimedTitle: "Твоя тваринка вже в гаманці",
      claimedBody: "Вона твоя, у Solana devnet, — доказ твоїх нових знань.",
      lockedTitle: "Пройди уроки, щоб отримати тваринку",
      lockedBody: (done: number, total: number) =>
        `Маленький морський друг чекає в кінці маршруту. Пройдено ${done} з ${total} ${plural(total, "уроку", "уроків", "уроків")}.`,
      continue: "Продовжити подорож",
    },
    reset: {
      button: "Скинути прогрес",
      confirm: "Стерти всі XP, серію днів і пройдені уроки?",
      yes: "Так, почати знову",
      no: "Залишити прогрес",
    },
    empty: {
      title: "Твоя подорож починається тут",
      body: "Тут поки порожньо — і це чудово. Перший урок триває близько п'яти хвилин, а все, що ти дізнаєшся, з'явиться на цій сторінці.",
      cta: "Вирушити в подорож",
      earnXp: "Здобувай XP",
      buildStreak: "Тримай серію",
      getAnimal: "Отримай тваринку",
    },
    loading: "Завантажуємо твій прогрес…",
  },

  partners: {
    page: {
      kicker: "Ми радимо",
      title: "🧭 Надійні гавані",
      intro:
        "Ми зібрали найбезпечніші й найдружніші місця, які допоможуть тобі в майбутній подорожі. Торкнися будь-якого з наших надійних друзів, щоб дізнатися, чим вони можуть допомогти.",
      rewardEarned: "Нагороду отримано",
      opensInNewTab: " (відкривається в новій вкладці)",
      disclaimer: "Ми даємо навчальні мапи, а не фінансові поради. Крипта — це ризик, тож починай з малого.",
    },
    cards: {
      marinade: {
        tagline: "Твій цифровий депозит",
        line: "Простий і безпечний спосіб дати своїй крипті спокійно рости, поки ти спиш.",
        reward: "⭐️ NFT «Морська зірка» (практика) + бонус $10 від Marinade за реєстрацію",
        cta: "Почати квест зі стейкінгу",
        note: "Бонус $10 — власна пропозиція Marinade для справжніх реєстрацій. Актуальні умови перевір на їхньому сайті.",
      },
      superteam: {
        name: "Спільнота Solana (Superteam)",
        tagline: "Дружня світова родина, що стоїть за нашою мережею",
        line: "Разом крипта цікавіша! Відкривай безкоштовні події та знайомся з новими друзями, які теж навчаються.",
        reward: (xp: number) => `🌟 +${xp} XP`,
        cta: "До спільноти Solana",
      },
      phantom: {
        name: "Гаманець Phantom",
        tagline: "Твій справжній цифровий рюкзак на щодень",
        line: "Час випускатися з навчального гаманця? Встанови офіційний застосунок, щоб щодня безпечно носити з собою свої цифрові скарби.",
        reward: (xp: number) => `🛡️ Значок «Справжній власник» + ${xp} XP`,
        cta: "Створити гаманець Phantom",
      },
      bybit: {
        tagline: "Твій дружній обмінник",
        line: "Хочеш спробувати справжні монети? Обміняй звичайні гроші (банківською карткою) на крипту — і вирушай у подорож.",
        reward: (xp: number) => `🎟️ +${xp} XP`,
        cta: "Перейти на Bybit EU",
      },
    },
    guides: {
      kicker: "Головне для навігації",
      title: "🗺️ Перш ніж вирушити",
      network: {
        title: "🌊 Час у справжній океан?",
        subtitle: "Devnet чи Mainnet",
        body: (b: Bold) => [
          "На уроках ми плавали в тренувальному басейні під назвою ",
          b("Devnet"),
          ". Щоб користуватися справжніми застосунками, треба вийти у справжній океан — ",
          b("Mainnet"),
          ".",
        ],
        howTo: "Як перевірити мережу в Phantom:",
        steps: [
          (b: Bold) => ["Відкрий Phantom і торкнися значка ", b("Налаштування (Settings)"), " (⚙️)."],
          (b: Bold) => ["Прогорни вниз і торкнися ", b("Налаштування розробника (Developer Settings)"), "."],
          (b: Bold) => ["Знайди перемикач ", b("Режим тестової мережі (Testnet Mode)"), " і ", b("вимкни"), " його."],
        ],
        after:
          "Коли режим тестової мережі вимкнено, тренувальні монети більше не показуються. Тепер твій гаманець готовий до справжніх цифрових скарбів.",
      },
      safety: {
        title: "🛡️ Коротко про безпеку",
        tips: [
          {
            title: "Твоя мапа з 12 слів — лише для твоїх очей",
            text: "Жодна справжня компанія чи служба підтримки ніколи не попросить твою секретну фразу відновлення. Тримай її на папері, у надійному місці.",
          },
          {
            title: "Спершу перевір воду",
            text: "Пробуєш новий застосунок? Спершу надішли крихітну тестову транзакцію (на кшталт $1).",
          },
          {
            title: "Пливи лише з тим, що можеш собі дозволити",
            text: "Ми даємо навчальні мапи, а не фінансові поради. Починай з малого й досліджуй безпечно!",
          },
        ],
      },
    },
    quest: {
      back: "← Надійні гавані",
      kicker: "Інтерактивний квест · Практика",
      title: "💧 Стейкінг у Marinade",
      welcome: "Вітаємо у твоїй першій симуляції справжнього сервісу!",
      conceptTitle: "Ідея",
      concept: (b: Bold) => [
        "Уяви звичайний банківський депозит: ти кладеш туди гроші, а з часом отримуєш трохи більше. У крипті це називається ",
        b("стейкінг"),
        ". Marinade залучає твої монети до роботи мережі Solana, тож вони можуть потроху рости, поки ти спиш. (Як і з будь-якими інвестиціями, винагороди не гарантовані.)",
      ],
      step1: {
        title: "Внеси 1 тренувальний SOL",
        done: (b: Bold, wallet: string | null) => [
          `Готово! У твоєму навчальному гаманці${wallet ? ` (${wallet})` : ""} тепер є `,
          b("1 mSOL"),
          " — токен-квитанція Marinade за «застейканий SOL».",
        ],
        balance: (sol: string) =>
          `У твоєму навчальному гаманці ${sol} SOL. Потренуймося застейкати 1 SOL (це симуляція: монети насправді не переміщуються).`,
        staking: "Стейкаємо…",
        stake: "Застейкати 1 тренувальний SOL",
      },
      step2: {
        title: "Перевір у блокчейні",
        done: (b: Bold, label: string, fee: number, sig: ReactNode) => [
          "✓ Квитанцію знайдено: ",
          b(label),
          `, комісія ${dec(fee)} SOL, підпис `,
          sig,
          ". (Це тренувальна квитанція: справжні посилання на Solana Explorer з'являться з devnet-гаманцем.)",
        ],
        verify: "🔍 Перевірити в блокчейні",
      },
      step3: {
        title: "Забери нагороду",
        done: (xp: number) => `⭐️ Твоя морська зірка (тренувальне NFT) уже в рюкзаку, а ще +${xp} XP — твої!`,
        claim: "🎁 Забрати нагороду (NFT «Морська зірка»)",
      },
      realThing: (link: ReactNode) => [
        "Хочеш побачити, як це працює насправді? Зазирни на ",
        link,
        ". Бонус $10 за реєстрацію — їхня власна пропозиція, актуальні умови перевір на їхньому сайті. Це не фінансова порада.",
      ],
    },
  },
};
