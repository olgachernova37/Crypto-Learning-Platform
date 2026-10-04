import type { Quiz } from "@/content/types";
import { IconCheck, IconSparkle } from "@/components/lesson/icons";
import { ASK_AI_OPEN_EVENT, GuideAvatar } from "@/components/lesson/AskAi";
import { cheerFor, rightAnswerText } from "./logic";
import m from "@/components/lesson/motion.module.css";

/** Shown right after "Check". Wrong answers get the right one + why, no retry loop. */
export function QuizFeedback({ quiz, correct, xp }: { quiz: Quiz; correct: boolean; xp: number }) {
  return (
    <div
      role="status"
      className={`${m.fadeUp} mt-6 rounded-[1.5rem] p-5 sm:p-6 ${
        correct ? "bg-seafoam/15 ring-1 ring-seafoam/50" : "bg-sandy-beige/30 ring-1 ring-sandy-beige"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={`grid size-10 shrink-0 place-items-center rounded-full ${
            correct ? "bg-seafoam text-white" : "bg-sandy-beige text-deep-ocean"
          }`}
        >
          {correct ? <IconCheck width={20} height={20} /> : <IconSparkle width={20} height={20} />}
        </span>
        <p className="flex-1 text-lg font-extrabold text-ink">
          {correct ? cheerFor(quiz.question) : "Not quite, and that's okay."}
        </p>
        <span className="shrink-0 rounded-full bg-white/80 px-2.5 py-1 text-xs font-extrabold text-ocean-teal ring-1 ring-ocean-teal/15">
          +{xp} XP
        </span>
      </div>
      <div className="mt-3 sm:pl-[3.25rem]">
        {!correct && (
          <p className="text-[17px] font-bold text-deep-ocean">
            {quiz.kind === "match" ? (
              "The correct pairs are shown above."
            ) : (
              <>
                The right answer: <span className="text-[#2f6b64]">{rightAnswerText(quiz)}</span>
              </>
            )}
          </p>
        )}
        <p className="mt-2 text-[17px] leading-relaxed text-ink/80">{quiz.explanation}</p>
        {!correct && (
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent(ASK_AI_OPEN_EVENT, { detail: { ask: "Why was my answer wrong?" } }))
            }
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-sea-night py-1 pr-4 pl-1 text-[15px] font-extrabold text-white transition hover:bg-ocean-teal focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/60"
          >
            <GuideAvatar size={34} />
            Still unsure? Ask the AI guide why
          </button>
        )}
      </div>
    </div>
  );
}
