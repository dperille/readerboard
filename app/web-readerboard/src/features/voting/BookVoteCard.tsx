import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Book } from "@/types/wasm";
import BookCover from "./BookCover";
import { motion } from "motion/react";

type AnimationState = "idle" | "removing" | "fading" | "winning" | "losing";
const variants = {
  idle: {
    opacity: 1,
    rotate: 0,
    y: 0,
  },
  fading: {
    opacity: 0,
  },
  removing: {
    opacity: 0,
    rotate: 20,
    y: 400,
  },
  winning: {
    scale: 1.12,
    y: -12,
    opacity: 1,
  },
  losing: {
    scale: 0,
    opacity: 0.4,
  },
};

export default function BookVoteCard({
  book,
  animationState,
  handleVote,
  onRemoveBook,
}: {
  book: Book;
  animationState?: AnimationState;
  handleVote: () => void;
  onRemoveBook: () => void;
}) {
  return (
    <motion.div
      className="min-h-0"
      variants={variants}
      animate={animationState}
      transition={{ duration: 0.3 }}
    >
      <Card className="dark:border-border min-h-0 w-full p-0 transition-all hover:-translate-y-1 hover:shadow-lg md:p-2 dark:border">
        <CardContent
          className="relative flex min-h-0 w-full flex-1 cursor-pointer p-2 md:flex-col md:items-center"
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

          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive absolute right-2 bottom-2 md:hidden"
            onClick={onRemoveBook}
          >
            <Trash2 className="h-6! w-6!" />
          </Button>
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
    </motion.div>
  );
}
