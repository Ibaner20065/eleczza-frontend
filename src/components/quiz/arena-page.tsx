import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  CircuitBoard,
  Code2,
  Circle,
  ClipboardCheck,
} from "lucide-react";
import { SAMPLE_ARENAS } from "@/lib/quiz/sample-data";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

interface ArenaPageProps {
  arenaId?: string;
}

export function ArenaPage({ arenaId }: ArenaPageProps) {
  if (!arenaId) {
    const totalQuestions = SAMPLE_ARENAS.reduce(
      (total, arena) => total + arena.questions.length,
      0,
    );

    return (
      <div className="-my-4 space-y-4">
        <header className="space-y-1">
          <h1 className="font-display text-3xl font-bold text-parchment sm:text-4xl">
            Quiz Arenas
          </h1>
          <p className="text-sm text-parchment">
            Choose an arena to begin; each one contains two sample questions.
          </p>
        </header>

        <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber/35 bg-amber/10">
              <ClipboardCheck
                aria-hidden="true"
                className="h-5 w-5 text-amber"
              />
            </span>
            <div>
              <h2 className="text-sm font-bold text-parchment">
                Overall progress
              </h2>
              <p className="text-xs text-muted-foreground">
                0 of {totalQuestions} questions completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:w-2/5">
            <div
              className="h-2 flex-1 overflow-hidden rounded-full bg-umber"
              role="progressbar"
              aria-label="Quiz progress"
              aria-valuemin={0}
              aria-valuemax={totalQuestions}
              aria-valuenow={0}
            >
              <div className="h-full w-0 rounded-full bg-amber" />
            </div>
            <span className="font-mono text-xs font-semibold text-amber">
              0%
            </span>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {SAMPLE_ARENAS.map((arena) => {
            const Icon =
              arena.id === "aptitude"
                ? Calculator
                : arena.id === "code"
                  ? Code2
                  : CircuitBoard;

            return (
              <Card
                key={arena.id}
                className="flex min-h-52 flex-col p-4 transition-colors hover:border-amber/50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-amber/30 bg-amber/10">
                    <Icon aria-hidden="true" className="h-5 w-5 text-amber" />
                  </span>
                  <h2 className="font-display text-2xl font-bold text-parchment">
                    {arena.name}
                  </h2>
                </div>
                <p className="mt-3 min-h-10 flex-1 text-sm leading-relaxed text-parchment">
                  {arena.description}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-fog pt-3">
                  <span className="font-mono text-xs text-parchment">
                    {arena.questions.length} questions
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-fog px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                    <Circle aria-hidden="true" className="h-2.5 w-2.5" />
                    Not started
                  </span>
                </div>
                <Link
                  href={`/quiz/${arena.id}`}
                  className={`${buttonVariants({ variant: "default", size: "sm" })} mt-3 w-full`}
                >
                  Enter arena
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const arena = SAMPLE_ARENAS.find((item) => item.id === arenaId);

  if (!arena) {
    return (
      <section className="wood-panel space-y-4 rounded-lg p-6" role="alert">
        <p className="font-mono text-xs font-semibold tracking-widest text-amber uppercase">
          Arena unavailable
        </p>
        <h1 className="font-display text-3xl font-bold text-parchment">
          This arena is not in the current archive.
        </h1>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Return to Quiz
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-7">
      <header className="space-y-3">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-amber uppercase hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          All arenas
        </Link>
        <p className="font-mono text-xs font-semibold tracking-widest text-amber uppercase">
          Sample data
        </p>
        <h1 className="font-display text-4xl font-bold text-parchment">
          {arena.name} Arena
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-parchment">
          {arena.description}
        </p>
      </header>

      <section
        className="space-y-5"
        aria-label={`${arena.name} sample questions`}
      >
        {arena.questions.map((question, questionIndex) => (
          <article
            key={question.id}
            className="wood-panel space-y-4 rounded-lg p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4 border-b border-fog pb-3">
              <h2 className="font-display text-xl font-bold text-parchment">
                Sample question {questionIndex + 1}
              </h2>
              <span className="shrink-0 rounded border border-amber/30 bg-amber/10 px-2 py-1 font-mono text-[10px] tracking-wider text-amber uppercase">
                Sample
              </span>
            </div>
            <p className="text-sm leading-relaxed text-parchment">
              {question.prompt}
            </p>
            {question.codeSnippet && (
              <pre className="overflow-x-auto rounded border border-fog bg-umber p-4 font-mono text-xs leading-relaxed text-amber">
                <code>{question.codeSnippet}</code>
              </pre>
            )}
            <ol className="grid gap-3 sm:grid-cols-2">
              {question.options.map((option, optionIndex) => (
                <li
                  key={option.id}
                  className="flex items-center gap-3 rounded-md border border-fog bg-umber/60 p-3 text-sm text-parchment"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-fog font-mono text-xs text-amber">
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  {option.text}
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>
    </div>
  );
}
