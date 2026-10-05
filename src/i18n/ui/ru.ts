import type { ReactNode } from "react";
import type { DeepPartial } from "../types";
import type { Dict } from "./en";
import { ruExtra } from "./extra/ru";
import { ruVoyage } from "./extra/ru-voyage";
import { ruMore } from "./extra/ru-more";

// Russian translation of src/i18n/ui/en.ts. Anything missing falls back to English.
// Informal «ты», gender-neutral phrasing where possible (avoid gendered past tense for the learner).

/** Russian plural: 1 урок / 2 урока / 5 уроков (11–14 → «уроков»). */
const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};
const pad = (n: number) => String(n).padStart(2, "0");
type Bold = (text: string) => ReactNode;

export const ru: DeepPartial<Dict> = {
  ...ruExtra,
  ...ruVoyage,
  ...ruMore,
  common: {
    language: "Язык",
    appName: "Crypto Voyage",
    lessonLabel: (num: string) => `Урок ${num}`,
  },

  shell: {
    homeAria: "Crypto Voyage — на главную",
    mainNav: "Главное меню",
    nav: {
      journey: "Путь",
      lessons: "Уроки",
      progress: "Прогресс",
      partners: "Партнёры",
    },
    lessonsButton: "Уроки",
    drawer: {
      eyebrow: "Твоё путешествие",
      title: "Уроки",
      closeAria: "Закрыть список уроков",
      finished: (done: number, total: number) => `Пройдено ${done} из ${total}`,
      listAria: "Уроки",
      done: "Готово",
      minutes: (min: number) => `${min} мин`,
      finishedSr: "(пройден)",
      progress: "Прогресс",
      partners: "Партнёры",
      backToRoute: "Назад к маршруту",
    },
    stats: {
      streakTitle: "Дней подряд",
      // en.ts infers a literal return type here, so widen it with a cast.
      streakSr: (days: number) => ` ${plural(days, "день", "дня", "дней")} подряд`,
      xpTitle: "Очки опыта",
      xpUnit: "XP",
    },
  },

  home: {
    tagTitle: "Остановка 01 · Solana",
    tagLine: "Быстро, дёшево, открыто для всех",
    eyebrow: "Добро пожаловать на борт 👋",
    titleLead: "Твоя первая остановка:",
    lede: "Открой для себя крипту и блокчейн с нуля — в коротких интерактивных уроках для новичков.",
    cta: "Отправиться в путь",
    note: (lessons: number, minutes: number) =>
      `Опыт в крипте не нужен · ${lessons} ${plural(lessons, "короткий урок", "коротких урока", "коротких уроков")} · около ${minutes} мин`,
    routeLabel: "На твоём маршруте",
    route: ["Что такое крипта", "Solana", "Кошельки", "Отправка SOL", "Обмен", "Стейкинг", "NFT", "Мемкоины", "Безопасность", "Твой сейф"],
  },

  journey: {
    srTitle: "Твой маршрут: выбери урок",
    backToStart: "На главную",
    stopCounter: (current: number, total: number) => `Остановка ${pad(current)} / ${pad(total)}`,
    hint: "Кликай слева или справа от кораблика, листай или жми ← →",
    prevAria: "Плыть к предыдущей остановке",
    nextAria: "Плыть к следующей остановке",
    stopAria: (name: string, title: string, finished: boolean) =>
      `${name}: ${title}${finished ? " (пройден)" : ""}`,
    lessonMeta: (minutes: number, xp: number) => `~${minutes} мин · +${xp} XP`,
    done: "Готово",
    startLesson: "Начать урок",
    reviewLesson: "Повторить урок",
    reward: {
      label: "Финиш",
      kicker: "Твоя награда",
      mapLabel: "Награда",
      title: "Получи своего NFT-зверька",
      summary: "Пройди маршрут, и в твой кошелёк приплывёт маленький морской друг — навсегда твой.",
      summaryAllDone: "Маршрут пройден! Маленький морской друг уже ждёт, чтобы приплыть в твой кошелёк.",
      meta: "Бесплатно · Solana devnet",
      cta: "Посмотреть награду",
    },
  },

  lesson: {
    intro: {
      backToRoute: "Назад к маршруту",
      prevAria: "Предыдущий урок",
      nextAria: "Следующий урок",
      switchAria: "Переключить урок",
      mode: "Devnet · Тренировка",
      start: "Поехали",
      meta: (minutes: number, xp: number, steps: number) =>
        `~${minutes} мин · +${xp} XP · ${steps} ${plural(steps, "шаг", "шага", "шагов")}`,
    },
    header: {
      close: "Закрыть урок и вернуться к маршруту",
      progressLabel: (title: string) => `Прогресс: ${title}`,
      progressValue: (step: number, total: number) => `Шаг ${step} из ${total}`,
    },
    player: {
      stepEyebrow: (label: string, step: number, total: number) => `${label} · Шаг ${step} из ${total}`,
      quickCheckHeading: (title: string) => `Быстрая проверка · ${title}`,
      keepExploring: "Исследуем дальше",
      lastStep: "Это последний шаг, отличная работа!",
      nextStep: (title: string) => `Дальше: ${title}`,
      reread: "Перечитать",
      back: "Назад",
      practiceFirst: "Сначала практика",
      quickCheck: "Проверка",
      finishLesson: "Завершить урок",
      continue: "Дальше",
      check: "Проверить",
    },
    step: {
      example: "Пример из жизни",
      tryIt: "Попробуй на практике",
      openSite: (host: string) => `Открыть ${host}`,
      newTab: "(откроется в новой вкладке)",
    },
    complete: {
      eyebrow: (label: string) => `${label} · пройден`,
      heading: "Урок пройден! 🎉",
      finished: {
        before: "Урок «",
        after: "» пройден. Ещё одна остановка на твоём маршруте позади!",
      },
      claim: (xp: number) => `✨ Забрать +${xp} XP ✨`,
      xpEarned: "Получено XP",
      dayStreak: "Дней подряд",
      totalXp: "Всего XP",
      nextLesson: "Следующий урок",
      meetMascot: "К талисману",
      backToRoute: "Назад к маршруту",
      upNext: (title: string) => `Дальше: ${title}`,
    },
  },

  quiz: {
    kind: {
      single: "Выбери один ответ",
      multiple: "Выбери все подходящие",
      fill: "Впиши пропущенное слово",
      truefalse: "Верно или неверно?",
      match: "Нажми на слово, потом на его значение",
    },
    yourPickCorrect: "Твой выбор, верно",
    correctAnswer: "Правильный ответ",
    yourPick: "Твой выбор",
    true: "Верно",
    false: "Неверно",
    fillAria: "Твой ответ для пропуска",
    fillPlaceholder: "пиши тут",
    correctAnswerIs: (answer: string) => `Правильный ответ: ${answer}`,
    match: {
      words: "Слова",
      meanings: "Значения",
      correctPairs: "Правильные пары",
      matchedOk: "Эта пара составлена верно.",
      matchedDiff: "Эта пара у тебя составлена иначе.",
      matchedWith: (item: string, other: string) => `${item}, в паре с: ${other}`,
      pickedWord: (word: string) => `Выбрано: ${word}. Теперь выбери его значение.`,
      pickedMeaning: (meaning: string) => `Выбрано: ${meaning}. Теперь выбери подходящее слово.`,
      pairsMatched: (done: number, total: number) =>
        `Составлено пар: ${done} из ${total}.`,
    },
    feedback: {
      cheers: ["Чудесно, так и есть!", "Абсолютно верно.", "В точку!", "Именно так.", "Здорово!", "Да, отлично!"],
      wrong: "Не совсем, и это нормально.",
      xp: (xp: number) => `+${xp} XP`,
      correctPairsShown: "Правильные пары показаны выше.",
      rightAnswer: {
        before: "Правильный ответ: ",
        after: "",
      },
      askWhy: "Остались вопросы? Спроси у ИИ-гида почему",
    },
  },

  ai: {
    open: "Спросить ИИ",
    title: "Твой ИИ-гид",
    sailingWith: (step: string) => `Плывём вместе · ${step}`,
    close: "Закрыть ИИ-гида",
    thinking: "Гид думает",
    questionLabel: "Твой вопрос",
    placeholder: "Спроси об этом шаге…",
    send: "Отправить вопрос",
    disclaimer: "Только для обучения, не финансовый совет. Никому не сообщай фразу восстановления.",
    noAnswer: "Хм, не получилось придумать ответ. Попробуешь спросить по-другому?",
    offline: "Сейчас не удаётся связаться с гидом. Проверь подключение и попробуй ещё раз?",
    greeting: {
      missed:
        "Привет! Это был непростой вопрос. Объяснить, почему подходит правильный ответ? Ошибки — просто часть маршрута.",
      quiz: "Привет! Нужна подсказка? Я подскажу, но не выдам ответ, чтобы победа осталась за тобой.",
      read: "Привет, капитан! Что-то непонятно или просто любопытно? Спрашивай что угодно, своими словами.",
    },
    suggestions: {
      whyWrong: "Почему мой ответ неверный?",
      anotherExample: "Приведи другой пример",
      hint: "Можно подсказку?",
      simpler: "Объясни попроще",
      realLife: "Приведи пример из жизни",
    },
  },

  practice: {
    zoneLabel: "Зона практики",
    header: {
      titleShort: "Тренировочный",
      title: "Твой тренировочный кошелёк",
      copy: "копировать",
      copied: "скопировано!",
      creating: "создаём…",
      modeDevnet: "Devnet",
      modePractice: "Тренировка",
      tokenPractice: (symbol: string) => `${symbol} · тренировка`,
      seeOnExplorer: "Смотреть в Explorer",
    },
    opensInNewTab: "(откроется в новой вкладке)",
    faucet: {
      title: "Сначала наполни кошелёк из крана 🚰",
      body: "Твой кошелёк пуст. Кран devnet наливает бесплатные тестовые SOL — никаких настоящих денег, никогда.",
      button: "Получить тестовые SOL",
      busy: "Наливаем тестовые SOL…",
    },
    error: {
      altFaucetBefore: "Монеты можно получить и на",
      altFaucetAfter:
        "— вставь свой адрес (нажми «копировать» рядом с ним выше), выбери Devnet и возвращайся. Мы сами заметим монеты.",
      switchToPractice: "Или продолжи в режиме тренировки (симуляция)",
    },
    noTransferYet: (amount: number) =>
      `Переводов пока нет. Отправь ${amount} тестового SOL, и мы покажем его квитанцию.`,
    action: {
      swap: (symbol: string) => `Обменять на ${symbol}`,
      stake: (amount: number) => `Застейкать ${amount} SOL`,
      send: (amount: number) => `Отправить ${amount} SOL`,
      swapping: "Обмениваем…",
      staking: "Стейкаем…",
      sending: "Отправляем…",
    },
    success: {
      swap: "Автомат выдал тебе токены!",
      stake: "Готово! Квитанция mSOL уже в твоём кошельке.",
      send: "Отправлено! Дошло примерно за секунду.",
    },
    verify: {
      promptSimulated: "Это правда произошло? Давай проверим!",
      promptSend: "Перевод ушёл? Давай заглянем в общую тетрадь!",
      button: "🔍 Проверить в блокчейне",
    },
    sendForm: {
      to: "Кому (подруге)",
      amount: "Сумма",
      fee: "Комиссия сети",
    },
    swapForm: {
      youPay: "Ты отдаёшь",
      youGet: "Ты получаешь",
      tokenName: "Ocean Token",
      note: "Тренировочный обмен: симуляция в тренировочном кошельке, настоящие токены не перемещаются.",
    },
    stakeForm: {
      youStake: "Ты стейкаешь",
      youGetReceipt: "Ты получаешь квитанцию",
      keepsEarning: "и награды продолжают капать",
      note: "Тренировочный стейкинг: симуляция в тренировочном кошельке, настоящие монеты не перемещаются.",
    },
    receipt: {
      title: "Квитанция транзакции",
      success: "Успешно",
      failed: "Ошибка",
      what: "Что",
      signature: "Подпись",
      from: "От кого (ты)",
      to: "Кому",
      amount: "Сумма",
      fee: "Комиссия сети",
      time: "Время",
      network: "Сеть",
      networkDevnet: "Solana devnet",
      networkPractice: "Тренировка (симуляция)",
      viewOnExplorer: "Открыть в Solana Explorer",
      realNote: "Это настоящая публичная запись. Обрати внимание: только адреса, никогда не твоё имя.",
      practiceNote:
        "Это тренировочная квитанция (симуляция). В devnet та же кнопка открывает настоящую запись в Solana Explorer. Обрати внимание: только адреса, никогда не твоё имя.",
    },
  },

  wallet: {
    errors: {
      unreachable: "Не удалось связаться с Solana devnet. Проверь подключение и попробуй ещё раз.",
      unreachableNow: "Сейчас не удаётся связаться с Solana devnet.",
      faucetBusy: "Бесплатный кран devnet сейчас занят (он ограничивает, как часто можно наливать).",
      faucetFailed: "Кран не ответил. Попробуй ещё раз через минуту.",
      sendFailed: "Перевод не прошёл. Попробуй, пожалуйста, ещё раз.",
      mintFailed: "Минт не прошёл. Попробуй, пожалуйста, ещё раз.",
    },
    tx: {
      faucet: (amount: number) => `Получено ${amount} SOL из крана devnet`,
      send: (amount: number) => `Отправлено ${amount} SOL подруге`,
      swap: (pay: number, get: number, symbol: string) => `Обмен ${pay} SOL на ${get} ${symbol}`,
      stake: (amount: number) => `Стейкинг ${amount} SOL в Marinade (тренировка)`,
      mint: "Создан NFT «Морская черепашка Пебл»",
    },
  },

  finale: {
    backToRoute: "Назад к маршруту",
    tag: "Devnet · Финал",
    eyebrow: "Конец маршрута",
    kicker: "Финал",
    title: "Знакомься с талисманом! 🐢",
    intro:
      "Посмотри, какой путь позади! Кошельки, переводы крипты, квитанции и даже децентрализованный обмен — всё это теперь тебе знакомо. В честь выпуска для твоего цифрового рюкзака приготовлен уникальный морской талисман.",
    locked: {
      title: "Почти у цели!",
      body: (done: number, total: number) =>
        `Пройди все ${total} ${plural(total, "урок", "урока", "уроков")}, чтобы открыть талисмана. Пройдено ${done} из ${total}.`,
      continue: "Продолжить маршрут",
    },
    partners: "Надёжные гавани",
    share: "Поделиться",
    shareText:
      "Мои первые уроки по крипте на Crypto Voyage пройдены, а в награду — маленький учебный значок с морским зверьком!",
    shareCopied: "Ссылка скопирована. Вставь её куда угодно, чтобы поделиться!",
    shareCopyManually: (url: string) => `Скопируй эту ссылку, чтобы поделиться: ${url}`,
    card: {
      badge: "Devnet · Учебный значок",
      name: "Морская черепашка Пебл",
      subtitle: "Курс Crypto Voyage пройден",
      claimed: "Получен",
      notClaimed: "Ещё не получен",
    },
    mint: {
      whereLegend: "Где будет жить твой талисман?",
      whereTitle: "Где будет жить Пебл?",
      trainingLabel: "В тренировочном кошельке",
      trainingHint: "Проще всего: приложение не нужно.",
      phantomLabel: "В моём кошельке Phantom",
      phantomHint: "Подключи свой Phantom или вставь его адрес (им можно спокойно делиться).",
      phantomAddress: "Твой адрес Phantom",
      phantomPlaceholder: "напр. 7Xb…9Yz",
      phantomInvalid: "Пока не похоже на адрес Solana.",
      connect: "👻 Подключить Phantom",
      connecting: "Ждём Phantom…",
      connected: (addr: string) => `Подключено: ${addr}`,
      useAnother: "Другой адрес",
      notInstalled: "В этом браузере нет Phantom.",
      install: "Установить Phantom",
      openInApp: "Открыть эту страницу в приложении Phantom",
      rejected: "Подключение отменено в Phantom. Попробуй ещё раз или вставь адрес ниже.",
      orPaste: "…или вставь адрес вручную",
      connectSafe: "При подключении мы видим только твой публичный адрес. Мы никогда не просим ничего подписать и никогда не спрашиваем твои 12 слов.",
      switchToPractice: "Продолжить в режиме тренировки (симуляция)",
      button: "🎁 Создать талисмана",
      busy: "Создаём в Solana…",
      note: "Настоящий NFT в единственном экземпляре в Solana devnet. Бесплатно: монеты devnet ничего не стоят.",
      minted: "Твой талисман создан! 🎉",
      mintedRealPhantom: (addr: string) =>
        `Пебл — настоящий NFT в Solana devnet, и живёт он в твоём кошельке Phantom (${addr}). Он существует в единственном экземпляре — и он твой.`,
      mintedRealTraining:
        "Пебл — настоящий NFT в Solana devnet, и живёт он в твоём тренировочном кошельке. Он существует в единственном экземпляре — и он твой.",
      mintedPractice: "Пебл живёт в твоём тренировочном рюкзаке (симуляция). Попробуй в devnet в любой момент.",
      seeOnExplorer: "Смотреть в Solana Explorer",
      opensInNewTab: "(откроется в новой вкладке)",
      findTitle: "Где найти нового друга 📱",
      phantomSteps: [
        "Открой Phantom → Настройки → Настройки разработчика и включи режим тестовой сети (Testnet Mode, Solana Devnet).",
        "Нажми на вкладку коллекционных предметов (Collectibles, иконка с квадратиками ⊞).",
        "Пебл может появиться не сразу — подожди минутку, пока кошелёк обновится.",
      ],
      trainingFind:
        "В приложении-кошельке вроде Phantom NFT хранятся во вкладке коллекционных предметов (Collectibles, иконка с квадратиками ⊞). Твой Пебл живёт здесь, в тренировочном кошельке, — а в следующий раз отправь его прямо в свой Phantom.",
    },
  },

  progress: {
    eyebrow: "Твой прогресс",
    title: "Посмотри, какой путь уже позади",
    xp: {
      heading: "Опыт",
      unit: "XP",
      nothingYet: "Каждый шаг и каждая проверка добавляют ещё немного. Так держать!",
      lessonsFinished: (done: number, total: number) => `Пройдено ${done} из ${total} — чудесная работа.`,
    },
    streak: {
      daysInRow: (n: number) => `${n} ${plural(n, "день", "дня", "дней")} подряд`,
      activeToday: "Сегодня занятие уже было — до завтра!",
      keepGoing: "Маленький урок сегодня — и серия продолжается.",
      start: "Позанимайся сегодня немного, чтобы начать новую серию.",
      weekLabel: "Последние 7 дней",
      today: "Сегодня",
      dayLearned: (day: string) => `${day}: было занятие`,
      dayNoLesson: (day: string) => `${day}: без урока`,
    },
    lessons: {
      heading: "Твои уроки",
      doneCount: (done: number, total: number) => `Пройдено ${done} / ${total}`,
      stateDone: "Готово",
      stateNotStarted: "Не начат",
      stateSteps: (n: number) => `${n} ${plural(n, "шаг", "шага", "шагов")}`,
      stateStepsDone: (done: number, total: number) => `${done}/${total}`,
      progressLabel: (title: string) => `Прогресс: ${title}`,
    },
    nft: {
      eyebrow: "Твой NFT-зверёк",
      claimedTitle: "Твой зверёк уже в кошельке",
      claimedBody: "Он твой, в Solana devnet — доказательство того, что ты узнаёшь новое.",
      lockedTitle: "Пройди уроки, чтобы получить зверька",
      lockedBody: (done: number, total: number) =>
        `В конце маршрута ждёт маленький морской друг. Пройдено уроков: ${done} из ${total}.`,
      continue: "Продолжить путешествие",
    },
    reset: {
      button: "Сбросить прогресс",
      confirm: "Стереть весь XP, серию и уроки?",
      yes: "Да, начать заново",
      no: "Оставить прогресс",
    },
    empty: {
      title: "Твоё путешествие начинается здесь",
      body: "Здесь пока пусто — и это прекрасно. Первый урок займёт около пяти минут, а всё, что ты узнаешь, появится на этой странице.",
      cta: "Отправиться в путь",
      earnXp: "Получай XP",
      buildStreak: "Набирай серию",
      getAnimal: "Получи зверька",
    },
    loading: "Загружаем твой прогресс…",
  },

  partners: {
    page: {
      kicker: "Мы рекомендуем",
      title: "🧭 Надёжные гавани",
      intro:
        "Мы выбрали самые надёжные и дружелюбные места, которые помогут тебе в будущем путешествии. Нажми на любого из наших проверенных друзей, чтобы узнать, чем он может помочь.",
      rewardEarned: "Награда получена",
      opensInNewTab: " (откроется в новой вкладке)",
      disclaimer: "Мы даём учебные карты, а не финансовые советы. Крипта — это риск, начинай с малого.",
    },
    cards: {
      marinade: {
        tagline: "Твой цифровой сберегательный счёт",
        line: "Простой и надёжный способ дать своей крипте спокойно расти, пока ты спишь.",
        reward: "⭐️ NFT-морская звезда (тренировка) + бонус $10 от Marinade за регистрацию",
        cta: "Начать квест по стейкингу",
        note: "Бонус $10 — собственное предложение Marinade для настоящих регистраций. Актуальные условия смотри на их сайте.",
      },
      trezor: {
        tagline: "Сейф для твоих сбережений",
        line: "У тебя больше, чем карманные деньги? Аппаратный кошелёк хранит ключи офлайн, и ничего не уйдёт без нажатия кнопки на устройстве.",
        reward: (xp: number) => `🔐 +${xp} XP`,
        cta: "Узнать о Trezor",
      },
      superteam: {
        name: "Сообщество Solana (Superteam)",
        tagline: "Дружная международная семья, которая стоит за нашей сетью",
        line: "Вместе в крипте веселее! Находи бесплатные мероприятия и знакомься с теми, кто тоже учится.",
        reward: (xp: number) => `🌟 +${xp} XP`,
        cta: "Познакомиться с сообществом",
      },
      phantom: {
        name: "Кошелёк Phantom",
        tagline: "Твой настоящий цифровой рюкзак на каждый день",
        line: "Пора выпускаться из тренировочного кошелька? Установи официальное приложение, чтобы каждый день надёжно носить с собой свои цифровые сокровища.",
        reward: (xp: number) => `🛡️ Значок «Настоящий владелец» + ${xp} XP`,
        cta: "Настроить кошелёк Phantom",
      },
      bybit: {
        tagline: "Твой дружелюбный обменник",
        line: "Хочешь попробовать настоящие монеты? Обменяй обычные деньги (банковской картой) на крипту и начни своё путешествие.",
        reward: (xp: number) => `🎟️ +${xp} XP`,
        cta: "Перейти на Bybit EU",
      },
    },
    guides: {
      kicker: "Главные навигационные гайды",
      title: "🗺️ Перед тем как отплыть",
      network: {
        title: "🌊 Пора в настоящий океан?",
        subtitle: "Devnet и Mainnet",
        body: (b: Bold) => [
          "На наших уроках мы плескались в тренировочном бассейне под названием ",
          b("Devnet"),
          ". Чтобы пользоваться настоящими приложениями, нужно выйти в настоящий океан — ",
          b("Mainnet"),
          ".",
        ],
        howTo: "Как проверить сеть в Phantom:",
        steps: [
          (b: Bold) => ["Открой Phantom и нажми на значок ", b("Настройки"), " (⚙️)."],
          (b: Bold) => ["Пролистай вниз и нажми ", b("Настройки разработчика"), " (Developer Settings)."],
          (b: Bold) => [
            "Найди переключатель ",
            b("Режим тестовой сети"),
            " (Testnet Mode) и ",
            b("выключи"),
            " его.",
          ],
        ],
        after:
          "Когда режим тестовой сети выключен, тренировочные монеты больше не отображаются. Теперь твой кошелёк готов к настоящим цифровым сокровищам.",
      },
      safety: {
        title: "🛡️ Пара слов о безопасности",
        tips: [
          {
            title: "Твоя карта из 12 слов — только для твоих глаз",
            text: "Ни одна настоящая компания и ни одна служба поддержки никогда не попросит твою секретную фразу восстановления. Храни её на бумаге в надёжном месте.",
          },
          {
            title: "Сначала проверь воду",
            text: "Пробуешь новое приложение? Сначала отправь крошечную тестовую транзакцию (например, на $1).",
          },
          {
            title: "Плыви только с тем, что не жалко",
            text: "Мы даём учебные карты, а не финансовые советы. Начинай с малого и исследуй безопасно!",
          },
        ],
      },
    },
    quest: {
      back: "← Надёжные гавани",
      kicker: "Интерактивный квест · Тренировка",
      title: "💧 Стейкинг в Marinade",
      welcome: "Добро пожаловать в твою первую симуляцию настоящего мира!",
      conceptTitle: "Идея",
      concept: (b: Bold) => [
        "Представь обычный сберегательный счёт: ты кладёшь туда деньги, и со временем они приносят немного сверху. В крипте это называется ",
        b("стейкинг"),
        ". Marinade отправляет твои монеты помогать работе сети Solana, чтобы они понемногу росли, пока ты спишь. (Как и при любых вложениях, награды не гарантированы.)",
      ],
      step1: {
        title: "Внеси 1 тренировочный SOL",
        done: (b: Bold, wallet: string | null) => [
          "Готово! В твоём тренировочном кошельке",
          wallet ? ` (${wallet})` : "",
          " теперь ",
          b("1 mSOL"),
          " — токен-квитанция Marinade «SOL в стейкинге».",
        ],
        balance: (sol: string) =>
          `В твоём тренировочном кошельке ${sol} SOL. Давай потренируемся и застейкаем 1 из них (это симуляция: монеты на самом деле не перемещаются).`,
        staking: "Стейкаем…",
        stake: "Застейкать 1 тренировочный SOL",
      },
      step2: {
        title: "Проверь в блокчейне",
        done: (b: Bold, label: string, fee: number, sig: ReactNode) => [
          "✓ Квитанция найдена: ",
          b(label),
          `, комиссия ${fee} SOL, подпись `,
          sig,
          ". (Тренировочная квитанция: настоящие ссылки на Solana Explorer появятся с кошельком devnet.)",
        ],
        verify: "🔍 Проверить в блокчейне",
      },
      step3: {
        title: "Забери награду",
        done: (xp: number) => `⭐️ Твоя морская звезда (тренировочный NFT) уже в рюкзаке, и +${xp} XP — твои!`,
        claim: "🎁 Забрать награду (NFT-звезда)",
      },
      realThing: (link: ReactNode) => [
        "Хочешь увидеть, как это выглядит по-настоящему? Загляни на ",
        link,
        ". Бонус $10 за регистрацию — их собственное предложение, актуальные условия смотри на их сайте. Не финансовый совет.",
      ],
    },
  },
};
