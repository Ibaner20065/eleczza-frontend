import { notFound } from "next/navigation";
import { ArenaPage } from "@/components/quiz/arena-page";
import { SAMPLE_ARENAS } from "@/lib/quiz/sample-data";

interface QuizArenaPageProps {
  params: Promise<{ arena: string }>;
}

export function generateStaticParams() {
  return SAMPLE_ARENAS.map(({ id }) => ({ arena: id }));
}

export default async function QuizArenaPage({ params }: QuizArenaPageProps) {
  const { arena } = await params;
  const isKnownArena = SAMPLE_ARENAS.some(
    (sampleArena) => sampleArena.id === arena,
  );

  if (!isKnownArena) {
    notFound();
  }

  return <ArenaPage arenaId={arena} />;
}
