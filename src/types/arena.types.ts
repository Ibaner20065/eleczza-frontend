export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  prompt: string;
  options: [Option, Option, Option, Option];
  correctOptionId: string;
  codeSnippet?: string;
  diagramSlot?: {
    src: string;
    alt: string;
  };
}

export interface Arena {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}
