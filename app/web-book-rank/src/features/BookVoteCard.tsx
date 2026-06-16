import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function BookVoteCard({
  title,
  author,
  isbn,
  handleVote,
  onRemoveBook,
}: {
  title: string;
  author: string;
  isbn: string;
  handleVote: () => void;
  onRemoveBook: () => void;
}) {
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-4">
        <button onClick={handleVote} className="w-full text-left">
          <div className="flex gap-4">
            <img
              src={coverUrl}
              alt={`${title} cover`}
              className="h-32 w-24 rounded-md object-cover bg-muted shadow-sm"
            />

            <div className="flex flex-1 flex-col justify-center min-w-0">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                {title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">{author}</p>
            </div>
          </div>
        </button>
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
