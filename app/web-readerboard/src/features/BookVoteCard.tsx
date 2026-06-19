import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Book } from "@/types/wasm";
import BookCover from "./BookCover";

export default function BookVoteCard({
  book,
  handleVote,
  onRemoveBook,
}: {
  book: Book;
  handleVote: () => void;
  onRemoveBook: () => void;
}) {
  return (
    <Card className="transition-all w-full hover:shadow-lg hover:-translate-y-1 p-0 md:p-2 dark:border dark:border-border">
      <CardContent
        className="relative flex md:flex-col flex-1 p-2 cursor-pointer"
        onClick={handleVote}
      >
        <BookCover book={book} />

        <div className="min-w-0 p-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold leading-tight text-base md:text-xl line-clamp-2">
              {book.title}
            </h3>
            <p className="text-muted-foreground md:text-lg">{book.author}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="hidden md:flex border-t px-4 py-3 shrink-0">
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
