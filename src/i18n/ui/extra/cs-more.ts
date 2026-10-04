// Czech: privacy + share namespaces.
const lessonsWord = (n: number) => (n === 1 ? "lekce" : n >= 2 && n <= 4 ? "lekce" : "lekcí");

export const csMore = {
  privacy: {
    link: "Soukromí",
    eyebrow: "Soukromí",
    title: "Tvoje data jednoduše",
    intro:
      "Crypto Voyage je malý vzdělávací projekt Olgy Chernové, studentky 42 Prague. Ukládáme co nejméně. Tady je úplně všechno.",
    updated: "Aktualizováno: říjen 2026",
    sections: [
      {
        title: "Co o tobě uchováváme",
        body: "Jen jméno nebo přezdívku, kterou zadáš. Uloží se v tvém zařízení, a když je zapnutá naše databáze, tak i na našem serveru, spolu s náhodným ID, tvým jazykem a daty první a poslední návštěvy. Žádný e-mail, žádné heslo, žádné telefonní číslo.",
      },
      {
        title: "Co zůstává jen v tvém zařízení",
        body: "Tvůj postup, XP a série dní, cvičná peněženka a adresa Phantomu, kterou připojíš. Všechno je uložené v tomto prohlížeči a nikdy se nedostane na náš server.",
      },
      {
        title: "AI průvodce",
        body: "Když se průvodce na něco zeptáš, tvoje otázka a krok lekce, na kterém jsi, se pošlou do Google Gemini, aby mohl napsat odpověď. Tvoje jméno se neposílá. Prosím, nepiš do chatu osobní údaje.",
      },
      {
        title: "Statistiky návštěv",
        body: "Návštěvy stránek počítáme pomocí Vercel Web Analytics. Nepoužívá cookies a nepozná, kdo jsi. Ukazuje nám jen třeba to, kolik lidí dokončí lekci.",
      },
      {
        title: "Blockchain je veřejný",
        body: "Všechno na Solana devnetu je z principu veřejné: adresy peněženek a transakce může kdokoli vidět v Solana Exploreru. Mince na devnetu nemají žádnou hodnotu.",
      },
      {
        title: "Kdo nám pomáhá",
        body: "Web běží na Vercelu a seznam jmen je uložený v Upstash. Zpracovávají data jen naším jménem. Data nikdy neprodáváme a nezobrazujeme reklamy.",
      },
      {
        title: "Proč to uchováváme",
        body: "Abys nemusel(a) jméno zadávat znovu a abychom viděli, kolika lidem kurz pomáhá. To je náš oprávněný zájem na provozu a zlepšování kurzu.",
      },
      {
        title: "Tvoje práva",
        body: "Svoje data můžeš kdykoli zobrazit, opravit nebo smazat: změň jméno v aplikaci nebo vše smaž tlačítkem níže. Podle GDPR si také můžeš stěžovat u úřadu pro ochranu osobních údajů (v Česku je to ÚOOÚ).",
      },
    ],
    contactTitle: "Máš otázky?",
    contactBody: "Založ issue na naší stránce na GitHubu a odpovíme.",
    contactLink: "Napiš nám na GitHub",
    delete: {
      title: "Smazat moje data",
      body: "Odstraní tvoje jméno z našeho serveru a vymaže vše, co si web uložil v tomto prohlížeči: jméno, postup, XP a cvičnou peněženku. Nejde to vrátit.",
      button: "Smazat moje data",
      confirm: "Opravdu? Všechno se smaže.",
      yes: "Ano, smazat",
      no: "Zrušit",
      busy: "Mažeme…",
      done: "Hotovo. Všechno je smazané.",
      failed: "Tento prohlížeč jsme vymazali, ale nepodařilo se spojit se serverem. Zkus to později, nebo nám napiš.",
    },
    walletNotice:
      "Tahle cvičná peněženka žije jen v tomto prohlížeči. Nový prohlížeč nebo vymazaná data znamenají novou peněženku. Je jen na učení: nikdy sem neposílej skutečné krypto.",
  },
  share: {
    someone: "Mořeplavec",
    card: {
      doneBadge: "Kurz dokončen",
      done: (name: string) => `${name}: kurz Crypto Voyage dokončen!`,
      doneSub: (lessons: number) => `${lessons} ${lessonsWord(lessons)} o kryptu a skutečné NFT na Solana devnetu.`,
      inviteBadge: "Pozvánka",
      invite: (name: string) => `${name} tě zve na kryptoplavbu`,
      inviteSub: "Nauč se krypto od nuly. Krátké lekce, bezpečné cvičení, žádné skutečné peníze.",
    },
    download: "Stáhnout moji kartu",
    invite: "Pozvat kamaráda",
    inviteText: "Učím se krypto s Crypto Voyage: krátké přátelské lekce a bezpečné cvičení na Solaně. Přidej se!",
    inviteTitle: "Vezmi kamaráda na palubu",
    inviteBody: "Učit se spolu je větší zábava. Pošli kamarádovi svou pozvánku.",
    copied: "Odkaz zkopírován. Vlož ho kamkoli a sdílej!",
    copyManually: (url: string) => `Zkopíruj tento odkaz a sdílej ho: ${url}`,
    page: {
      doneTitle: (name: string) => `${name}: kurz Crypto Voyage dokončen`,
      inviteTitle: (name: string) => `${name} tě zve na palubu`,
      body: "Krátké přátelské lekce o kryptu a Solaně se skutečným cvičením na devnetu. Žádné skutečné peníze, nemáš co ztratit.",
      cta: "Začít moji plavbu",
      cardAlt: "Karta Crypto Voyage",
    },
  },
};
