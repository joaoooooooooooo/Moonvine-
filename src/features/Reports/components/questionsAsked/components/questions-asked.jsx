import { useState } from "react";
import { cn } from "@/lib/utils";
import { QuestionTypeFilter } from "./question-type-filter";
import { QuestionsTable } from "./questions-table";

export function QuestionsAsked({ questions = [], className }) {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const types = [...new Set(questions.map((question) => question.type))];
  const visibleQuestions = selectedTypes.length === 0
    ? questions
    : questions.filter((question) => selectedTypes.includes(question.type));

  return (
    <div className={cn("flex w-full flex-col gap-5", className)}>
      <QuestionsTable
        questions={visibleQuestions}
        toolbar={<QuestionTypeFilter types={types} value={selectedTypes} onValueChange={setSelectedTypes} />}
      />
    </div>
  );
}
