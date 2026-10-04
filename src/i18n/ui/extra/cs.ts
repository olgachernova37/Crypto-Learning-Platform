// Czech: account + admin namespaces.
const pl = (n: number, one: string, few: string, many: string) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);

export const csExtra = {
  account: {
    dialog: {
      title: "Jak ti máme říkat?",
      sub: "Stačí křestní jméno nebo přezdívka. Nic víc k vyplutí nepotřebujeme.",
      label: "Tvoje jméno",
      placeholder: "např. Olga",
      submit: "Vyplout",
      privacy: "Ukládáme jen jméno. Žádný e-mail, žádné heslo.",
      close: "Zavřít",
    },
    hello: (name: string) => `Ahoj, ${name}! 👋`,
    progressOf: (name: string) => `Plavba: ${name}`,
    earnedBy: (name: string) => `Získává: ${name}`,
    changeName: "Změnit jméno",
  },
  admin: {
    title: "Kapitánský můstek",
    sub: "Nástroje pro dema. Otevřít je může jen ten, kdo zná heslo.",
    passwordLabel: "Heslo správce",
    login: "Přihlásit",
    errors: {
      wrong: "Heslo nesedí.",
      tooMany: "Příliš mnoho pokusů. Počkej pár minut a zkus to znovu.",
      notConfigured: "Správa ještě není nastavená: přidej ADMIN_PASSWORD ve Vercelu → Settings → Environment Variables a nasaď web znovu.",
      network: "Nepodařilo se spojit se serverem. Zkontroluj připojení.",
    },
    demoOn: "Demo režim je v tomto prohlížeči zapnutý",
    demoHint: "V každé lekci uvidíš tlačítko „⏭ Demo: dál“. Správně odpoví na aktuální otázku a pokračuje, takže celou trasu ukážeš za pár minut.",
    completeAll: "Označit všechny lekce jako hotové",
    completeAllDone: "Hotovo! Všechny lekce jsou označené jako dokončené.",
    reset: "Vynulovat můj pokrok",
    resetDone: "Pokrok vynulován. Začínáme znovu!",
    openRoute: "Otevřít trasu",
    openFinale: "Otevřít finále",
    logout: "Odhlásit",
    learners: {
      title: "Registrovaní cestovatelé",
      count: (n: number) => `${n} ${pl(n, "cestovatel", "cestovatelé", "cestovatelů")}`,
      none: "Zatím se nikdo nezaregistroval.",
      noStorage: "Jména se teď ukládají jen v zařízení každého studenta. Aby se zobrazovala tady, připoj ve Vercelu Upstash Redis (Storage → Marketplace) a nasaď web znovu.",
      unreachable: "Seznam se teď nepodařilo načíst.",
      name: "Jméno",
      language: "Jazyk",
      joined: "Registrace",
      refresh: "Obnovit",
    },
    demoNext: "Demo: dál",
    demoAria: "Demo režim: odpovědět správně a pokračovat",
  },
};
