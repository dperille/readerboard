import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Book } from "@/types/wasm";

export default function BookVoteCard({
  book,
  handleVote,
  onRemoveBook,
}: {
  book: Book;
  handleVote: () => void;
  onRemoveBook: () => void;
}) {
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;

  return (
    <Card className="w-full h-full overflow-hidden">
      <CardContent
        className="flex flex-col flex-1 p-2 cursor-pointer group min-h-0"
        onClick={handleVote}
      >
        <div className="relative w-full aspect-3/4">
          <img
            src={coverUrl}
            className="absolute w-full h-full object-contain blur-3xl scale-150 opacity-30"
            aria-hidden
          />
          <img
            src={coverUrl}
            className="absolute w-full h-full object-contain"
          />
        </div>
        <div className="p-4 flex flex-col gap-1">
          <h3 className="font-semibold leading-tight line-clamp-2">
            {book.title}
          </h3>
          <p className="text-muted-foreground text-sm">{book.author}</p>
        </div>
      </CardContent>
      <CardFooter className="border-t px-4 py-3 flex">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemoveBook}
          className="ml-auto text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Stop including this book
        </Button>
      </CardFooter>
    </Card>
  );
}
