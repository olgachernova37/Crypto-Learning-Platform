import type { ReactNode } from "react";
import type { DeepPartial } from "../types";
import type { Dict } from "./en";

// German translation of src/i18n/ui/en.ts. Anything missing falls back to English.
// Addresses the learner with "du" (never "Sie"), warm and simple, no jargon.

/** German plural: 1 → singular, everything else → plural. */
const pl = (n: number, one: string, many: string) => (n === 1 ? one : many);
/** Decimal comma: 0.1 → "0,1". */
const dec = (n: number) => String(n).replace(".", ",");
const pad = (n: number) => String(n).padStart(2, "0");

type Bold = (text: string) => ReactNode;

export const de: DeepPartial<Dict> = {
  common: {
    language: "Sprache",
    appName: "Crypto Voyage",
    lessonLabel: (num: string) => `Lektion ${num}`,
  },

  shell: {
    homeAria: "Crypto Voyage – Startseite",
    mainNav: "Hauptmenü",
    nav: {
      journey: "Reise",
      lessons: "Lektionen",
      progress: "Fortschritt",
      partners: "Partner",
    },
    lessonsButton: "Lektionen",
    drawer: {
      eyebrow: "Deine Reise",
      title: "Lektionen",
      closeAria: "Lektionen schließen",
      finished: (done: number, total: number) => `${done} von ${total} geschafft`,
      listAria: "Lektionen",
      done: "Fertig",
      minutes: (min: number) => `${min} Min.`,
      finishedSr: "(abgeschlossen)",
      progress: "Fortschritt",
      partners: "Partner",
      backToRoute: "Zurück zur Route",
    },
    stats: {
      streakTitle: "Tage in Folge",
      streakSr: (days: number): string => (days === 1 ? " Tag in Folge" : " Tage in Folge"),
      xpTitle: "Erfahrungspunkte",
      xpUnit: "XP",
    },
  },

  home: {
    tagTitle: "Halt 01 · Solana",
    tagLine: "Schnell, günstig, offen für alle",
    eyebrow: "Willkommen an Bord 👋",
    titleLead: "Dein erster Halt:",
    lede: "Entdecke Krypto und Blockchain ganz von vorn – mit kurzen, interaktiven Lektionen für Einsteiger.",
    cta: "Reise starten",
    note: (lessons: number, minutes: number) =>
      `Keine Krypto-Erfahrung nötig · ${lessons} kurze ${pl(lessons, "Lektion", "Lektionen")} · ca. ${minutes} Min.`,
    routeLabel: "Auf deiner Route",
    route: ["Was ist Krypto", "Solana", "Wallets", "SOL senden", "Tauschen", "Staking", "NFTs", "Memecoins", "Sicher bleiben", "Dein Tresor"],
  },

  journey: {
    srTitle: "Deine Route: Wähl eine Lektion",
    backToStart: "Zurück zum Start",
    stopCounter: (current: number, total: number) => `Halt ${pad(current)} / ${pad(total)}`,
    hint: "Scrollen, ziehen oder ← → zum Segeln",
    prevAria: "Zum vorherigen Halt segeln",
    nextAria: "Zum nächsten Halt segeln",
    stopAria: (name: string, title: string, finished: boolean) =>
      `${name}: ${title}${finished ? " (abgeschlossen)" : ""}`,
    lessonMeta: (minutes: number, xp: number) => `~${minutes} Min. · +${xp} XP`,
    done: "Fertig",
    startLesson: "Lektion starten",
    reviewLesson: "Wiederholen",
    reward: {
      label: "Das Ziel",
      kicker: "Deine Belohnung",
      mapLabel: "Belohnung",
      title: "Hol dir dein NFT-Tier",
      summary: "Schaff die Route, und ein kleiner Meeresfreund landet in deiner Wallet – für immer deiner.",
      summaryAllDone: "Geschafft! Ein kleiner Meeresfreund wartet darauf, in deine Wallet zu schwimmen.",
      meta: "Kostenlos · Solana devnet",
      cta: "Zur Belohnung",
    },
  },

  lesson: {
    intro: {
      backToRoute: "Zurück zur Route",
      mode: "Devnet · Übungsmodus",
      start: "Los geht's",
      prevAria: "Vorherige Lektion",
      nextAria: "Nächste Lektion",
      switchAria: "Lektion wechseln",
      meta: (minutes: number, xp: number, steps: number) =>
        `~${minutes} Min. · +${xp} XP · ${steps} ${pl(steps, "Schritt", "Schritte")}`,
    },
    header: {
      close: "Lektion schließen und zurück zur Route",
      progressLabel: (title: string) => `Fortschritt: ${title}`,
      progressValue: (step: number, total: number) => `Schritt ${step} von ${total}`,
    },
    player: {
      stepEyebrow: (label: string, step: number, total: number) => `${label} · Schritt ${step} von ${total}`,
      quickCheckHeading: (title: string) => `Kurzer Check · ${title}`,
      keepExploring: "Weiter entdecken",
      lastStep: "Das war der letzte Schritt, super gemacht!",
      nextStep: (title: string) => `Weiter: ${title}`,
      reread: "Nochmal lesen",
      back: "Zurück",
      practiceFirst: "Erst üben",
      quickCheck: "Kurzer Check",
      finishLesson: "Lektion beenden",
      continue: "Weiter",
      check: "Prüfen",
    },
    step: {
      example: "Beispiel aus dem Alltag",
      tryIt: "Probier's selbst",
      openSite: (host: string) => `${host} öffnen`,
      newTab: "(öffnet in neuem Tab)",
    },
    complete: {
      eyebrow: (label: string) => `${label} · geschafft`,
      heading: "Lektion geschafft! 🎉",
      finished: {
        before: "Du hast ",
        after: " geschafft. Wieder ein Halt auf deiner Route, abgesegelt.",
      },
      claim: (xp: number) => `✨ +${xp} XP abholen ✨`,
      xpEarned: "XP verdient",
      dayStreak: "Tage-Serie",
      totalXp: "XP gesamt",
      nextLesson: "Nächste Lektion",
      meetMascot: "Lern dein Maskottchen kennen",
      backToRoute: "Zurück zur Route",
      upNext: (title: string) => `Als Nächstes: ${title}`,
    },
  },

  quiz: {
    kind: {
      single: "Wähl eine Antwort",
      multiple: "Wähl alle passenden aus",
      fill: "Ergänze das fehlende Wort",
      truefalse: "Richtig oder falsch?",
      match: "Tipp ein Wort, dann seine Bedeutung",
    },
    yourPickCorrect: "Deine Wahl, richtig",
    correctAnswer: "Richtige Antwort",
    yourPick: "Deine Wahl",
    true: "Richtig",
    false: "Falsch",
    fillAria: "Deine Antwort für die Lücke",
    fillPlaceholder: "hier tippen",
    correctAnswerIs: (answer: string) => `Richtige Antwort: ${answer}`,
    match: {
      words: "Wörter",
      meanings: "Bedeutungen",
      correctPairs: "Richtige Paare",
      matchedOk: "Das hast du richtig zugeordnet.",
      matchedDiff: "Das hast du anders zugeordnet.",
      matchedWith: (item: string, other: string) => `${item}, zugeordnet zu: ${other}`,
      pickedWord: (word: string) => `${word} ausgewählt. Wähl jetzt die Bedeutung.`,
      pickedMeaning: (meaning: string) => `${meaning} ausgewählt. Wähl jetzt das Wort.`,
      pairsMatched: (done: number, total: number) => `${done} von ${total} ${pl(total, "Paar", "Paaren")} zugeordnet.`,
    },
    feedback: {
      cheers: ["Super, genau so!", "Ganz genau.", "Du hast es!", "Volltreffer.", "Klasse!", "Ja, gut gemacht!"],
      wrong: "Nicht ganz – und das ist okay.",
      xp: (xp: number) => `+${xp} XP`,
      correctPairsShown: "Die richtigen Paare siehst du oben.",
      rightAnswer: {
        before: "Die richtige Antwort: ",
        after: "",
      },
      askWhy: "Noch unsicher? Frag den KI-Guide, warum",
    },
  },

  ai: {
    open: "KI fragen",
    title: "Dein KI-Guide",
    sailingWith: (step: string) => `Segelt mit dir · ${step}`,
    close: "KI-Guide schließen",
    thinking: "Der Guide denkt nach",
    questionLabel: "Deine Frage",
    placeholder: "Frag etwas zu diesem Schritt…",
    send: "Frage senden",
    disclaimer: "Nur zum Lernen, keine Finanzberatung. Teile nie deine Wiederherstellungsphrase.",
    noAnswer: "Hmm, mir fällt gerade keine Antwort ein. Fragst du es mal anders?",
    offline: "Ich erreiche den Guide gerade nicht. Prüf deine Verbindung und versuch's nochmal?",
    greeting: {
      missed:
        "Ahoi! Die war knifflig. Soll ich dir erklären, warum die richtige Antwort passt? Fehler gehören einfach zur Route.",
      quiz: "Ahoi! Brauchst du einen kleinen Schubs? Ich gebe dir einen Tipp, nicht die Antwort – damit der Sieg deiner bleibt.",
      read: "Ahoi! Hängst du fest oder bist einfach neugierig? Frag mich alles, in deinen eigenen Worten.",
    },
    suggestions: {
      whyWrong: "Warum war meine Antwort falsch?",
      anotherExample: "Gib mir noch ein Beispiel",
      hint: "Bekomme ich einen Tipp?",
      simpler: "Erklär das einfacher",
      realLife: "Gib mir ein Alltagsbeispiel",
    },
  },

  practice: {
    zoneLabel: "Übungszone",
    header: {
      titleShort: "Übungs-Wallet",
      title: "Deine Übungs-Wallet",
      copy: "kopieren",
      copied: "kopiert!",
      creating: "wird erstellt…",
      modeDevnet: "Devnet",
      modePractice: "Übung",
      tokenPractice: (symbol: string) => `${symbol} · Übung`,
      seeOnExplorer: "Im Explorer ansehen",
    },
    opensInNewTab: "(öffnet in neuem Tab)",
    faucet: {
      title: "Erst mal am Faucet auftanken 🚰",
      body: "Deine Wallet ist leer. Der devnet-Faucet schenkt dir kostenlose Test-SOL – nie echtes Geld.",
      button: "Gratis Test-SOL holen",
      busy: "Test-SOL fließen…",
    },
    error: {
      altFaucetBefore: "Coins bekommst du auch auf",
      altFaucetAfter:
        "– füg deine Adresse ein (tipp oben daneben auf „kopieren“), wähl Devnet und komm zurück. Wir merken die Coins automatisch.",
      switchToPractice: "Oder im Übungsmodus weitermachen (simuliert)",
    },
    noTransferYet: (amount: number) =>
      `Noch keine Überweisung. Sende jetzt ${dec(amount)} Test-SOL, dann zeigen wir dir die Quittung.`,
    action: {
      swap: (symbol: string) => `In ${symbol} tauschen`,
      stake: (amount: number) => `${dec(amount)} SOL staken`,
      send: (amount: number) => `${dec(amount)} SOL senden`,
      swapping: "Wird getauscht…",
      staking: "Wird gestakt…",
      sending: "Wird gesendet…",
    },
    success: {
      swap: "Der Automat hat dir deine Tokens gegeben!",
      stake: "Gestakt! Deine mSOL-Quittung ist in deiner Wallet.",
      send: "Gesendet! Es kam in etwa einer Sekunde an.",
    },
    verify: {
      promptSimulated: "Ist das wirklich passiert? Lass uns nachsehen!",
      promptSend: "Hast du es gesendet? Schauen wir ins öffentliche Notizbuch!",
      button: "🔍 Onchain prüfen",
    },
    sendForm: {
      to: "An (Freund/in)",
      amount: "Betrag",
      fee: "Netzwerkgebühr",
    },
    swapForm: {
      youPay: "Du zahlst",
      youGet: "Du bekommst",
      tokenName: "Ocean Token",
      note: "Übungstausch: simuliert in deiner Übungs-Wallet, es bewegen sich keine echten Tokens.",
    },
    stakeForm: {
      youStake: "Du stakst",
      youGetReceipt: "Du bekommst eine Quittung",
      keepsEarning: "bringt weiter Belohnungen",
      note: "Übungs-Staking: simuliert in deiner Übungs-Wallet, es bewegen sich keine echten Coins.",
    },
    receipt: {
      title: "Transaktionsquittung",
      success: "Erfolgreich",
      failed: "Fehlgeschlagen",
      what: "Was",
      signature: "Signatur",
      from: "Von (du)",
      to: "An",
      amount: "Betrag",
      fee: "Netzwerkgebühr",
      time: "Zeit",
      network: "Netzwerk",
      networkDevnet: "Solana devnet",
      networkPractice: "Übung (simuliert)",
      viewOnExplorer: "Im Solana Explorer ansehen",
      realNote: "Das ist der echte öffentliche Eintrag. Achtung: nur Adressen, nie dein Name.",
      practiceNote:
        "Das ist eine Übungsquittung (simuliert). Im devnet öffnet derselbe Button den echten Eintrag im Solana Explorer. Achtung: nur Adressen, nie dein Name.",
    },
  },

  wallet: {
    errors: {
      unreachable: "Wir erreichen das Solana devnet nicht. Prüf deine Verbindung und versuch's nochmal.",
      unreachableNow: "Wir erreichen das Solana devnet gerade nicht.",
      faucetBusy: "Der kostenlose devnet-Faucet ist gerade beschäftigt (er gibt nur ab und zu etwas aus).",
      faucetFailed: "Der Faucet hat nicht geantwortet. Versuch's in einer Minute nochmal.",
      sendFailed: "Die Überweisung hat nicht geklappt. Bitte versuch's nochmal.",
      mintFailed: "Das Minten hat nicht geklappt. Bitte versuch's nochmal.",
    },
    tx: {
      faucet: (amount: number) => `${dec(amount)} SOL vom devnet-Faucet erhalten`,
      send: (amount: number) => `${dec(amount)} SOL an einen Freund gesendet`,
      swap: (pay: number, get: number, symbol: string) => `${dec(pay)} SOL gegen ${dec(get)} ${symbol} getauscht`,
      stake: (amount: number) => `${dec(amount)} SOL bei Marinade gestakt (Übung)`,
      mint: "NFT „Pebble die Meeresschildkröte“ gemintet",
    },
  },

  finale: {
    backToRoute: "Zurück zur Route",
    tag: "Devnet · Finale",
    eyebrow: "Das Ende der Route",
    kicker: "Finale",
    title: "Lern dein Maskottchen kennen! 🐢",
    intro:
      "Schau, wie weit du gekommen bist! Du kennst dich mit Wallets aus, hast Krypto gesendet, Quittungen geprüft und sogar dezentral getauscht. Zur Feier deines Abschlusses wartet ein einzigartiges Meeres-Maskottchen auf deinen digitalen Rucksack.",
    locked: {
      title: "Fast geschafft!",
      body: (done: number, total: number) =>
        `Schaff alle ${total} ${pl(total, "Lektion", "Lektionen")}, um dein Maskottchen freizuschalten. Du hast ${done} von ${total} geschafft.`,
      continue: "Route fortsetzen",
    },
    partners: "Sichere Häfen",
    share: "Reise teilen",
    shareText:
      "Ich habe gerade meine ersten Krypto-Lektionen bei Crypto Voyage geschafft und ein kleines Meerestier-Lernabzeichen verdient!",
    shareCopied: "Link kopiert. Füg ihn irgendwo ein und teile ihn!",
    shareCopyManually: (url: string) => `Kopier diesen Link zum Teilen: ${url}`,
    card: {
      badge: "Devnet · Lernabzeichen",
      name: "Pebble die Meeresschildkröte",
      subtitle: "Hat den Crypto-Voyage-Kurs geschafft",
      claimed: "Abgeholt",
      notClaimed: "Noch nicht abgeholt",
    },
    mint: {
      whereLegend: "Wo soll dein Maskottchen wohnen?",
      whereTitle: "Wo soll Pebble wohnen?",
      trainingLabel: "Meine Übungs-Wallet",
      trainingHint: "Am einfachsten: keine App nötig.",
      phantomLabel: "Meine eigene Phantom-Wallet",
      phantomHint: "Verbinde dein Phantom oder füg seine Adresse ein (die darfst du ruhig teilen).",
      phantomAddress: "Deine Phantom-Adresse",
      phantomPlaceholder: "z. B. 7Xb…9Yz",
      phantomInvalid: "Das sieht noch nicht nach einer Solana-Adresse aus.",
      connect: "👻 Phantom verbinden",
      connecting: "Warte auf Phantom…",
      connected: (addr: string) => `Verbunden: ${addr}`,
      useAnother: "Andere Adresse nutzen",
      notInstalled: "Phantom ist in diesem Browser nicht installiert.",
      install: "Phantom installieren",
      openInApp: "Diese Seite in der Phantom-App öffnen",
      rejected: "Die Verbindung wurde in Phantom abgebrochen. Versuch's nochmal oder füg unten deine Adresse ein.",
      orPaste: "…oder füg deine Adresse ein",
      connectSafe:
        "Beim Verbinden wird nur deine öffentliche Adresse geteilt. Wir bitten dich nie, etwas zu signieren – und nie um deine 12 Wörter.",
      switchToPractice: "Im Übungsmodus weitermachen (simuliert)",
      button: "🎁 Mein Maskottchen minten",
      busy: "Wird auf Solana gemintet…",
      note: "Ein echtes 1-von-1-NFT im Solana devnet. Kostenlos: devnet-Coins sind nichts wert.",
      minted: "Dein Maskottchen ist gemintet! 🎉",
      mintedRealPhantom: (addr: string) =>
        `Pebble ist ein echtes NFT im Solana devnet und wohnt in deiner Phantom-Wallet (${addr}). Es gibt genau eins – und das gehört dir.`,
      mintedRealTraining:
        "Pebble ist ein echtes NFT im Solana devnet und wohnt in deiner Übungs-Wallet. Es gibt genau eins – und das gehört dir.",
      mintedPractice: "Pebble wohnt in deinem Übungsrucksack (simuliert). Probier's jederzeit nochmal im devnet.",
      seeOnExplorer: "Im Solana Explorer ansehen",
      opensInNewTab: "(öffnet in neuem Tab)",
      findTitle: "Wo du deinen neuen Freund findest 📱",
      phantomSteps: [
        "Öffne Phantom → Einstellungen → Entwicklereinstellungen und schalte den Testnet-Modus ein (Solana Devnet).",
        "Tipp auf den Tab „Sammlerstücke“ (Collectibles, das Symbol mit kleinen Quadraten, ⊞).",
        "Es kann eine Minute dauern, bis Pebble auftaucht, während die Wallet aktualisiert.",
      ],
      trainingFind:
        "In einer Wallet-App wie Phantom wohnen NFTs im Tab „Sammlerstücke“ (Collectibles, das Symbol mit kleinen Quadraten, ⊞). Dein Pebble ist hier in der Übungs-Wallet – schick es beim nächsten Mal direkt an dein eigenes Phantom.",
    },
  },

  progress: {
    eyebrow: "Dein Fortschritt",
    title: "Schau, wie weit du gesegelt bist",
    xp: {
      heading: "Erfahrung",
      unit: "XP",
      nothingYet: "Jeder Schritt und jedes Quiz bringt ein bisschen mehr. Bleib dran!",
      lessonsFinished: (done: number, total: number) =>
        `${done} von ${total} ${pl(total, "Lektion", "Lektionen")} geschafft – richtig gut.`,
    },
    streak: {
      daysInRow: (n: number) => `${n} ${pl(n, "Tag", "Tage")} in Folge`,
      activeToday: "Du hast heute gelernt – bis morgen!",
      keepGoing: "Eine kleine Lektion heute hält die Serie am Leben.",
      start: "Lern heute ein bisschen und starte eine neue Serie.",
      weekLabel: "Die letzten 7 Tage",
      today: "Heute",
      dayLearned: (day: string) => `${day}: gelernt`,
      dayNoLesson: (day: string) => `${day}: keine Lektion`,
    },
    lessons: {
      heading: "Deine Lektionen",
      doneCount: (done: number, total: number) => `${done} / ${total} fertig`,
      stateDone: "Fertig",
      stateNotStarted: "Nicht begonnen",
      stateSteps: (n: number) => `${n} ${pl(n, "Schritt", "Schritte")}`,
      stateStepsDone: (done: number, total: number) => `${done}/${total}`,
      progressLabel: (title: string) => `Fortschritt: ${title}`,
    },
    nft: {
      eyebrow: "Dein NFT-Tier",
      claimedTitle: "Dein Tier ist in deiner Wallet",
      claimedBody: "Es gehört dir, im Solana devnet – der Beweis, dass du etwas Neues gelernt hast.",
      lockedTitle: "Schaff die Lektionen und verdien dir dein Tier",
      lockedBody: (done: number, total: number) =>
        `Am Ende der Route wartet ein kleiner Meeresfreund. ${done} von ${total} ${pl(total, "Lektion", "Lektionen")} geschafft.`,
      continue: "Reise fortsetzen",
    },
    reset: {
      button: "Fortschritt zurücksetzen",
      confirm: "Alle XP, deine Serie und Lektionen löschen?",
      yes: "Ja, neu anfangen",
      no: "Fortschritt behalten",
    },
    empty: {
      title: "Hier beginnt deine Reise",
      body: "Noch ist hier nichts – und das ist perfekt. Die erste Lektion dauert etwa fünf Minuten, und alles, was du lernst, taucht auf dieser Seite auf.",
      cta: "Reise starten",
      earnXp: "XP sammeln",
      buildStreak: "Serie aufbauen",
      getAnimal: "Tier verdienen",
    },
    loading: "Dein Fortschritt lädt…",
  },

  partners: {
    page: {
      kicker: "Unsere Tipps",
      title: "🧭 Sichere Häfen",
      intro:
        "Wir haben die sichersten und freundlichsten Orte für deine weitere Reise ausgesucht. Tipp auf einen unserer Freunde und sieh, wie er dir helfen kann.",
      rewardEarned: "Belohnung verdient",
      opensInNewTab: " (öffnet in neuem Tab)",
      disclaimer: "Wir liefern Lern-Karten, keine Finanzberatung. Krypto ist riskant – fang klein an.",
    },
    cards: {
      marinade: {
        tagline: "Dein digitales Sparkonto",
        line: "Ein einfacher, sicherer Weg, deine Krypto ganz entspannt wachsen zu lassen, während du schläfst.",
        reward: "⭐️ Seestern-NFT (Übung) + Marinades 10-$-Startbonus",
        cta: "Staking-Quest starten",
        note: "Der 10-$-Bonus ist Marinades eigenes Angebot für echte Anmeldungen. Die aktuellen Bedingungen findest du auf ihrer Seite.",
      },
      trezor: {
        tagline: "Ein Safe für deine Ersparnisse",
        line: "Mehr als Taschengeld? Eine Hardware-Wallet hält deine Schlüssel offline, und nichts geht raus ohne einen Druck auf das Gerät.",
        reward: (xp: number) => `🔐 +${xp} XP`,
        cta: "Trezor entdecken",
      },
      superteam: {
        name: "Solana-Community (Superteam)",
        tagline: "Die freundliche weltweite Familie hinter unserem Netzwerk",
        line: "Zusammen macht Krypto mehr Spaß! Entdecke kostenlose Events und triff neue Freunde, die auch gerade lernen.",
        reward: (xp: number) => `🌟 +${xp} XP`,
        cta: "Solana-Community entdecken",
      },
      phantom: {
        name: "Phantom Wallet",
        tagline: "Dein echter digitaler Rucksack für jeden Tag",
        line: "Bereit, dich von der Übungs-Wallet zu verabschieden? Hol dir die offizielle App und trag deine digitalen Schätze jeden Tag sicher bei dir.",
        reward: (xp: number) => `🛡️ Abzeichen „Echter Eigentümer“ + ${xp} XP`,
        cta: "Phantom-Wallet einrichten",
      },
      bybit: {
        tagline: "Deine freundliche Wechselstube",
        line: "Bereit für echte Coins? Tausch dein normales Geld (mit Bankkarte) in Krypto und starte deine Reise.",
        reward: (xp: number) => `🎟️ +${xp} XP`,
        cta: "Zu Bybit EU",
      },
    },
    guides: {
      kicker: "Wichtige Navigationshilfen",
      title: "🗺️ Bevor du in See stichst",
      network: {
        title: "🌊 Bereit für den echten Ozean?",
        subtitle: "Devnet vs. Mainnet",
        body: (b: Bold) => [
          "In unseren Lektionen haben wir in einem Übungsbecken namens ",
          b("Devnet"),
          " gespielt. Für echte Apps geht es raus auf den echten Ozean: ins ",
          b("Mainnet"),
          ".",
        ],
        howTo: "So prüfst du dein Netzwerk in Phantom:",
        steps: [
          (b: Bold) => ["Öffne Phantom und tipp auf das Symbol ", b("Einstellungen"), " (⚙️)."],
          (b: Bold) => ["Scroll nach unten und tipp auf ", b("Entwicklereinstellungen"), "."],
          (b: Bold) => ["Such den Schalter ", b("Testnet-Modus"), " und schalte ihn ", b("aus"), "."],
        ],
        after:
          "Wenn der Testnet-Modus aus ist, siehst du deine Übungs-Coins nicht mehr. Deine Wallet ist jetzt bereit für echte digitale Schätze.",
      },
      safety: {
        title: "🛡️ Kurz zur Sicherheit",
        tips: [
          {
            title: "Deine 12-Wörter-Karte ist nur für dich",
            text: "Keine echte Firma und kein Support wird dich je nach deiner geheimen Wiederherstellungsphrase fragen. Bewahr sie auf Papier an einem sicheren Ort auf.",
          },
          {
            title: "Teste immer erst das Wasser",
            text: "Neue App ausprobieren? Schick zuerst eine winzige Testüberweisung (etwa 1 $).",
          },
          {
            title: "Segle nur mit dem, was du entbehren kannst",
            text: "Wir liefern Lern-Karten, keine Finanzberatung. Fang klein an und entdecke sicher!",
          },
        ],
      },
    },
    quest: {
      back: "← Sichere Häfen",
      kicker: "Interaktive Quest · Übung",
      title: "💧 Staking mit Marinade",
      welcome: "Willkommen zu deiner ersten Simulation aus der echten Welt!",
      conceptTitle: "Die Idee",
      concept: (b: Bold) => [
        "Stell dir ein klassisches Sparkonto vor: Du legst dein Geld dort hin, und mit der Zeit kommt ein bisschen was dazu. In Krypto heißt das ",
        b("Staking"),
        ". Marinade lässt deine Coins mithelfen, das Solana-Netzwerk zu betreiben, damit sie langsam wachsen, während du schläfst. (Wie bei jeder Geldanlage sind Belohnungen nicht garantiert.)",
      ],
      step1: {
        title: "1 Übungs-SOL einzahlen",
        done: (b: Bold, wallet: string | null) => [
          "Geschafft! Du hast ",
          b("1 mSOL"),
          ` bekommen, Marinades Quittungs-Token für „gestakte SOL“, in deiner Übungs-Wallet${wallet ? ` (${wallet})` : ""}.`,
        ],
        balance: (sol: string) =>
          `Deine Übungs-Wallet hat ${sol} SOL. Lass uns üben, 1 davon zu staken (eine Simulation: Es bewegen sich keine Coins).`,
        staking: "Wird gestakt…",
        stake: "1 Übungs-SOL staken",
      },
      step2: {
        title: "Onchain prüfen",
        done: (b: Bold, label: string, fee: number, sig: ReactNode) => [
          "✓ Quittung gefunden: ",
          b(label),
          `, Gebühr ${dec(fee)} SOL, Signatur `,
          sig,
          ". (Übungsquittung: Echte Solana-Explorer-Links gibt's mit der devnet-Wallet.)",
        ],
        verify: "🔍 Onchain prüfen",
      },
      step3: {
        title: "Hol dir deine Belohnung",
        done: (xp: number) => `⭐️ Dein Seestern (Übungs-NFT) ist in deinem Rucksack, und +${xp} XP gehören dir!`,
        claim: "🎁 Belohnung abholen (Seestern-NFT)",
      },
      realThing: (link: ReactNode) => [
        "Willst du das Original sehen? Schau auf ",
        link,
        " vorbei. Ihr 10-$-Startbonus ist ihr eigenes Angebot – prüf die aktuellen Bedingungen auf ihrer Seite. Keine Finanzberatung.",
      ],
    },
  },

  account: {
    dialog: {
      title: "Wie sollen wir dich nennen?",
      sub: "Einfach dein Vorname oder ein Spitzname. Mehr brauchen wir nicht, um deine Reise zu starten.",
      label: "Dein Name",
      placeholder: "z. B. Olya",
      submit: "Leinen los",
      privacy: "Wir speichern nur deinen Namen. Keine E-Mail, kein Passwort.",
      close: "Schließen",
    },
    hello: (name: string) => `Ahoi, ${name}! 👋`,
    progressOf: (name: string) => `Reise von ${name}`,
    earnedBy: (name: string) => `Verdient von ${name}`,
    changeName: "Name ändern",
  },

  admin: {
    title: "Kapitänsbrücke",
    sub: "Admin-Werkzeuge für Demos. Nur wer das Passwort hat, kann das hier öffnen.",
    passwordLabel: "Admin-Passwort",
    login: "Anmelden",
    errors: {
      wrong: "Das Passwort hat nicht gepasst.",
      tooMany: "Zu viele Versuche. Warte ein paar Minuten und versuch's nochmal.",
      notConfigured:
        "Admin ist noch nicht eingerichtet: Füg ADMIN_PASSWORD in Vercel → Settings → Environment Variables hinzu und deploye neu.",
      network: "Server nicht erreichbar. Prüf deine Verbindung.",
    },
    demoOn: "Demo-Modus ist in diesem Browser an",
    demoHint:
      "In jeder Lektion siehst du einen Button „⏭ Demo: weiter“. Er beantwortet die aktuelle Frage richtig und macht weiter – so kannst du die ganze Route in wenigen Minuten zeigen.",
    completeAll: "Alle Lektionen als fertig markieren",
    completeAllDone: "Erledigt! Alle Lektionen sind als fertig markiert.",
    reset: "Meinen Fortschritt zurücksetzen",
    resetDone: "Fortschritt zurückgesetzt. Neustart!",
    openRoute: "Route öffnen",
    openFinale: "Finale öffnen",
    logout: "Abmelden",
    learners: {
      title: "Registrierte Reisende",
      count: (n: number) => `${n} ${pl(n, "Reisende/r", "Reisende")}`,
      none: "Noch hat sich niemand registriert.",
      noStorage:
        "Im Moment werden Namen nur auf dem Gerät der Lernenden gespeichert. Um sie hier zu sehen, verbinde Upstash Redis in Vercel (Storage → Marketplace) und deploye neu.",
      unreachable: "Die Liste lässt sich gerade nicht laden.",
      name: "Name",
      language: "Sprache",
      joined: "Dabei seit",
      refresh: "Aktualisieren",
    },
    demoNext: "Demo: weiter",
    demoAria: "Demo-Modus: richtig antworten und weiter",
  },

  voyage: {
    allies: {
      phantom: {
        role: "Hüter der Schlüssel",
        joins: "Phantom kommt in deine Crew!",
        line: "Jetzt, wo du weißt, was eine Wallet ist, lern eine echte kennen. Phantom bewacht deine Schlüssel auf jeder Fahrt und warnt dich vor verdächtigen Anfragen.",
        cta: "Phantom holen",
      },
      bybit: {
        role: "Wechselhafen",
        joins: "Du hast den Hafen von Bybit EU erreicht!",
        line: "Unser Automat tauscht Coin gegen Coin. Im Hafen von Bybit EU kannst du Euro von deiner Bankkarte in echte Krypto tauschen – nach EU-Regeln.",
        cta: "Zu Bybit EU",
      },
      marinade: {
        role: "Leuchtturmwärter",
        joins: "Marinades Leuchtturm geht an!",
        line: "Du hast gerade Liquid Staking ausprobiert. Marinade ist das Original: SOL staken, mSOL bekommen und wachsen lassen. Probier die Übungsquest für ein Seestern-NFT.",
        cta: "Staking-Quest starten",
      },
      trezor: {
        role: "Tresorwächter",
        joins: "Trezor kommt in deine Crew!",
        line: "Deine Ersparnisse verdienen einen Tresor. Trezor ist eine Hardware-Wallet aus Prag: Deine Schlüssel bleiben offline, und nichts geht raus, bevor du den Knopf am Gerät drückst. Funktioniert mit Solana.",
        cta: "Trezor entdecken",
      },
      superteam: {
        role: "Deine Crew an Land",
        joins: "Superteam heißt dich an Land willkommen!",
        line: "Hier endet deine Reise, und deine Community beginnt. Superteam organisiert kostenlose Events, Treffen und Lernangebote für alle, die neu bei Solana sind.",
        cta: "Community kennenlernen",
      },
    },
    crew: {
      newCrewmate: "Neu in der Crew",
      title: "Deine Crew",
      empty: "Deine Crew wartet entlang der Route. Das erste Crewmitglied kommt nach Lektion 02 dazu.",
      joinsAt: (lessonLabel: string) => `Kommt bei ${lessonLabel} dazu`,
      joinsAtFinale: "Kommt beim Finale dazu",
      joined: "In deiner Crew",
      onThisStop: "An diesem Halt",
      logoAlt: (brand: string) => `${brand}-Logo`,
    },
    bosses: {
      "hype-whirlpool": {
        name: "den Strudel des Hypes",
        victory: "Das Meer ist wieder ruhig. Der Hype kann dich nicht mehr reinziehen.",
      },
      "siren-island": {
        name: "die Insel der Sirenen",
        victory: "Die Gesänge verklingen. Keine Sirene kann dich jetzt noch täuschen.",
      },
    },
    battle: {
      boss: (name: string) => `Boss: ${name}`,
      power: "Boss-Kraft",
      round: (n: number, total: number) => `Runde ${n} von ${total}`,
      strike: "Angriff!",
      nextRound: "Nächste Runde",
      finish: "Letzter Schlag! 🏆",
      shield: "Phantoms Schild",
      shieldHint: "Tipp von Phantom",
      victoryTitle: (name: string) => `Du hast ${name} besiegt!`,
      perfectHits: (hits: number, total: number) => `${hits} von ${total} perfekten Treffern`,
      defeatFirst: "Besieg erst den Boss",
    },
  },

  privacy: {
    link: "Datenschutz",
    eyebrow: "Datenschutz",
    title: "Deine Daten, einfach erklärt",
    intro:
      "Crypto Voyage ist ein kleines Lernprojekt von Olga Chernova, Studentin an der 42 Prague. Wir speichern so wenig wie möglich. Hier ist alles.",
    updated: "Zuletzt aktualisiert: Oktober 2026",
    sections: [
      {
        title: "Was wir über dich speichern",
        body: "Nur den Namen oder Spitznamen, den du eingibst. Er wird auf deinem Gerät gespeichert und, wenn unsere Datenbank eingeschaltet ist, auch auf unserem Server – zusammen mit einer zufälligen ID, deiner Sprache und den Daten deines ersten und letzten Besuchs. Keine E-Mail, kein Passwort, keine Telefonnummer.",
      },
      {
        title: "Was nur auf deinem Gerät bleibt",
        body: "Dein Fortschritt, deine XP und Serie, deine Übungs-Wallet und die verbundene Phantom-Adresse. Sie liegen im Speicher dieses Browsers und erreichen nie unseren Server.",
      },
      {
        title: "Der KI-Guide",
        body: "Wenn du den Guide etwas fragst, werden deine Frage und der Lektionsschritt, auf dem du bist, an Google Gemini geschickt, damit es eine Antwort schreiben kann. Dein Name wird nicht gesendet. Bitte tipp keine persönlichen Daten in den Chat.",
      },
      {
        title: "Besuchsstatistik",
        body: "Wir zählen Seitenbesuche mit Vercel Web Analytics. Das nutzt keine Cookies und erkennt dich nicht. Es zeigt uns nur Dinge wie, wie viele Leute eine Lektion schaffen.",
      },
      {
        title: "Die Blockchain ist öffentlich",
        body: "Alles im Solana devnet ist absichtlich öffentlich: Jede/r kann Wallet-Adressen und Transaktionen im Solana Explorer sehen. Devnet-Coins sind nichts wert.",
      },
      {
        title: "Wer uns beim Betrieb hilft",
        body: "Die Seite läuft auf Vercel, und die Namensliste wird bei Upstash gespeichert. Sie verarbeiten Daten nur in unserem Auftrag. Wir verkaufen nie Daten und zeigen nie Werbung.",
      },
      {
        title: "Warum wir das speichern",
        body: "Damit du deinen Namen nicht nochmal eintippen musst und wir sehen, wie vielen Leuten der Kurs hilft. Das ist unser berechtigtes Interesse, ihn zu betreiben und zu verbessern.",
      },
      {
        title: "Deine Rechte",
        body: "Du kannst deine Daten jederzeit ansehen, korrigieren oder löschen: Änder deinen Namen in der App oder lösch mit dem Button unten alles. Nach der DSGVO kannst du dich auch bei einer Datenschutzbehörde beschweren (in Tschechien ist das die ÚOOÚ).",
      },
    ],
    contactTitle: "Fragen?",
    contactBody: "Eröffne ein Issue auf unserer GitHub-Seite, und wir antworten dir.",
    contactLink: "Schreib uns auf GitHub",
    delete: {
      title: "Meine Daten löschen",
      body: "Entfernt deinen Namen von unserem Server und löscht alles, was diese Seite in diesem Browser gespeichert hat: Name, Fortschritt, XP und die Übungs-Wallet. Das lässt sich nicht rückgängig machen.",
      button: "Meine Daten löschen",
      confirm: "Sicher? Alles wird gelöscht.",
      yes: "Ja, löschen",
      no: "Abbrechen",
      busy: "Wird gelöscht…",
      done: "Erledigt. Alles ist gelöscht.",
      failed: "Diesen Browser haben wir geleert, aber unseren Server nicht erreicht. Versuch's später nochmal oder schreib uns.",
    },
    walletNotice:
      "Diese Übungs-Wallet lebt nur in diesem Browser. Neuer Browser oder gelöschte Daten heißt neue Wallet. Sie ist nur zum Lernen: Schick hier nie echte Krypto hin.",
  },

  share: {
    someone: "Ein/e Reisende/r",
    card: {
      doneBadge: "Kurs geschafft",
      done: (name: string) => `${name} hat Crypto Voyage durchsegelt!`,
      doneSub: (lessons: number) =>
        `${lessons} ${pl(lessons, "Lektion", "Lektionen")} über Krypto und ein echtes NFT im Solana devnet.`,
      inviteBadge: "Einladung",
      invite: (name: string) => `${name} lädt dich zu einer Krypto-Reise ein`,
      inviteSub: "Lern Krypto von null. Kurze Lektionen, sicheres Üben, kein echtes Geld.",
    },
    download: "Meine Karte laden",
    invite: "Freund einladen",
    inviteText:
      "Ich lerne Krypto mit Crypto Voyage: kurze, freundliche Lektionen und sicheres Üben auf Solana. Komm mit!",
    inviteTitle: "Hol jemanden an Bord",
    inviteBody: "Zusammen lernen macht mehr Spaß. Schick einem Freund deine Einladungskarte.",
    copied: "Link kopiert. Füg ihn irgendwo ein und teile ihn!",
    copyManually: (url: string) => `Kopier diesen Link zum Teilen: ${url}`,
    page: {
      doneTitle: (name: string) => `${name} hat Crypto Voyage geschafft`,
      inviteTitle: (name: string) => `${name} lädt dich an Bord ein`,
      body: "Kurze, freundliche Lektionen über Krypto und Solana, mit echtem Üben im devnet. Kein echtes Geld, nichts zu verlieren.",
      cta: "Meine Reise starten",
      cardAlt: "Crypto-Voyage-Karte",
    },
  },
};
