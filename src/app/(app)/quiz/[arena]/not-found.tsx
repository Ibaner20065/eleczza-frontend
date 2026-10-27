import Link from "next/link";
import { SearchX } from "lucide-react";

export default function ArenaNotFound() {
  return (
    <section className="wood-panel mx-auto max-w-xl space-y-5 rounded-xl p-8 text-center">
      <SearchX aria-hidden="true" className="mx-auto h-10 w-10 text-amber" />
      <div className="space-y-2">
        <p className="font-mono text-xs font-semibold tracking-widest text-amber uppercase">
          Archive entry not found
        </p>
        <h1 className="font-display text-3xl font-bold text-parchment">
          This arena is not on the register.
        </h1>
        <p className="text-sm text-parchment">
          The requested quiz arena could not be located. Return to the quiz
          index to choose an available arena.
        </p>
      </div>
      <Link
        href="/quiz"
        className="inline-flex items-center justify-center rounded-md border border-amber/60 bg-amber/10 px-4 py-2 text-xs font-semibold tracking-wider text-amber uppercase transition-colors hover:bg-amber/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
      >
        Return to Quiz
      </Link>
    </section>
  );
}
