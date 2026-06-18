import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Share2, Download, Maximize2, Trophy, Minimize2 } from "lucide-react";
import { wasmInstance, type BookData } from "@/types/wasm";
import ConfidenceRing from "@/components/ConfidenceRing";

export function Leaderboard({
  books,
  expanded,
  handleExpand,
}: {
  books: BookData;
  expanded: boolean;
  handleExpand: () => void;
}) {
  const sortedBooks = Object.values(books).sort((a, b) => b.rating - a.rating);

  const handleDownload = () => {
    const data = wasmInstance.getRankingData();
    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create hidden link and inject into DOM to simulate clicking
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookrank.json";

    document.body.appendChild(a);
    a.click();

    a.remove();
    URL.revokeObjectURL(url);
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 1:
        return "bg-slate-100 text-slate-700 border-slate-200";
      case 2:
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Book Leaderboard
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>

          <Button onClick={() => handleDownload()} variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleExpand}>
            {expanded && <Minimize2 className="h-4 w-4" />}
            {!expanded && <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="overflow-y-auto">
        <Table className="table-fixed">
          <TableHeader className="md:sticky md:top-0 md:bg-background">
            <TableRow>
              <TableHead className="w-20">Rank</TableHead>
              <TableHead>Book</TableHead>
              <TableHead className="w-20 text-right">Rating</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedBooks.map((book, index) => (
              <TableRow
                key={book.bookId}
                className="transition-colors hover:bg-muted/50"
              >
                <TableCell>
                  <div
                    className={`inline-flex min-w-8 items-center justify-center rounded-full border px-2 py-1 text-xs font-semibold ${getRankStyle(
                      index,
                    )}`}
                  >
                    #{index + 1}
                  </div>
                </TableCell>

                <TableCell className="font-medium">
                  <div className="flex flex-col truncate">
                    <p>{book.title}</p>
                    <p className="text-muted-foreground">{book.author}</p>
                  </div>
                </TableCell>

                <TableCell className="text-right flex gap-2 font-semibold">
                  {book.rating.toFixed(0)}
                  <ConfidenceRing
                    size={22}
                    confidence={100 / (1 + (book.rd / 150) ** 2)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
