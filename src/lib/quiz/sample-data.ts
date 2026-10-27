// SAMPLE DATA ONLY: replace these fixtures with approved questions later.
import type { Arena } from "@/types/arena.types";

export const SAMPLE_ARENAS: Arena[] = [
  {
    id: "aptitude",
    name: "Aptitude",
    description: "Sample arithmetic questions for the aptitude arena.",
    questions: [
      {
        id: "aptitude-sample-1",
        prompt: "Sample: What is 2 + 2?",
        options: [
          { id: "a", text: "3" },
          { id: "b", text: "4" },
          { id: "c", text: "5" },
          { id: "d", text: "6" },
        ],
        correctOptionId: "b",
      },
      {
        id: "aptitude-sample-2",
        prompt: "Sample: Which number is largest?",
        options: [
          { id: "a", text: "2" },
          { id: "b", text: "4" },
          { id: "c", text: "6" },
          { id: "d", text: "8" },
        ],
        correctOptionId: "d",
      },
    ],
  },
  {
    id: "code",
    name: "Code",
    description: "Sample output-reading questions for the code arena.",
    questions: [
      {
        id: "code-sample-1",
        prompt: "Sample: What value does this snippet print?",
        codeSnippet: "const value = 2 + 3;\nconsole.log(value);",
        options: [
          { id: "a", text: "4" },
          { id: "b", text: "5" },
          { id: "c", text: "6" },
          { id: "d", text: "23" },
        ],
        correctOptionId: "b",
      },
      {
        id: "code-sample-2",
        prompt: "Sample: What number does this snippet print?",
        codeSnippet: 'const items = ["A", "B"];\nconsole.log(items.length);',
        options: [
          { id: "a", text: "1" },
          { id: "b", text: "2" },
          { id: "c", text: "3" },
          { id: "d", text: "4" },
        ],
        correctOptionId: "b",
      },
    ],
  },
  {
    id: "circuit",
    name: "Circuit",
    description: "Sample introductory questions for the circuit arena.",
    questions: [
      {
        id: "circuit-sample-1",
        prompt:
          "Sample: A complete circuit connects a cell to a bulb. What happens?",
        options: [
          { id: "a", text: "The bulb lights" },
          { id: "b", text: "The bulb disappears" },
          { id: "c", text: "The wire changes color" },
          { id: "d", text: "Nothing can happen" },
        ],
        correctOptionId: "a",
      },
      {
        id: "circuit-sample-2",
        prompt: "Sample: What can open a simple circuit?",
        options: [
          { id: "a", text: "Closing its switch" },
          { id: "b", text: "Opening its switch" },
          { id: "c", text: "Adding a label" },
          { id: "d", text: "Drawing a symbol" },
        ],
        correctOptionId: "b",
      },
    ],
  },
];
