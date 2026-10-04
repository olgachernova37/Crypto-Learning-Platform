"use client";

// Essential navigation guides: devnet vs mainnet, and a short safety note.

import { useT } from "@/i18n";

export function Guides() {
  const g = useT().partners.guides;
  const b = (text: string) => (
    <strong key={text} className="text-white">
      {text}
    </strong>
  );
  const bStep = (text: string) => <strong key={text}>{text}</strong>;
  return (
    <section aria-labelledby="guides-title" className="mt-14">
      <p className="label-mono text-ocean-teal">{g.kicker}</p>
      <h2 id="guides-title" className="mt-2 text-3xl font-extrabold tracking-tight text-deep-ocean sm:text-4xl">
        {g.title}
      </h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <article className="rounded-[1.75rem] bg-deep-ocean p-6 text-white sm:p-7">
          <h3 className="text-xl font-extrabold">{g.network.title}</h3>
          <p className="mt-1 font-semibold text-light-sky">{g.network.subtitle}</p>
          <p className="mt-4 leading-relaxed text-white/80">{g.network.body(b)}</p>
          <p className="mt-5 font-extrabold">{g.network.howTo}</p>
          <ol className="mt-3 flex flex-col gap-3">
            {g.network.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sandy-beige font-extrabold text-deep-ocean">
                  {i + 1}
                </span>
                <span className="pt-1 leading-relaxed text-white/90">{step(bStep)}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 rounded-[1.1rem] bg-white/10 p-4 text-[15px] leading-relaxed text-white/80">
            {g.network.after}
          </p>
        </article>

        <article className="rounded-[1.75rem] bg-white p-6 ring-1 ring-deep-ocean/5 sm:p-7">
          <h3 className="text-xl font-extrabold text-deep-ocean">{g.safety.title}</h3>
          <ul className="mt-5 flex flex-col gap-4">
            {g.safety.tips.map(({ title, text }, i) => (
              <li key={i} className="rounded-[1.25rem] bg-foam p-4">
                <p className="font-extrabold text-deep-ocean">{title}</p>
                <p className="mt-1 leading-relaxed text-ink-soft">{text}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
