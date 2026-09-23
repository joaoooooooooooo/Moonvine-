import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { FrameCard, FrameCardContent } from "@/components/ui/frame-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const columns = [
  { accessorKey: "text", enableSorting: false },
  { accessorKey: "type", enableSorting: false },
  {
    id: "mentions",
    accessorFn: (question) => question.mentions ?? undefined,
    sortingFn: "basic",
    sortUndefined: "last",
    sortDescFirst: false,
  },
];

export function QuestionsTable({ questions }) {
  const table = useReactTable({
    data: questions,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <FrameCard className="w-full" withFill>
      <FrameCardContent className="gap-0 p-0 shadow-none before:shadow-none">
      <Table className="[&_th]:px-5 [&_td]:px-5">
        <caption className="sr-only">Questions asked in the report sample and their mention counts</caption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Question</TableHead>
            <TableHead scope="col">Type</TableHead>
            <TableHead scope="col" className="text-right">Mentions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(({ original: question, id }) => (
            <TableRow key={id}>
              <TableCell className="whitespace-normal py-4 text-sm leading-6">{question.text}</TableCell>
              <TableCell className="w-40 whitespace-normal text-xs leading-5 text-muted-foreground">{question.type}</TableCell>
              <TableCell className="text-right tabular-nums">
                {question.mentions == null ? <span aria-label="Mention count unavailable">&mdash;</span> : question.mentions.toLocaleString("en-US")}
              </TableCell>
            </TableRow>
          ))}
          {questions.length === 0 && (
            <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No questions to show.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      </FrameCardContent>

    </FrameCard>
  );
}
