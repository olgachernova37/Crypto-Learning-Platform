"use client";

// /admin — "Captain's deck". Password login (checked on the server), then demo tools for this
// browser and the list of registered learners (if Upstash Redis is connected).

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { LOCALE_NAMES, isLocale } from "@/i18n/locales";
import { useLocale, useT } from "@/i18n";
import { lessons } from "@/content/lessons";
import { useProgress } from "@/lib/progress";
import { adminLogin, adminLogout, useAdmin } from "@/lib/admin-client";

type Learner = { id: string; name: string; locale: string; joinedAt: string };
type List = { state: "loading" } | { state: "ok"; storage: boolean; learners: Learner[] } | { state: "error" };

const card = "rounded-[1.75rem] bg-white p-6 ring-1 ring-deep-ocean/5 shadow-[0_20px_50px_-30px_rgba(13,43,69,0.35)] sm:p-8";
const btn =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-extrabold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50";

export function AdminView() {
  const t = useT().admin;
  const { admin, ready } = useAdmin();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-6 pb-32 sm:px-8 sm:pt-10">
      <h1 className="mt-2 text-[2rem] leading-tight font-extrabold text-ink sm:text-[2.6rem]">⚓ {t.title}</h1>
      <p className="mt-2 max-w-xl text-[17px] leading-relaxed text-ink-soft">{t.sub}</p>
      <div className="mt-8">{!ready ? null : admin ? <Panel /> : <Login />}</div>
    </main>
  );
}

function Login() {
  const t = useT().admin;
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<keyof typeof t.errors | null>(null);
  const id = useId();
  return (
    <form
      className={`${card} max-w-md`}
      onSubmit={async (e) => {
        e.preventDefault();
        if (!pw || busy) return;
        setBusy(true);
        const r = await adminLogin(pw);
        setBusy(false);
        if (r !== "ok") setErr(r);
      }}
    >
      <label htmlFor={id} className="text-[15px] font-bold text-ink">
        {t.passwordLabel}
      </label>
      <input
        id={id}
        type="password"
        autoComplete="current-password"
        value={pw}
        onChange={(e) => {
          setPw(e.target.value);
          setErr(null);
        }}
        className="mt-2 block min-h-14 w-full rounded-[1.25rem] bg-foam px-5 text-[17px] text-ink ring-1 ring-ink/10 outline-none focus:ring-2 focus:ring-ocean-teal/50"
      />
      {err && (
        <p role="alert" className="mt-3 rounded-[1rem] bg-sandy-beige/35 px-4 py-3 text-[15px] font-bold text-deep-ocean">
          {t.errors[err]}
        </p>
      )}
      <button type="submit" disabled={!pw || busy} className={`${btn} mt-4 w-full bg-ocean-teal text-white hover:bg-deep-ocean disabled:opacity-60`}>
        {t.login}
      </button>
    </form>
  );
}

function Panel() {
  const t = useT().admin;
  const [locale] = useLocale();
  const { completeLesson, reset } = useProgress();
  const [msg, setMsg] = useState("");
  const [list, setList] = useState<List>({ state: "loading" });

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/learners", { cache: "no-store" });
      const d = (await r.json()) as { storage?: boolean; learners?: Learner[]; error?: string };
      setList(r.ok ? { state: "ok", storage: !!d.storage, learners: d.learners ?? [] } : { state: "error" });
    } catch {
      setList({ state: "error" });
    }
  }, []);
  useEffect(() => {
    let alive = true;
    fetch("/api/admin/learners", { cache: "no-store" })
      .then(async (r) => {
        const d = (await r.json()) as { storage?: boolean; learners?: Learner[] };
        if (alive) setList(r.ok ? { state: "ok", storage: !!d.storage, learners: d.learners ?? [] } : { state: "error" });
      })
      .catch(() => alive && setList({ state: "error" }));
    return () => {
      alive = false;
    };
  }, []);

  const date = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className={`${card} bg-[linear-gradient(180deg,#0f3350_0%,#081c2e_100%)] text-white ring-light-sky/15`}>
        <p className="flex items-center gap-2 text-lg font-extrabold">
          <span aria-hidden className="size-3 rounded-full bg-[#8ff0c4] shadow-[0_0_0_4px_rgba(143,240,196,0.25)]" />
          {t.demoOn}
        </p>
        <p className="mt-2 text-[16px] leading-relaxed text-light-sky/85">{t.demoHint}</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link href="/journey" className={`${btn} bg-white text-deep-ocean hover:bg-light-sky`}>
            {t.openRoute}
          </Link>
          <Link href="/finale" className={`${btn} bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20`}>
            {t.openFinale}
          </Link>
        </div>
      </section>

      <section className={card}>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              lessons.forEach((l) => completeLesson(l.id, l.xp));
              setMsg(t.completeAllDone);
            }}
            className={`${btn} bg-ocean-teal text-white hover:bg-deep-ocean`}
          >
            {t.completeAll}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setMsg(t.resetDone);
            }}
            className={`${btn} bg-foam text-deep-ocean ring-1 ring-ink/10 hover:bg-light-sky/35`}
          >
            {t.reset}
          </button>
          <button type="button" onClick={() => adminLogout()} className={`${btn} text-ink-soft hover:bg-foam sm:ml-auto`}>
            {t.logout}
          </button>
        </div>
        {msg && (
          <p role="status" className="mt-4 text-[15px] font-bold text-[#2f6b64]">
            {msg}
          </p>
        )}
      </section>

      <section className={card}>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-xl font-extrabold text-ink">{t.learners.title}</h2>
          {list.state === "ok" && list.storage && (
            <p className="text-[15px] font-bold text-ink-soft">{t.learners.count(list.learners.length)}</p>
          )}
        </div>
        {list.state === "loading" ? (
          <p className="mt-4 text-ink-soft">…</p>
        ) : list.state === "error" ? (
          <p className="mt-4 text-ink-soft">{t.learners.unreachable}</p>
        ) : !list.storage ? (
          <p className="mt-4 rounded-[1rem] bg-light-sky/30 px-4 py-3 text-[15px] leading-relaxed text-deep-ocean">{t.learners.noStorage}</p>
        ) : list.learners.length === 0 ? (
          <p className="mt-4 text-ink-soft">{t.learners.none}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[22rem] text-left text-[15px]">
              <thead>
                <tr className="text-ink-soft">
                  <th className="py-2 pr-3 font-bold">{t.learners.name}</th>
                  <th className="py-2 pr-3 font-bold">{t.learners.language}</th>
                  <th className="py-2 font-bold">{t.learners.joined}</th>
                </tr>
              </thead>
              <tbody>
                {list.learners.map((l) => (
                  <tr key={l.id} className="border-t border-ink/8">
                    <td className="py-2.5 pr-3 font-bold text-ink">{l.name}</td>
                    <td className="py-2.5 pr-3 text-ink-soft">{isLocale(l.locale) ? LOCALE_NAMES[l.locale] : l.locale}</td>
                    <td className="py-2.5 text-ink-soft">{date(l.joinedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button type="button" onClick={load} className={`${btn} mt-4 bg-foam text-deep-ocean ring-1 ring-ink/10 hover:bg-light-sky/35`}>
          {t.learners.refresh}
        </button>
      </section>
    </div>
  );
}
