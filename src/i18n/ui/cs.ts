import type { DeepPartial } from "../types";
import type { Dict } from "./en";
import { csExtra } from "./extra/cs";
import { csVoyage } from "./extra/cs-voyage";

// Czech translation of src/i18n/ui/en.ts. Anything missing falls back to English.
// Tone: friendly "ty" (tykání). Past-tense forms are avoided where they would force a gender (udělal/a).

/** Czech plural: 1 / 2–4 / 0 and 5+. */
const pl = (n: number, one: string, few: string, many: string) =>
  n === 1 ? one : n >= 2 && n <= 4 ? few : many;
/** Czech decimal comma: 0.1 → "0,1". */
const num = (n: number) => String(n).replace(".", ",");
const pad = (n: number) => String(n).padStart(2, "0");
/** "z 9 lekcí" / "z 1 lekce" */
const ofLessons = (total: number) => (total === 1 ? "lekce" : "lekcí");

export const cs: DeepPartial<Dict> = {
  ...csExtra,
  ...csVoyage,
  common: {
    language: "Jazyk",
    appName: "Crypto Voyage",
    lessonLabel: (num) => `Lekce ${num}`,
  },

  shell: {
    homeAria: "Crypto Voyage — domů",
    mainNav: "Hlavní",
    nav: {
      journey: "Plavba",
      lessons: "Lekce",
      progress: "Pokrok",
      partners: "Partneři",
    },
    lessonsButton: "Lekce",
    drawer: {
      eyebrow: "Tvoje plavba",
      title: "Lekce",
      closeAria: "Zavřít lekce",
      finished: (done, total) => `Hotovo ${done} z ${total}`,
      listAria: "Lekce",
      done: "Hotovo",
      minutes: (min) => `${min} min`,
      finishedSr: "(dokončeno)",
      progress: "Pokrok",
      partners: "Partneři",
      backToRoute: "Zpět na trasu",
    },
    stats: {
      streakTitle: "Dní v řadě",
      // English types this as a literal union, so the Czech function needs a cast.
      streakSr: (days: number) => ` ${pl(days, "den", "dny", "dní")} v řadě`,
      xpTitle: "Body zkušeností",
      xpUnit: "XP",
    },
  },

  home: {
    tagTitle: "Zastávka 01 · Solana",
    tagLine: "Rychlá, levná, otevřená všem",
    eyebrow: "Vítej na palubě 👋",
    titleLead: "Tvoje první zastávka:",
    lede: "Objev krypto a blockchain úplně od nuly v krátkých interaktivních lekcích pro začátečníky.",
    cta: "Vyplout na cestu",
    note: (lessons, minutes) =>
      `Bez zkušeností s kryptem · ${lessons} ${pl(lessons, "krátká lekce", "krátké lekce", "krátkých lekcí")} · zhruba ${minutes} min`,
    routeLabel: "Na tvé trase",
    route: ["Co je krypto", "Solana", "Peněženky", "Posílání SOL", "Swapy", "Staking", "NFT", "Memecoiny", "Bezpečnost"],
  },

  journey: {
    srTitle: "Tvoje trasa: vyber si lekci",
    backToStart: "Zpět na začátek",
    stopCounter: (current, total) => `Zastávka ${pad(current)} / ${pad(total)}`,
    hint: "Posouvej, táhni nebo pluj šipkami ← →",
    prevAria: "Plout na předchozí zastávku",
    nextAria: "Plout na další zastávku",
    stopAria: (name, title, finished) => `${name}: ${title}${finished ? " (dokončeno)" : ""}`,
    lessonMeta: (minutes, xp) => `~${minutes} min · +${xp} XP`,
    done: "Hotovo",
    startLesson: "Začít lekci",
    reviewLesson: "Zopakovat lekci",
    reward: {
      label: "Cíl",
      kicker: "Tvoje odměna",
      mapLabel: "Odměna",
      title: "Získej své NFT zvířátko",
      summary: "Dokonči trasu a do tvé peněženky připluje malý mořský kamarád, který zůstane navždy tvůj.",
      summaryAllDone: "Máš to za sebou! Malý mořský kamarád čeká, až připluje do tvé peněženky.",
      meta: "Zdarma · Solana devnet",
      cta: "Zobrazit odměnu",
    },
  },

  lesson: {
    intro: {
      backToRoute: "Zpět na trasu",
      mode: "Devnet · Cvičný režim",
      start: "Jdeme na to",
      meta: (minutes, xp, steps) =>
        `~${minutes} min · +${xp} XP · ${steps} ${pl(steps, "krok", "kroky", "kroků")}`,
    },
    header: {
      close: "Zavřít lekci a vrátit se na trasu",
      progressLabel: (title) => `Postup: ${title}`,
      progressValue: (step, total) => `Krok ${step} z ${total}`,
    },
    player: {
      stepEyebrow: (label, step, total) => `${label} · Krok ${step} z ${total}`,
      quickCheckHeading: (title) => `Rychlý test · ${title}`,
      keepExploring: "Objevuj dál",
      lastStep: "Tohle byl poslední krok, skvělá práce!",
      nextStep: (title) => `Další: ${title}`,
      reread: "Znovu přečíst",
      back: "Zpět",
      practiceFirst: "Nejdřív procvič",
      quickCheck: "Rychlý test",
      finishLesson: "Dokončit lekci",
      continue: "Pokračovat",
      check: "Zkontrolovat",
    },
    step: {
      example: "Příklad ze života",
      tryIt: "Vyzkoušej si to",
      openSite: (host) => `Otevřít ${host}`,
      newTab: "(otevře se v nové kartě)",
    },
    complete: {
      eyebrow: (label) => `${label} · dokončeno`,
      heading: "Lekce dokončena! 🎉",
      finished: {
        before: "Hotovo: ",
        after: ". Další zastávka na tvé trase je za tebou.",
      },
      claim: (xp) => `✨ Získej +${xp} XP ✨`,
      xpEarned: "Získané XP",
      dayStreak: "Série dní",
      totalXp: "Celkem XP",
      nextLesson: "Další lekce",
      meetMascot: "Poznej svého maskota",
      backToRoute: "Zpět na trasu",
      upNext: (title) => `Na řadě: ${title}`,
    },
  },

  quiz: {
    kind: {
      single: "Vyber jednu odpověď",
      multiple: "Vyber všechny správné",
      fill: "Doplň chybějící slovo",
      truefalse: "Pravda, nebo nepravda?",
      match: "Klepni na slovo, pak na jeho význam",
    },
    yourPickCorrect: "Tvoje volba, správně",
    correctAnswer: "Správná odpověď",
    yourPick: "Tvoje volba",
    true: "Pravda",
    false: "Nepravda",
    fillAria: "Tvoje odpověď do mezery",
    fillPlaceholder: "piš sem",
    correctAnswerIs: (answer) => `Správná odpověď: ${answer}`,
    match: {
      words: "Slova",
      meanings: "Významy",
      correctPairs: "Správné dvojice",
      matchedOk: "Tuhle dvojici máš správně.",
      matchedDiff: "Tohle máš spojené jinak.",
      matchedWith: (item, other) => `${item}, spojeno s: ${other}`,
      pickedWord: (word) => `Vybráno: ${word}. Teď zvol jeho význam.`,
      pickedMeaning: (meaning) => `Vybráno: ${meaning}. Teď zvol slovo, které k němu patří.`,
      pairsMatched: (done, total) => `Spojeno ${done} z ${total} ${total === 1 ? "dvojice" : "dvojic"}.`,
    },
    feedback: {
      cheers: ["Krása, přesně tak!", "Naprosto správně.", "Máš to!", "Trefa do černého.", "Paráda!", "Ano, skvělá práce!"],
      wrong: "Tentokrát ne, a to vůbec nevadí.",
      xp: (xp) => `+${xp} XP`,
      correctPairsShown: "Správné dvojice vidíš výše.",
      rightAnswer: {
        before: "Správná odpověď: ",
        after: "",
      },
      askWhy: "Pořád nejasné? Zeptej se AI průvodce proč",
    },
  },

  ai: {
    open: "Zeptej se AI",
    title: "Tvůj AI průvodce",
    sailingWith: (step) => `Pluje s tebou · ${step}`,
    close: "Zavřít AI průvodce",
    thinking: "Průvodce přemýšlí",
    questionLabel: "Tvoje otázka",
    placeholder: "Zeptej se na tento krok…",
    send: "Odeslat otázku",
    disclaimer: "Jen pro učení, ne finanční poradenství. Svou obnovovací frázi nikdy nikomu neprozrazuj.",
    noAnswer: "Hmm, na tohle mě nic nenapadá. Zkusíš se zeptat jinak?",
    offline: "S průvodcem se teď nepodařilo spojit. Zkontroluj připojení a zkus to znovu.",
    greeting: {
      missed:
        "Ahoj! Tahle byla záludná. Mám ti vysvětlit, proč sedí ta správná odpověď? Chyby jsou prostě součást plavby.",
      quiz: "Ahoj! Potřebuješ postrčit? Dám ti nápovědu, ne odpověď, ať je výhra celá tvoje.",
      read: "Ahoj, vítej na palubě! Nejde ti tenhle krok, nebo tě jen něco zajímá? Zeptej se mě na cokoli, klidně vlastními slovy.",
    },
    suggestions: {
      whyWrong: "Proč moje odpověď nebyla správná?",
      anotherExample: "Dej mi další příklad",
      hint: "Můžu dostat nápovědu?",
      simpler: "Vysvětli to jednodušeji",
      realLife: "Dej mi příklad ze života",
    },
  },

  practice: {
    zoneLabel: "Cvičná zóna",
    header: {
      titleShort: "Peněženka",
      title: "Tvoje tréninková peněženka",
      copy: "kopírovat",
      copied: "zkopírováno!",
      creating: "vytváří se…",
      modeDevnet: "Devnet",
      modePractice: "Cvičný",
      tokenPractice: (symbol) => `${symbol} · cvičný`,
      seeOnExplorer: "Zobrazit v Exploreru",
    },
    opensInNewTab: "(otevře se v nové kartě)",
    faucet: {
      title: "Nejdřív si natoč z faucetu 🚰",
      body: "Tvoje peněženka je prázdná. Devnet faucet nalévá testovací SOL zdarma — nikdy žádné skutečné peníze.",
      button: "Získat testovací SOL zdarma",
      busy: "Natáčím testovací SOL…",
    },
    error: {
      altFaucetBefore: "Mince můžeš získat i na",
      altFaucetAfter:
        "— vlož svou adresu (klepni nahoře vedle ní na „kopírovat“), zvol Devnet a vrať se sem. Mincí si všimneme automaticky.",
      switchToPractice: "Nebo pokračuj v cvičném režimu (simulace)",
    },
    noTransferYet: (amount) =>
      `Zatím žádný převod. Pošli teď ${num(amount)} testovacího SOL a ukážeme ti jeho účtenku.`,
    action: {
      swap: (symbol) => `Vyměnit za ${symbol}`,
      stake: (amount) => `Stakovat ${num(amount)} SOL`,
      send: (amount) => `Poslat ${num(amount)} SOL`,
      swapping: "Měním…",
      staking: "Stakuju…",
      sending: "Odesílám…",
    },
    success: {
      swap: "Automat ti vydal tvoje tokeny!",
      stake: "Hotovo! Tvoje účtenka mSOL je v peněžence.",
      send: "Odesláno! Dorazilo to zhruba za vteřinu.",
    },
    verify: {
      promptSimulated: "Stalo se to doopravdy? Pojďme to ověřit!",
      promptSend: "Odešlo to? Mrkněme do veřejného zápisníku!",
      button: "🔍 Ověřit na blockchainu",
    },
    sendForm: {
      to: "Komu (kamarádce)",
      amount: "Částka",
      fee: "Síťový poplatek",
    },
    swapForm: {
      youPay: "Platíš",
      youGet: "Dostaneš",
      tokenName: "Ocean Token",
      note: "Cvičný swap: simulace v tréninkové peněžence, žádné skutečné tokeny se nepohnou.",
    },
    stakeForm: {
      youStake: "Stakuješ",
      youGetReceipt: "Dostaneš účtenku",
      keepsEarning: "dál vydělává odměny",
      note: "Cvičný staking: simulace v tréninkové peněžence, žádné skutečné mince se nepohnou.",
    },
    receipt: {
      title: "Účtenka transakce",
      success: "Úspěch",
      failed: "Selhalo",
      what: "Co",
      signature: "Podpis",
      from: "Od (ty)",
      to: "Komu",
      amount: "Částka",
      fee: "Síťový poplatek",
      time: "Čas",
      network: "Síť",
      networkDevnet: "Solana devnet",
      networkPractice: "Cvičná (simulace)",
      viewOnExplorer: "Zobrazit v Solana Exploreru",
      realNote: "Tohle je skutečný veřejný záznam. Všimni si: jen adresy, nikdy tvoje jméno.",
      practiceNote:
        "Tohle je cvičná účtenka (simulace). Na devnetu otevře stejné tlačítko skutečný záznam v Solana Exploreru. Všimni si: jen adresy, nikdy tvoje jméno.",
    },
  },

  wallet: {
    errors: {
      unreachable: "Nepodařilo se nám spojit se Solana devnetem. Zkontroluj připojení a zkus to znovu.",
      unreachableNow: "Se Solana devnetem se teď nepodařilo spojit.",
      faucetBusy: "Bezplatný devnet kohoutek je teď vytížený (omezuje, jak často nalévá).",
      faucetFailed: "Faucet neodpověděl. Zkus to znovu za minutu.",
      sendFailed: "Převod neprošel. Zkus to prosím znovu.",
      mintFailed: "Vyražení NFT neprošlo. Zkus to prosím znovu.",
    },
    tx: {
      faucet: (amount) => `Přijato ${num(amount)} SOL z devnet faucetu`,
      send: (amount) => `Odesláno ${num(amount)} SOL kamarádce`,
      swap: (pay, get, symbol) => `Směna ${num(pay)} SOL za ${num(get)} ${symbol}`,
      stake: (amount) => `Stakováno ${num(amount)} SOL přes Marinade (cvičně)`,
      mint: "Vyraženo NFT Mořská želva Pebble",
    },
  },

  finale: {
    backToRoute: "Zpět na trasu",
    tag: "Devnet · Finále",
    eyebrow: "Konec trasy",
    kicker: "Finále",
    title: "Seznam se se svým maskotem! 🐢",
    intro:
      "Podívej, jaký kus cesty máš za sebou! Peněženky, posílání krypta, sledování účtenek i decentralizovaný swap — to všechno už umíš. Na oslavu tvé promoce čeká na tvůj digitální batoh jedinečný mořský maskot.",
    locked: {
      title: "Už jen kousek!",
      body: (done, total) =>
        `Dokonči ${total >= 2 && total <= 4 ? `všechny ${total} lekce` : `všech ${total} lekcí`} a odemkni si maskota. Hotovo máš ${done} z ${total}.`,
      continue: "Pokračovat v trase",
    },
    partners: "Spolehlivé přístavy",
    share: "Sdílet plavbu",
    shareText:
      "Mám za sebou své první kryptolekce v Crypto Voyage a malý výukový odznak s mořským zvířátkem je můj!",
    shareCopied: "Odkaz zkopírován. Vlož ho kamkoli a sdílej!",
    shareCopyManually: (url) => `Pro sdílení zkopíruj tento odkaz: ${url}`,
    card: {
      badge: "Devnet · Výukový odznak",
      name: "Mořská želva Pebble",
      subtitle: "Dokončený kurz Crypto Voyage",
      claimed: "Získáno",
      notClaimed: "Zatím nezískáno",
    },
    mint: {
      whereLegend: "Kde má tvůj maskot bydlet?",
      whereTitle: "Kde má Pebble bydlet?",
      trainingLabel: "Moje tréninková peněženka",
      trainingHint: "Nejjednodušší: nepotřebuješ žádnou aplikaci.",
      phantomLabel: "Moje vlastní peněženka Phantom",
      phantomHint: "Vlož adresu svého Phantomu (je bezpečné ji sdílet).",
      phantomAddress: "Tvoje adresa ve Phantomu",
      phantomPlaceholder: "např. 7Xb…9Yz",
      phantomInvalid: "Tohle zatím nevypadá jako adresa na Solaně.",
      switchToPractice: "Pokračovat v cvičném režimu (simulace)",
      button: "🎁 Vyrazit maskota",
      busy: "Razím na Solaně…",
      note: "Skutečné NFT 1 z 1 na Solana devnetu. Zdarma: mince na devnetu nemají žádnou hodnotu.",
      minted: "Tvůj maskot je vyražený! 🎉",
      mintedRealPhantom: (addr) =>
        `Pebble je skutečné NFT na Solana devnetu a bydlí v tvé peněžence Phantom (${addr}). Existuje jen jedno jediné — a je tvoje.`,
      mintedRealTraining:
        "Pebble je skutečné NFT na Solana devnetu a bydlí v tvé tréninkové peněžence. Existuje jen jedno jediné — a je tvoje.",
      mintedPractice: "Pebble bydlí v tvém cvičném batohu (simulace). Na devnetu to můžeš kdykoli zkusit znovu.",
      seeOnExplorer: "Zobrazit v Solana Exploreru",
      opensInNewTab: "(otevře se v nové kartě)",
      findTitle: "Kde najdeš svého nového kamaráda 📱",
      phantomSteps: [
        "Otevři Phantom → Settings → Developer Settings a zapni Testnet Mode (Solana Devnet).",
        "Klepni na kartu Collectibles (ikona s malými čtverečky, ⊞).",
        "Než se peněženka aktualizuje, může trvat minutku, než se Pebble objeví.",
      ],
      trainingFind:
        "V aplikaci peněženky, jako je Phantom, najdeš NFT na kartě Collectibles (ikona s malými čtverečky, ⊞). Pebble teď bydlí tady v tréninkové peněžence — příště si ho pošli rovnou do svého Phantomu.",
    },
  },

  progress: {
    eyebrow: "Tvůj pokrok",
    title: "Podívej, jaký kus cesty máš za sebou",
    xp: {
      heading: "Zkušenosti",
      unit: "XP",
      nothingYet: "Každý krok a každý test ti přidá trochu víc. Jen tak dál!",
      lessonsFinished: (done, total) => `Hotovo ${done} z ${total} ${ofLessons(total)} — krásná práce.`,
    },
    streak: {
      daysInRow: (n) => `${n} ${pl(n, "den", "dny", "dní")} v řadě`,
      activeToday: "Dnes máš splněno — uvidíme se zítra.",
      keepGoing: "Jedna malá lekce dnes a série pokračuje.",
      start: "Nauč se dnes něco malého a začni novou sérii.",
      weekLabel: "Posledních 7 dní",
      today: "Dnes",
      dayLearned: (day) => `${day}: učení splněno`,
      dayNoLesson: (day) => `${day}: bez lekce`,
    },
    lessons: {
      heading: "Tvoje lekce",
      doneCount: (done, total) => `${done} / ${total} hotovo`,
      stateDone: "Hotovo",
      stateNotStarted: "Nezačato",
      stateSteps: (n) => `${n} ${pl(n, "krok", "kroky", "kroků")}`,
      stateStepsDone: (done, total) => `${done}/${total}`,
      progressLabel: (title) => `Postup: ${title}`,
    },
    nft: {
      eyebrow: "Tvoje NFT zvířátko",
      claimedTitle: "Tvoje zvířátko je v peněžence",
      claimedBody: "Je tvoje, na Solana devnetu — důkaz toho, co nového umíš.",
      lockedTitle: "Dokonči lekce a získej své zvířátko",
      lockedBody: (done, total) =>
        `Na konci trasy čeká malý mořský kamarád. Hotovo ${done} z ${total} ${ofLessons(total)}.`,
      continue: "Pokračovat v plavbě",
    },
    reset: {
      button: "Vynulovat pokrok",
      confirm: "Smazat všechny XP, sérii i lekce?",
      yes: "Ano, začít znovu",
      no: "Ponechat pokrok",
    },
    empty: {
      title: "Tvoje plavba začíná tady",
      body: "Zatím tu nic není — a to je naprosto v pořádku. První lekce zabere asi pět minut a všechno, co se naučíš, se objeví na téhle stránce.",
      cta: "Vyplout na cestu",
      earnXp: "Sbírej XP",
      buildStreak: "Buduj sérii",
      getAnimal: "Získej zvířátko",
    },
    loading: "Načítám tvůj pokrok…",
  },

  partners: {
    page: {
      kicker: "Doporučujeme",
      title: "🧭 Spolehlivé přístavy",
      intro:
        "Vybrali jsme ta nejbezpečnější a nejpřívětivější místa, která ti pomůžou na další cestě. Klepni na kteréhokoli z našich ověřených přátel a uvidíš, s čím ti můžou pomoct.",
      rewardEarned: "Odměna získána",
      opensInNewTab: " (otevře se v nové kartě)",
      disclaimer: "Nabízíme vzdělávací mapy, ne finanční poradenství. Krypto je riskantní — začni v malém.",
    },
    cards: {
      marinade: {
        tagline: "Tvůj digitální spořicí účet",
        line: "Jednoduchý a bezpečný způsob, jak nechat své krypto v klidu růst, zatímco spíš.",
        reward: "⭐️ NFT hvězdice (cvičné) + bonus 10 $ od Marinade za registraci",
        cta: "Začít staking výpravu",
        note: "Bonus 10 $ je vlastní nabídka Marinade pro skutečné registrace. Aktuální podmínky si ověř na jejich webu.",
      },
      superteam: {
        name: "Solana komunita (Superteam)",
        tagline: "Přátelská globální rodina kolem naší sítě",
        line: "Krypto je lepší společně! Objev akce zdarma a seznam se s novými přáteli, kteří se taky učí.",
        reward: (xp) => `🌟 +${xp} XP`,
        cta: "Prozkoumat Solana komunitu",
      },
      phantom: {
        name: "Peněženka Phantom",
        tagline: "Tvůj skutečný digitální batoh na každý den",
        line: "Chceš se posunout dál od tréninkové peněženky? Pořiď si oficiální aplikaci a nos své digitální poklady bezpečně každý den.",
        reward: (xp) => `🛡️ Odznak „Skutečný vlastník“ + ${xp} XP`,
        cta: "Založit peněženku Phantom",
      },
      bybit: {
        tagline: "Tvoje přátelská směnárna",
        line: "Chceš zkusit skutečné mince? Vyměň běžné peníze (platební kartou) za krypto a vyraz na cestu.",
        reward: (xp) => `🎟️ +${xp} XP`,
        cta: "Navštívit Bybit EU",
      },
    },
    guides: {
      kicker: "Základní navigační průvodci",
      title: "🗺️ Než zvedneš kotvu",
      network: {
        title: "🌊 Čas na skutečný oceán?",
        subtitle: "Devnet vs. Mainnet",
        body: (b) => [
          "V lekcích jsme si hráli ve cvičném bazénu jménem ",
          b("Devnet"),
          ". Se skutečnými aplikacemi vyplouváš na skutečný oceán: ",
          b("Mainnet"),
          ".",
        ],
        howTo: "Jak ve Phantomu zkontrolovat síť:",
        steps: [
          (b) => ["Otevři Phantom a klepni na ikonu ", b("Settings"), " (⚙️)."],
          (b) => ["Sjeď dolů a klepni na ", b("Developer Settings"), "."],
          (b) => ["Najdi přepínač ", b("Testnet Mode"), " a ", b("vypni"), " ho."],
        ],
        after:
          "Když je Testnet Mode vypnutý, cvičné mince už neuvidíš. Tvoje peněženka je teď připravená na skutečné digitální poklady.",
      },
      safety: {
        title: "🛡️ Krátce o bezpečnosti",
        tips: [
          {
            title: "Tvoje mapa z 12 slov je jen pro tvoje oči",
            text: "Žádná skutečná firma ani podpora po tobě nikdy nebude chtít tajnou obnovovací frázi. Měj ji na papíře, na bezpečném místě.",
          },
          {
            title: "Vždycky nejdřív otestuj vodu",
            text: "Zkoušíš novou aplikaci? Nejdřív pošli malinkou testovací transakci (třeba za pár desítek korun).",
          },
          {
            title: "Pluj jen s tím, co si můžeš dovolit",
            text: "Nabízíme vzdělávací mapy, ne finanční poradenství. Začni v malém a objevuj bezpečně!",
          },
        ],
      },
    },
    quest: {
      back: "← Spolehlivé přístavy",
      kicker: "Interaktivní výprava · Cvičně",
      title: "💧 Staking s Marinade",
      welcome: "Vítej u své první simulace ze skutečného světa!",
      conceptTitle: "Jak to funguje",
      concept: (b) => [
        "Představ si klasický spořicí účet: vložíš na něj peníze a časem ti přinesou něco navíc. V kryptu se tomu říká ",
        b("staking"),
        ". Marinade nechá tvoje mince pracovat na provozu sítě Solana, takže můžou pomalu růst, zatímco spíš. (Jako u každé investice nejsou odměny zaručené.)",
      ],
      step1: {
        title: "Vlož 1 cvičný SOL",
        done: (b, wallet) => [
          `Hotovo! Do tvé tréninkové peněženky${wallet ? ` (${wallet})` : ""} ti přišel `,
          b("1 mSOL"),
          ", účtenka od Marinade za „stakovaný SOL“.",
        ],
        balance: (sol) =>
          `V tréninkové peněžence máš ${sol} SOL. Pojďme si nanečisto stakovat 1 z nich (simulace: žádné mince se doopravdy nepohnou).`,
        staking: "Stakuju…",
        stake: "Stakovat 1 cvičný SOL",
      },
      step2: {
        title: "Ověř to na blockchainu",
        done: (b, label, fee, sig) => [
          "✓ Účtenka nalezena: ",
          b(label),
          `, poplatek ${num(fee)} SOL, podpis `,
          sig,
          ". (Cvičná účtenka: skutečné odkazy do Solana Exploreru přinese devnet peněženka.)",
        ],
        verify: "🔍 Ověřit na blockchainu",
      },
      step3: {
        title: "Vyzvedni si odměnu",
        done: (xp) => `⭐️ Tvoje hvězdice (cvičné NFT) je v batohu a +${xp} XP je tvých!`,
        claim: "🎁 Vyzvednout odměnu (NFT hvězdice)",
      },
      realThing: (link) => [
        "Chceš vidět, jak to vypadá doopravdy? Navštiv ",
        link,
        ". Jejich bonus 10 $ za registraci je jejich vlastní nabídka — aktuální podmínky si ověř na jejich webu. Nejde o finanční poradenství.",
      ],
    },
  },
};
