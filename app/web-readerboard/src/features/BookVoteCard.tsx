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
    <Card className="dark:border-border w-full p-0 transition-all hover:-translate-y-1 hover:shadow-lg md:p-2 dark:border">
      <CardContent
        className="relative flex h-full min-h-0 w-full flex-1 cursor-pointer p-2 md:flex-col md:items-center"
        onClick={handleVote}
      >
        <BookCover book={book} />

        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-1 p-4 md:flex-none">
          <div className="flex flex-col gap-1">
            <h3 className="line-clamp-3 text-base leading-tight font-semibold md:line-clamp-2 md:text-xl">
              {book.title}
            </h3>
            <p className="text-muted-foreground line-clamp-1 md:text-lg">
              {book.author}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="hidden shrink-0 border-t px-4 py-3 md:flex">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemoveBook}
          className="text-destructive hover:text-destructive ml-auto"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Stop including this book
        </Button>
      </CardFooter>
    </Card>
  );
}
