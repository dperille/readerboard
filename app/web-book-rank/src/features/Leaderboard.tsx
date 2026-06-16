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
import { Share2, Download, Maximize2, Trophy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Leaderboard({ books }: any) {
  const sortedBooks = Object.values(books).sort(
    (a: any, b: any) => b.rating - a.rating,
  );

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
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Book Leaderboard
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download intermediate results to resume later</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Expand</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Rank</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="text-right">Rating</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedBooks.map((book: any, index: number) => (
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

                <TableCell className="font-medium">{book.title}</TableCell>

                <TableCell className="text-muted-foreground">
                  {book.author}
                </TableCell>

                <TableCell className="text-right font-semibold">
                  {book.rating.toFixed(0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
