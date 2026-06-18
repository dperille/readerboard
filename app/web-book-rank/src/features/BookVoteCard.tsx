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
    <Card className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
      <CardContent
        className="flex flex-col flex-1 p-2 cursor-pointer"
        onClick={handleVote}
      >
        <div className="relative w-full flex-1 min-h-24">
          <img
            src={coverUrl}
            className="absolute w-full h-full object-contain blur-xl scale-180 opacity-40"
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
      <CardFooter className="border-t px-4 py-3 flex shrink-0">
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
