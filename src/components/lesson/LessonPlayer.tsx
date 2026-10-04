"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Lesson } from "@/content/types";
import { lessonLabel } from "@/content/lessons";
import { useProgress } from "@/lib/progress";
import { QuizView } from "@/components/quiz/QuizView";
import { QuizFeedback } from "@/components/quiz/QuizFeedback";
import { emptyAnswer, isCorrect, isReady, type QuizAnswer } from "@/components/quiz/logic";
import { LessonIntro } from "./LessonIntro";
import { LessonHeader } from "./LessonHeader";
import { StepContent } from "./StepContent";
import { PracticeZone } from "./PracticeZone";
import { LessonComplete, type NextStop } from "./LessonComplete";
import { AskAi } from "./AskAi";
import { IconArrowLeft, IconArrowRight } from "./icons";
import m from "./motion.module.css";

const STEP_XP = 10;

type Phase = "intro" | "read" | "quiz" | "done";
type Result = { answer: QuizAnswer; correct: boolean };

export function LessonPlayer({ lesson, next }: { lesson: Lesson; next: NextStop }) {
  const { progress, completeStep, completeLesson } = useProgress();
  const [phase, setPhase] = useState<Phase>("intro");
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [draft, setDraft] = useState<QuizAnswer | null>(null);
  const [gained, setGained] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const continueBtn = useRef<HTMLButtonElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [practiceDone, setPracticeDone] = useState<Record<string, boolean>>({});

  const steps = lesson.steps;
  const step = steps[i];
  const n = steps.length;
  const result = step ? results[step.id] : undefined;
  const revealed = !!result;
  const answer = result?.answer ?? draft ?? (step?.quiz ? emptyAnswer(step.quiz) : null);
  const isLast = i === n - 1;
  const stepId = step?.id;
  const markPractice = useCallback(() => {
    if (stepId) setPracticeDone((d) => (d[stepId] ? d : { ...d, [stepId]: true }));
  }, [stepId]);
  const practicePending = !!(step?.practice && !practiceDone[step.id]);
  const claimed = progress.completedLessons.includes(lesson.id);
  const claim = () => {
    if (claimed) return;
    setGained((g) => g + lesson.xp);
    completeLesson(lesson.id, lesson.xp);
  };

  // focus the new heading + scroll up whenever the screen changes
  useEffect(() => {
    if (phase === "read" || phase === "quiz") {
      window.scrollTo({ top: 0 });
      heading.current?.focus({ preventScroll: true });
    }
  }, [phase, i]);

  const award = (stepId: string) => {
    if (!(progress.completedSteps[lesson.id] ?? []).includes(stepId)) setGained((g) => g + STEP_XP);
    completeStep(lesson.id, stepId, STEP_XP);
  };

  const goNext = () => {
    setDraft(null);
    if (isLast) {
      // the lesson XP is claimed on the completion screen ("Claim +50 XP")
      setPhase("done");
    } else {
      setI(i + 1);
      setPhase("read");
    }
  };

  const fromRead = () => {
    if (step.quiz) setPhase("quiz");
    else {
      award(step.id);
      goNext();
    }
  };

  const check = () => {
    if (!step.quiz || !answer || !isReady(step.quiz, answer)) return;
    setResults((r) => ({ ...r, [step.id]: { answer, correct: isCorrect(step.quiz!, answer) } }));
    award(step.id);
    requestAnimationFrame(() => {
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      continueBtn.current?.focus({ preventScroll: true });
    });
  };

  const back = () => {
    setDraft(null);
    if (phase === "quiz") setPhase("read");
    else if (i > 0) {
      setI(i - 1);
      setPhase(steps[i - 1].quiz ? "quiz" : "read");
    }
  };

  if (phase === "intro" || !step) return <LessonIntro lesson={lesson} onStart={() => setPhase("read")} />;

  if (phase === "done")
    return (
      <LessonComplete
        lesson={lesson}
        earned={gained}
        claimed={claimed}
        onClaim={claim}
        streak={progress.streak}
        totalXp={progress.xp}
        next={next}
      />
    );

  const value = (i + (phase === "read" ? 0.15 : revealed ? 1 : 0.55)) / n;
  const ready = !!(step.quiz && answer && isReady(step.quiz, answer));

  return (
    <div className="relative isolate min-h-dvh bg-foam">
      <div aria-hidden className="pointer-events-none fixed -top-40 -right-40 -z-10 size-[28rem] rounded-full bg-light-sky/35 blur-3xl" />
      <div aria-hidden className="pointer-events-none fixed -bottom-48 -left-40 -z-10 size-[26rem] rounded-full bg-sandy-beige/25 blur-3xl" />

      <LessonHeader value={value} step={i + 1} total={n} label={lesson.title} />

      <main className="mx-auto max-w-2xl px-5 pt-3 pb-52 sm:px-8 sm:pt-6 sm:pb-56">
        {phase === "read" ? (
          <article key={`r-${step.id}`}>
            <p className={`label-mono text-ocean-teal ${m.fadeUp}`}>
              {lessonLabel(lesson.number)} · Step {i + 1} of {n}
            </p>
            <h1
              ref={heading}
              tabIndex={-1}
              className={`mt-3 mb-6 text-[2rem] leading-[1.15] font-extrabold tracking-tight text-ink outline-none text-balance sm:text-[2.6rem] ${m.fadeUp}`}
            >
              {step.title}
            </h1>
            <StepContent step={step} />
            {step.practice && (
              <div className="mt-6">
                <PracticeZone practice={step.practice} onDone={markPractice} />
              </div>
            )}
          </article>
        ) : (
          step.quiz &&
          answer && (
            <div key={`q-${step.id}`} className={m.fadeUp}>
              <h1 ref={heading} tabIndex={-1} className="label-mono text-ocean-teal outline-none">
                Quick check · {step.title}
              </h1>
              <div className="mt-4">
                <QuizView
                  quiz={step.quiz}
                  answer={answer}
                  onChange={setDraft}
                  revealed={revealed}
                  onSubmit={check}
                />
              </div>
              <div ref={feedbackRef} className="scroll-mb-40">
                {result && <QuizFeedback quiz={step.quiz} correct={result.correct} xp={STEP_XP} />}
              </div>
            </div>
          )
        )}
      </main>

      <AskAi
        key={`${step.id}`}
        context={{
          lessonTitle: lesson.title,
          stepTitle: step.title,
          quizQuestion: phase === "quiz" ? step.quiz?.question : undefined,
        }}
      />

      {/* bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/6 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg">
        <div className="mx-auto flex min-h-[5.5rem] max-w-2xl items-center justify-between gap-3 px-4 sm:min-h-24 sm:px-8">
          {phase === "quiz" && revealed ? (
            <div className="hidden min-w-0 sm:block">
              <p className="label-mono text-seafoam">Keep exploring</p>
              <p className="truncate text-[15px] font-bold text-ink-soft">
                {isLast ? "That's the last step, well done!" : `Next: ${steps[i + 1].title}`}
              </p>
            </div>
          ) : phase === "quiz" || i > 0 ? (
            <button
              type="button"
              onClick={back}
              className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-[16px] font-bold text-ink-soft transition hover:bg-light-sky/35 hover:text-ink focus-visible:outline-3 focus-visible:outline-ocean-teal/50"
            >
              <IconArrowLeft width={18} height={18} />
              {phase === "quiz" ? "Reread" : "Back"}
            </button>
          ) : (
            <span />
          )}

          {phase === "read" && (
            <PrimaryButton onClick={fromRead} disabled={practicePending}>
              {practicePending ? "Try the practice first" : step.quiz ? "Quick check" : isLast ? "Finish lesson" : "Continue"}
            </PrimaryButton>
          )}
          {phase === "quiz" && !revealed && (
            <PrimaryButton onClick={check} disabled={!ready}>
              Check
            </PrimaryButton>
          )}
          {phase === "quiz" && revealed && (
            <PrimaryButton onClick={goNext} ref={continueBtn} wide>
              {isLast ? "Finish lesson" : "Continue"}
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  wide,
  ref,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  wide?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-ocean-teal px-8 text-[17px] font-extrabold text-white shadow-[0_12px_28px_-14px_rgba(30,90,110,0.95)] transition hover:-translate-y-0.5 hover:bg-deep-ocean focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ocean-teal/50 active:translate-y-0 disabled:translate-y-0 disabled:bg-ink/12 disabled:text-ink/40 disabled:shadow-none ${
        wide ? "flex-1 sm:flex-none" : ""
      }`}
    >
      {children}
      <IconArrowRight width={20} height={20} />
    </button>
  );
}
