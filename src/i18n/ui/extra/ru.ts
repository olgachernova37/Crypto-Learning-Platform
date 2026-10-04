// Russian: account + admin namespaces.
const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

export const ruExtra = {
  account: {
    dialog: {
      title: "Как к тебе обращаться?",
      sub: "Достаточно имени или никнейма. Больше ничего не нужно, чтобы отправиться в путь.",
      label: "Твоё имя",
      placeholder: "например, Оля",
      submit: "В путь",
      privacy: "Мы храним только имя. Без почты и без пароля.",
      close: "Закрыть",
    },
    hello: (name: string) => `Привет, ${name}! 👋`,
    progressOf: (name: string) => `Путешествие: ${name}`,
    earnedBy: (name: string) => `Получает: ${name}`,
    changeName: "Изменить имя",
  },
  admin: {
    title: "Капитанский мостик",
    sub: "Инструменты админа для демо. Открыть можно только с паролем.",
    passwordLabel: "Пароль админа",
    login: "Войти",
    errors: {
      wrong: "Пароль не подошёл.",
      tooMany: "Слишком много попыток. Подожди несколько минут и попробуй снова.",
      notConfigured: "Админка ещё не настроена: добавь ADMIN_PASSWORD в Vercel → Settings → Environment Variables и переопубликуй сайт.",
      network: "Не удалось связаться с сервером. Проверь интернет.",
    },
    demoOn: "Демо-режим включён в этом браузере",
    demoHint: "В каждом уроке появится кнопка «⏭ Демо: дальше». Она правильно отвечает на текущий вопрос и идёт дальше, так что весь маршрут можно показать за несколько минут.",
    completeAll: "Отметить все уроки пройденными",
    completeAllDone: "Готово! Все уроки отмечены пройденными.",
    reset: "Сбросить мой прогресс",
    resetDone: "Прогресс сброшен. Начинаем с нуля!",
    openRoute: "Открыть маршрут",
    openFinale: "Открыть финал",
    logout: "Выйти",
    learners: {
      title: "Зарегистрированные путешественники",
      count: (n: number) => `${n} ${plural(n, "путешественник", "путешественника", "путешественников")}`,
      none: "Пока никто не зарегистрировался.",
      noStorage: "Сейчас имена хранятся только на устройстве каждого ученика. Чтобы видеть их здесь, подключи Upstash Redis в Vercel (Storage → Marketplace) и переопубликуй сайт.",
      unreachable: "Не удалось загрузить список.",
      name: "Имя",
      language: "Язык",
      joined: "Дата регистрации",
      refresh: "Обновить",
    },
    demoNext: "Демо: дальше",
    demoAria: "Демо-режим: ответить правильно и идти дальше",
  },
};
