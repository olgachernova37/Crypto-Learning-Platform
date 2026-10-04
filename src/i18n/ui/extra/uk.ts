// Ukrainian: account + admin namespaces (kept separate from uk.ts for easier review).
const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

export const ukExtra = {
  account: {
    dialog: {
      title: "Як до тебе звертатися?",
      sub: "Достатньо імені або нікнейму. Більше нічого не треба, щоб вирушити в подорож.",
      label: "Твоє ім'я",
      placeholder: "наприклад, Оля",
      submit: "Вирушаймо",
      privacy: "Ми зберігаємо лише ім'я. Без пошти й без пароля.",
      close: "Закрити",
    },
    hello: (name: string) => `Агов, ${name}! 👋`,
    progressOf: (name: string) => `Подорож: ${name}`,
    earnedBy: (name: string) => `Отримує: ${name}`,
    changeName: "Змінити ім'я",
  },
  admin: {
    title: "Капітанський місток",
    sub: "Інструменти адміна для демо. Відкрити можна лише з паролем.",
    passwordLabel: "Пароль адміна",
    login: "Увійти",
    errors: {
      wrong: "Пароль не підійшов.",
      tooMany: "Забагато спроб. Зачекай кілька хвилин і спробуй ще.",
      notConfigured: "Адмінку ще не налаштовано: додай ADMIN_PASSWORD у Vercel → Settings → Environment Variables і переопублікуй сайт.",
      network: "Не вдалося зв'язатися із сервером. Перевір інтернет.",
    },
    demoOn: "Демо-режим увімкнено в цьому браузері",
    demoHint: "У кожному уроці з'явиться кнопка «⏭ Демо: далі». Вона правильно відповідає на поточне питання й іде далі, тож увесь маршрут можна показати за кілька хвилин.",
    completeAll: "Позначити всі уроки пройденими",
    completeAllDone: "Готово! Усі уроки позначено пройденими.",
    reset: "Скинути мій прогрес",
    resetDone: "Прогрес скинуто. Починаємо з нуля!",
    openRoute: "Відкрити маршрут",
    openFinale: "Відкрити фінал",
    logout: "Вийти",
    learners: {
      title: "Зареєстровані мандрівники",
      count: (n: number) => `${n} ${plural(n, "мандрівник", "мандрівники", "мандрівників")}`,
      none: "Поки що ніхто не зареєструвався.",
      noStorage: "Зараз імена зберігаються лише на пристрої кожного учня. Щоб бачити їх тут, підключи Upstash Redis у Vercel (Storage → Marketplace) і переопублікуй сайт.",
      unreachable: "Не вдалося завантажити список.",
      name: "Ім'я",
      language: "Мова",
      joined: "Дата реєстрації",
      refresh: "Оновити",
    },
    demoNext: "Демо: далі",
    demoAria: "Демо-режим: відповісти правильно й піти далі",
  },
};
