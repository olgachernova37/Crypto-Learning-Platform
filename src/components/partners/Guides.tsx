// Essential navigation guides: devnet vs mainnet, and a short safety note.

export function Guides() {
  return (
    <section aria-labelledby="guides-title" className="mt-14">
      <p className="label-mono text-ocean-teal">Essential navigation guides</p>
      <h2 id="guides-title" className="mt-2 text-3xl font-extrabold tracking-tight text-deep-ocean sm:text-4xl">
        🗺️ Before you set sail
      </h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <article className="rounded-[1.75rem] bg-deep-ocean p-6 text-white sm:p-7">
          <h3 className="text-xl font-extrabold">🌊 Ready for the real ocean?</h3>
          <p className="mt-1 font-semibold text-light-sky">Devnet vs. Mainnet</p>
          <p className="mt-4 leading-relaxed text-white/80">
            In our lessons we played in a practice pool called <strong className="text-white">Devnet</strong>. To use
            real apps, you step out into the real ocean: the <strong className="text-white">Mainnet</strong>.
          </p>
          <p className="mt-5 font-extrabold">How to check your network in Phantom:</p>
          <ol className="mt-3 flex flex-col gap-3">
            {[
              <>Open Phantom and tap the <strong>Settings</strong> icon (⚙️).</>,
              <>Scroll down and tap <strong>Developer Settings</strong>.</>,
              <>Find the <strong>Testnet Mode</strong> switch and turn it <strong>off</strong>.</>,
            ].map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sandy-beige font-extrabold text-deep-ocean">
                  {i + 1}
                </span>
                <span className="pt-1 leading-relaxed text-white/90">{t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 rounded-[1.1rem] bg-white/10 p-4 text-[15px] leading-relaxed text-white/80">
            When Testnet Mode is off, your practice coins won&apos;t show up any more. Your wallet is now ready for real
            digital treasures.
          </p>
        </article>

        <article className="rounded-[1.75rem] bg-white p-6 ring-1 ring-deep-ocean/5 sm:p-7">
          <h3 className="text-xl font-extrabold text-deep-ocean">🛡️ A quick note on safety</h3>
          <ul className="mt-5 flex flex-col gap-4">
            {[
              [
                "Your 12-word map is for your eyes only",
                "No real company or support person will ever ask for your secret recovery phrase. Keep it on paper, somewhere safe.",
              ],
              ["Always test the waters first", "Trying a new app? Send a tiny test transaction first (like $1)."],
              [
                "Only sail with what you can afford",
                "We provide educational maps, not financial advice. Start small and explore safely!",
              ],
            ].map(([title, text]) => (
              <li key={title} className="rounded-[1.25rem] bg-foam p-4">
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
